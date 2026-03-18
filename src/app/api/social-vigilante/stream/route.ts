import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL, GEMINI_TEXT_FALLBACK_MODEL, GEMINI_LITE_MODEL } from "@/lib/ai-models";
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
    return "reddit";
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

function parseTimestamp(value: unknown): string {
    if (!value) return new Date().toISOString();
    if (typeof value === "number") return new Date(value * 1000).toISOString();
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

interface GeminiPost {
    platform: string;
    author: string;
    content: string;
    sentiment: string;
    riskLevel: string;
    event: string;
    timestamp?: string;
}

// ---------------------------------------------------------------------------
// Synthetic posts fallback
// ---------------------------------------------------------------------------

async function generateSyntheticPosts(term: string): Promise<GeminiPost[]> {
    const count = 6 + Math.floor(Math.random() * 4);
    const prompt = `Você é um sistema de monitoramento de farmacovigilância em redes sociais brasileiras.
Gere EXATAMENTE ${count} posts REALISTAS e DIVERSOS simulando o que REALMENTE seria publicado por pacientes, profissionais de saúde, cuidadores ou consumidores em plataformas brasileiras sobre "${term}".

REGRAS OBRIGATÓRIAS:
1. Cada post deve ser sobre "${term}" no contexto de SAÚDE e MEDICAMENTOS
2. Varie as plataformas: twitter, reddit, reclameaqui, facebook e instagram
3. Varie os sentimentos: negative, neutral e positive
4. Varie os riscos: pelo menos 1 post "critical" ou "high"
5. Conteúdo autêntico e em português
6. Inclua relatos de efeitos colaterais e queixas
7. Responda APENAS com o JSON array.`;

    // Use a model that is guaranteed to exist and work
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", 
        generationConfig: {
            responseMimeType: "application/json"
        }
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

        let posts: unknown[] = [];
        let source = "gemini-generated";

        // Step 1: Try Grounding with Google Search (disabled until billing is activated)
        // Uncomment the following when Google Search Grounding is enabled:
        // const grounded = await fetchGroundedPosts(term);
        // if (grounded.posts.length > 0) { ... }

        // Step 2: Generate AI-powered pharmacovigilance posts
        if (posts.length === 0) {
            source = "gemini-generated";
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
            } catch (genError) {
                console.error("Gemini generation failed:", genError);
                return NextResponse.json({
                    posts: [],
                    source: "error",
                    retrievalCount: 0,
                });
            }
        }

        const highRiskCount = posts.filter((post: unknown) => {
            const p = post as { riskLevel: string };
            return p.riskLevel === "critical" || p.riskLevel === "high";
        }).length;

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
