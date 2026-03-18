import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";
import { writeFirestoreDocument } from "@/lib/firestore-admin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

type Platform = "twitter" | "facebook" | "instagram" | "reddit" | "reclameaqui";
type Sentiment = "negative" | "neutral" | "positive";
type RiskLevel = "critical" | "high" | "medium" | "low";

function normalizePlatform(value: unknown): Platform {
    const raw = String(value || "").toLowerCase();
    if (raw.includes("insta")) return "instagram";
    if (raw.includes("face")) return "facebook";
    if (raw.includes("reddit")) return "reddit";
    if (raw.includes("reclame")) return "reclameaqui";
    if (raw.includes("twitter") || raw.includes(" x ")) return "twitter";
    return "twitter";
}

function normalizeSentiment(value: unknown): Sentiment {
    const raw = String(value || "").toLowerCase();
    if (raw.includes("neg")) return "negative";
    if (raw.includes("pos")) return "positive";
    return "neutral";
}

function normalizeRisk(value: unknown): RiskLevel {
    const raw = String(value || "").toLowerCase();
    if (raw.includes("crit")) return "critical";
    if (raw.includes("high") || raw.includes("alto")) return "high";
    if (raw.includes("low") || raw.includes("baixo")) return "low";
    return "medium";
}

// ---------------------------------------------------------------------------
// Synthetic posts — Gemini 3.1 Flash
// ---------------------------------------------------------------------------

interface GeminiPost {
    platform: string;
    author: string;
    content: string;
    sentiment: string;
    riskLevel: string;
    event: string;
}

async function generateSyntheticPosts(term: string): Promise<GeminiPost[]> {
    const count = 6 + Math.floor(Math.random() * 4);
    const prompt = `Você é um sistema de monitoramento de farmacovigilância em redes sociais brasileiras.
Gere EXATAMENTE ${count} posts REALISTAS e DIVERSOS simulando o que seria publicado por pacientes, profissionais de saúde ou consumidores sobre "${term}".

REGRAS:
1. Cada post sobre "${term}" no contexto de SAÚDE e MEDICAMENTOS
2. Varie as plataformas: twitter, reddit, reclameaqui, facebook e instagram
3. Varie os sentimentos: negative, neutral e positive
4. Pelo menos 1 post "critical" ou "high"
5. Conteúdo autêntico em português
6. Responda APENAS com o JSON array com campos: platform, author, content, sentiment, riskLevel, event.`;

    const model = genAI.getGenerativeModel({
        model: GEMINI_TEXT_MODEL, // gemini-3.1-flash
        generationConfig: {
            responseMimeType: "application/json",
        },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const keyword = typeof body.keyword === "string" ? body.keyword.trim().slice(0, 120) : "";
        const term = keyword || "";

        if (!term) {
            return NextResponse.json({ error: "Informe um termo para monitoramento." }, { status: 400 });
        }

        let posts: any[] = [];
        const source = "gemini-generated";

        try {
            const syntheticPosts = await generateSyntheticPosts(term);
            const now = Date.now();

            posts = syntheticPosts.map((post, index) => {
                const platform = normalizePlatform(post.platform);
                const sentiment = normalizeSentiment(post.sentiment);
                const riskLevel = normalizeRisk(post.riskLevel);
                const hoursAgo = Math.floor(Math.random() * 48) + 1;

                return {
                    id: `gen-${now}-${index}`,
                    platform,
                    author: post.author || "Usuário anônimo",
                    handle: "@monitoring",
                    avatar: `https://i.pravatar.cc/150?u=gen-${index}`,
                    content: String(post.content || "").slice(0, 190),
                    timestamp: new Date(now - hoursAgo * 3600000).toISOString(),
                    likes: Math.floor(Math.random() * 50),
                    shares: Math.floor(Math.random() * 15),
                    sentiment,
                    riskLevel,
                    aiAnalysis: {
                        detectedEvent: post.event || "Sinal detectado",
                        drugMentioned: term,
                        complianceFlag: riskLevel === "critical" || riskLevel === "high",
                        confidence: 0.72,
                    },
                    isSimulated: true,
                    dataSource: "gemini",
                    status: "new",
                };
            });
        } catch (genError: any) {
            console.error("[SocialVigilante] Gemini generation failed:", genError?.message);
            return NextResponse.json({
                posts: [],
                source: "error",
                retrievalCount: 0,
                error: genError?.message || "Unknown generation error",
            });
        }

        const highRiskCount = posts.filter(
            (p: any) => p.riskLevel === "critical" || p.riskLevel === "high"
        ).length;

        await writeFirestoreDocument("social_vigilante_runs", {
            term,
            retrievalCount: posts.length,
            postCount: posts.length,
            highRiskCount,
            source,
            model: GEMINI_TEXT_MODEL,
            createdAt: new Date().toISOString(),
        }).catch(() => null);

        return NextResponse.json({
            posts,
            source,
            retrievalCount: posts.length,
            highRiskCount,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Social Vigilante API error:", message);
        return NextResponse.json(
            { error: "Falha no monitoramento em tempo real", details: message },
            { status: 500 }
        );
    }
}
