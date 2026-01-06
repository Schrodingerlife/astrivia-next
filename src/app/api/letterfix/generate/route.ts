
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const parseDataUrl = (dataUrl: string) => {
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match || !match[1] || !match[2]) {
        throw new Error("Invalid image payload.");
    }
    return {
        mimeType: match[1],
        base64: match[2],
    };
};

export async function POST(req: NextRequest) {
    if (!GOOGLE_API_KEY) {
        return NextResponse.json(
            { error: "Missing GOOGLE_API_KEY environment variable." },
            { status: 500 }
        );
    }

    try {
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
        const body = await req.json();
        const { image, fields } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Campo "image" é obrigatório.' },
                { status: 400 }
            );
        }

        if (!Array.isArray(fields)) {
            return NextResponse.json(
                { error: 'Campo "fields" deve ser um array.' },
                { status: 400 }
            );
        }

        // Check if there are any changes
        const changes = fields
            .filter((field: any) => field && typeof field === "object" && field.value !== field.originalValue)
            .map((field: any) => `- Change "${field.originalValue}" to "${field.value}"`)
            .join("\n");

        // If no changes, return original image
        if (!changes) {
            return NextResponse.json({ image });
        }

        const { mimeType, base64 } = parseDataUrl(image);

        // Use Gemini with image generation capabilities (Imagen 3)
        // Note: Using gemini-2.0-flash-exp as per original code, which supports image generation
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                responseModalities: ["image", "text"],
            } as any,
        });

        const prompt = `You are an expert digital image editor specialized in pharmaceutical packaging. 
Your task is to edit the text in this image with PIXEL-PERFECT precision.

Required changes:
${changes}

Instructions:
1. LOCATE the exact text to be changed in the image
2. REMOVE the original text completely, reconstructing the background seamlessly
3. MATCH the original font style, size, color, weight, and alignment exactly
4. RENDER the new text in the exact same position as the original
5. PRESERVE all other elements of the image unchanged

Critical rules:
- The edit must be indistinguishable from a professional design
- Maintain all original textures, shadows, and lighting
- Do NOT add any watermarks or artifacts
- Return ONLY the edited image`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64,
                },
            },
        ]);

        const response = result.response;
        const parts = response.candidates?.[0]?.content?.parts;

        if (!parts || parts.length === 0) {
            console.error("Gemini returned no parts", response);
            return NextResponse.json(
                { error: "A IA não retornou uma imagem gerada." },
                { status: 502 }
            );
        }

        // Find the image part in the response
        const imagePart = parts.find((part: any) => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            const generatedImage = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
            return NextResponse.json({ image: generatedImage });
        }

        // If no image was generated, return error
        console.error("No image in Gemini response", parts);
        return NextResponse.json(
            { error: "A IA não conseguiu gerar a imagem editada. Tente novamente com uma imagem diferente." },
            { status: 502 }
        );
    } catch (error: any) {
        console.error("Error during image generation", error);

        // Check for specific error types
        if (error.message?.includes("SAFETY")) {
            return NextResponse.json(
                { error: "A imagem foi bloqueada por políticas de segurança." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Falha ao gerar a nova imagem. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}
