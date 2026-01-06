import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
// Usando Gemini 2.0 para alta velocidade e capacidade de gerar JSON estruturado complexo
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function POST(req: Request) {
    try {
        const { keyword } = await req.json();
        const term = keyword || "medicamento genérico";

        // Prompt para gerar dados sintéticos realistas de redes sociais E a análise de farmacovigilância
        // Simulando a pipeline completa: Ingestão -> BigQuery/NLP -> Insights
        const prompt = `
            Atue como uma Engine de Simulação de Farmacovigilância Avançada baseada em BigQuery ML e Vertex AI.
            
            Gere 4 posts de redes sociais (Twitter, Instagram, Reddit ou ReclameAqui) sobre o termo: "${term}".
            
            Para cada post, você DEVE gerar também a análise técnica de farmacovigilância baseada no texto.
            Misture sentimentos e riscos (tontura, dor de cabeça, elogios, dúvidas).
            
            Retorne APENAS um JSON array puro com este formato (sem markdown):
            [
                {
                    "id": "string (uuid)",
                    "platform": "twitter" | "instagram" | "reddit" | "reclameaqui",
                    "author": "string (nome realista)",
                    "handle": "string (usuario)",
                    "avatar": "url (use https://i.pravatar.cc/150?u=... com seed aleatoria)",
                    "content": "string (texto do post, pt-BR, gírias realistas)",
                    "timestamp": "ISO String (data recente)",
                    "likes": number,
                    "shares": number,
                    "sentiment": "positive" | "neutral" | "negative",
                    "riskLevel": "low" | "medium" | "high" | "critical",
                    "aiAnalysis": {
                        "detectedEvent": "string (ex: Cefaléia, Náusea, Ineficácia - ou null se baixo risco)",
                        "drugMentioned": "${term}",
                        "complianceFlag": boolean (true se precisa reportar anvisa)
                    }
                }
            ]
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Limpeza básica do JSON
        const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const posts = JSON.parse(cleanedJson);

        return NextResponse.json({ posts });

    } catch (error) {
        console.error("Error simulating social stream:", error);
        return NextResponse.json(
            { error: "Failed to generate simulation data" },
            { status: 500 }
        );
    }
}
