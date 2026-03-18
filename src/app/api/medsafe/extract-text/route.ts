import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GEMINI_TEXT_MODEL, GEMINI_TEXT_FALLBACK_MODEL } from "@/lib/ai-models";
import fs from "fs";
import os from "os";
import path from "path";

const SUPPORTED_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
]);

const EXTRACTION_PROMPT = `Extraia TODO o texto visível neste documento com fidelidade máxima.
Inclua textos em imagens, tabelas, cabeçalhos, rodapés e qualquer texto impresso ou manuscrito.
Preserve a estrutura: use quebras de linha para separar seções, mantenha a ordem de leitura natural.
Retorne APENAS o texto extraído — sem comentários, sem explicações, sem marcadores adicionais.`;

/**
 * POST /api/medsafe/extract-text
 * Extracts text from a PDF or image using Gemini Vision (with OCR).
 * Body: { fileBase64: string, mimeType: string }
 */
export async function POST(req: Request) {
    let tempFilePath = "";
    let uploadedFileName = "";
    let fileManager: GoogleAIFileManager | null = null;

    try {
        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ error: "GOOGLE_API_KEY não configurado" }, { status: 503 });
        }

        const body = await req.json();
        const { fileBase64, mimeType } = body;

        if (!fileBase64 || typeof fileBase64 !== "string") {
            return NextResponse.json({ error: "fileBase64 é obrigatório" }, { status: 400 });
        }

        const normalizedMime = mimeType === "image/jpg" ? "image/jpeg" : (mimeType || "");
        if (!SUPPORTED_MIME_TYPES.has(normalizedMime)) {
            return NextResponse.json(
                { error: `Tipo de arquivo não suportado: ${mimeType}` },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const modelNames = [GEMINI_TEXT_MODEL, GEMINI_TEXT_FALLBACK_MODEL].filter(Boolean);

        let extracted = "";
        let lastError: unknown;
        let fileUri = "";

        // Para application/pdf, subir via File API (obrigatório/recomendado para Gemini em PDFs)
        if (normalizedMime === "application/pdf") {
            fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
            const buffer = Buffer.from(fileBase64, "base64");
            tempFilePath = path.join(os.tmpdir(), `medsafe-upload-${Date.now()}.pdf`);
            fs.writeFileSync(tempFilePath, buffer);

            const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                mimeType: "application/pdf",
                displayName: "MedSafe PDF Analysis",
            });
            
            uploadedFileName = uploadResponse.file.name;
            let fileState = uploadResponse.file.state;

            // Esperar o processamento do documento no backend do Google (até 15s)
            if (fileState === 'PROCESSING') {
                for (let i = 0; i < 5; i++) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    const getFile = await fileManager.getFile(uploadedFileName);
                    if (getFile.state === 'ACTIVE' || getFile.state === 'FAILED') {
                        fileState = getFile.state;
                        break;
                    }
                }
            }

            if (fileState === 'FAILED') {
                throw new Error("O processamento do PDF falhou na API do Google.");
            }

            fileUri = uploadResponse.file.uri;
        }

        for (const modelName of modelNames) {
            try {
                const m = genAI.getGenerativeModel({ model: modelName });
                
                const part = normalizedMime === "application/pdf" && fileUri
                    ? { fileData: { mimeType: "application/pdf", fileUri: fileUri } }
                    : { inlineData: { data: fileBase64, mimeType: normalizedMime } };

                const result = await m.generateContent([
                    part,
                    EXTRACTION_PROMPT,
                ]);
                extracted = result.response.text().trim();
                if (extracted) break;
            } catch (err) {
                console.warn(`[extract-text] Model ${modelName} failed:`, err instanceof Error ? err.message : err);
                lastError = err;
            }
        }

        // Cleanup da File API local e remoto
        if (uploadedFileName && fileManager) {
            await fileManager.deleteFile(uploadedFileName).catch(console.error);
        }
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        if (!extracted) {
            const details = lastError instanceof Error ? lastError.message : "Nenhum texto encontrado";
            return NextResponse.json({ error: "Nenhum texto encontrado no documento", details }, { status: 422 });
        }

        return NextResponse.json({ text: extracted, charCount: extracted.length });
    } catch (error: unknown) {
        // Emergency cleanup
        if (uploadedFileName && fileManager) {
            fileManager.deleteFile(uploadedFileName).catch(console.error);
        }
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Extract-text error:", message);
        return NextResponse.json(
            { error: "Falha na extração de texto", details: message },
            { status: 500 }
        );
    }
}
