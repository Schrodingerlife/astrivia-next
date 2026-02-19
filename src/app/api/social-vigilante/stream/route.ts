import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const keyword = typeof body.keyword === "string" ? body.keyword.trim().slice(0, 100) : "";
        const term = keyword || "medicamento genérico";

        const prompt = `Você é um sistema avançado de farmacovigilância em redes sociais. Gere posts REALISTAS e ÚNICOS simulando monitoramento de redes sociais brasileiras sobre "${term}".

REGRAS:
- Cada post deve ser COMPLETAMENTE DIFERENTE em tom, contexto, autor e plataforma
- Use linguagem REAL de cada plataforma (gírias do Twitter, tom informal do Reddit, reclamações detalhadas do ReclameAqui, emojis do Instagram)
- Inclua reações adversas REAIS e específicas de "${term}" baseadas em bulas e literatura médica real
- NÃO repita padrões. Cada post conta uma história diferente
- Timestamps das últimas 24 horas
- SEMPRE retorne JSON válido, sem markdown, sem crases

Gere exatamente 3 posts:
1. NEGATIVO: relato de evento adverso real e específico (use termos MedDRA quando possível)
2. NEUTRO: dúvida, comparação entre tratamentos, ou pedido de informação
3. POSITIVO ou sinal de uso off-label/uso indevido que merece atenção regulatória

JSON array puro:
[{"id":"${Date.now()}-1","platform":"twitter"|"instagram"|"reddit"|"reclameaqui","author":"nome brasileiro","handle":"@usuario","avatar":"https://i.pravatar.cc/150?u=SEED_UNICO","content":"texto pt-BR mínimo 2 frases com linguagem natural da plataforma","timestamp":"ISO date recente","likes":0,"shares":0,"sentiment":"positive"|"neutral"|"negative","riskLevel":"low"|"medium"|"high"|"critical","aiAnalysis":{"detectedEvent":"termo técnico do evento ou null","drugMentioned":"${term}","complianceFlag":true|false,"confidence":0.85}}]`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Robust JSON cleaning
        let cleanedJson = responseText
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

        // Extract JSON array if there's extra text around it
        const arrayMatch = cleanedJson.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            cleanedJson = arrayMatch[0];
        }

        const posts = JSON.parse(cleanedJson);

        if (!Array.isArray(posts) || posts.length === 0) {
            throw new Error("Invalid response structure");
        }

        // Validate and sanitize each post
        const validatedPosts = posts.map((post: any, i: number) => ({
            id: post.id || `gen-${Date.now()}-${i}`,
            platform: post.platform || "twitter",
            author: post.author || "Usuário",
            handle: post.handle || "@user",
            avatar: post.avatar || `https://i.pravatar.cc/150?u=${Date.now()}-${i}`,
            content: post.content || "",
            timestamp: post.timestamp || new Date().toISOString(),
            likes: typeof post.likes === "number" ? post.likes : 0,
            shares: typeof post.shares === "number" ? post.shares : 0,
            sentiment: post.sentiment || "neutral",
            riskLevel: post.riskLevel || "medium",
            aiAnalysis: post.aiAnalysis ? {
                detectedEvent: post.aiAnalysis.detectedEvent || null,
                drugMentioned: post.aiAnalysis.drugMentioned || term,
                complianceFlag: !!post.aiAnalysis.complianceFlag,
                confidence: post.aiAnalysis.confidence || null,
            } : undefined,
            status: "new",
        }));

        return NextResponse.json({ posts: validatedPosts });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Social Vigilante API error:", message);
        return NextResponse.json(
            { error: "Failed to generate data", details: message },
            { status: 500 }
        );
    }
}
