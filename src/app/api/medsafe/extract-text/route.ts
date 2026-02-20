import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";

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

/**
 * POST /api/medsafe/extract-text
 * Extracts text from a PDF or image using Gemini Vision (with OCR).
 * Body: { fileBase64: string, mimeType: string }
 */
export async function POST(req: Request) {
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
        const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

        const result = await model.generateContent([
            {
                inlineData: {
                    data: fileBase64,
                    mimeType: normalizedMime,
                },
            },
            `Extraia TODO o texto visível neste documento com fidelidade máxima.
Inclua textos em imagens, tabelas, cabeçalhos, rodapés e qualquer texto impresso ou manuscrito.
Preserve a estrutura: use quebras de linha para separar seções, mantenha a ordem de leitura natural.
Retorne APENAS o texto extraído — sem comentários, sem explicações, sem marcadores adicionais.`,
        ]);

        const text = result.response.text().trim();

        if (!text) {
            return NextResponse.json(
                { error: "Nenhum texto encontrado no documento" },
                { status: 422 }
            );
        }

        return NextResponse.json({ text, charCount: text.length });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Extract-text error:", message);
        return NextResponse.json(
            { error: "Falha na extração de texto", details: message },
            { status: 500 }
        );
    }
}
