
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
        const { image } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Campo "image" é obrigatório.' },
                { status: 400 }
            );
        }

        const { mimeType, base64 } = parseDataUrl(image);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert OCR system specialized in pharmaceutical packaging and labels.
    
Extract every distinct text element from the provided image and output a JSON array where each item has:
- "label": a concise description based on the visual context (e.g., "Product Name", "Dosage", "Expiry Date", "Lot Number")
- "value": the exact text as it appears in the image

Important:
- Extract ALL visible text elements
- Maintain exact spelling, capitalization, and formatting
- Return ONLY the JSON array, no additional commentary
- If no text is found, return an empty array []

Example output format:
[
  {"label": "Product Name", "value": "MODROAL SERVER"},
  {"label": "Dosage", "value": "50 Capsules"}
]`;

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
        const textContent = response.text()?.trim();

        if (!textContent) {
            console.error("Gemini returned empty response");
            return NextResponse.json(
                { error: "A IA não retornou dados. Tente novamente com outra imagem." },
                { status: 502 }
            );
        }

        // Clean the response - remove markdown code blocks if present
        let cleanedContent = textContent;
        if (cleanedContent.startsWith("```json")) {
            cleanedContent = cleanedContent.slice(7);
        } else if (cleanedContent.startsWith("```")) {
            cleanedContent = cleanedContent.slice(3);
        }
        if (cleanedContent.endsWith("```")) {
            cleanedContent = cleanedContent.slice(0, -3);
        }
        cleanedContent = cleanedContent.trim();

        let parsed;
        try {
            parsed = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error("Failed to parse Gemini response", { textContent, parseError });
            return NextResponse.json(
                { error: "Não foi possível analisar a imagem. Envie uma imagem mais nítida ou tente novamente." },
                { status: 502 }
            );
        }

        if (!Array.isArray(parsed)) {
            if (parsed && typeof parsed === "object" && "label" in parsed && "value" in parsed) {
                parsed = [parsed];
            } else {
                console.error("Unexpected data structure from Gemini", parsed);
                return NextResponse.json(
                    { error: "A IA retornou dados em formato inesperado." },
                    { status: 502 }
                );
            }
        }

        return NextResponse.json({ fields: parsed });
    } catch (error) {
        console.error("Error during image analysis", error);
        return NextResponse.json(
            { error: "Falha ao analisar a imagem. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}
