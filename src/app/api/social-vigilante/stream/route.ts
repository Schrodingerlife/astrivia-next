import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL, GEMINI_TEXT_FALLBACK_MODEL, GEMINI_LITE_MODEL } from "@/lib/ai-models";
import { writeFirestoreDocument } from "@/lib/firestore-admin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const API_KEY = process.env.GOOGLE_API_KEY || "";

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

// ---------------------------------------------------------------------------
// Grounding with Google Search — Single Gemini REST call
// ---------------------------------------------------------------------------

interface GroundedPost {
    platform: string;
    author: string;
    content: string;
    sentiment: string;
    riskLevel: string;
    event: string;
    sourceUrl?: string;
    timestamp?: string;
}

async function fetchGroundedPosts(term: string): Promise<{ posts: GroundedPost[]; searchQueries: string[] }> {
    const prompt = `Você é um sistema avançado de farmacovigilância.
Busque menções REAIS e RECENTES (últimos 30 dias) sobre "${term}" em:
- Reddit (subreddits de saúde e farmácia)
- Reclame Aqui
- Fóruns de saúde brasileiros
- Twitter/X
- Facebook (grupos de pacientes)

Para cada menção encontrada, retorne um JSON array com os seguintes campos:
- platform: a plataforma de origem (twitter, facebook, instagram, reddit, reclameaqui)
- author: nome de usuário ou autor (se disponível, senão invente um realista para a plataforma)
- content: texto resumido do post (máximo 190 caracteres)
- sentiment: negative, neutral ou positive
- riskLevel: critical, high, medium ou low (baseado na gravidade do evento adverso)
- event: descrição curta em português do evento detectado (ex: "Náusea persistente reportada", "Queixa de eficácia")
- sourceUrl: URL de origem quando disponível (se não souber a URL exata, deixe vazio)
- timestamp: data aproximada no formato ISO quando disponível

IMPORTANTE:
- Retorne SOMENTE resultados relevantes para farmacovigilância (eventos adversos, efeitos colaterais, queixas de eficácia, interações medicamentosas, relatos de uso).
- Inclua pelo menos 1 resultado com risco alto ou crítico se existir.
- NÃO invente posts. Use SOMENTE informações encontradas via busca.
- Retorne entre 5-12 posts.
- Responda APENAS com o JSON array, sem texto adicional.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    tools: [{ google_search: {} }],
                    generationConfig: {
                        temperature: 0.3,
                    },
                }),
            }
        );

        clearTimeout(timeout);

        if (!response.ok) {
            const errorBody = await response.text().catch(() => "");
            console.error(`[SocialVigilante] Grounding API returned ${response.status}:`, errorBody);
            return { posts: [], searchQueries: [] };
        }

        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text || "";
        const searchQueries: string[] = candidate?.groundingMetadata?.webSearchQueries || [];

        // Parse the JSON from the grounded response
        const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (!match) {
            console.warn("[SocialVigilante] Grounding response did not contain a JSON array");
            return { posts: [], searchQueries };
        }

        const parsed = JSON.parse(match[0]);
        if (!Array.isArray(parsed)) return { posts: [], searchQueries };

        return { posts: parsed, searchQueries };
    } catch (err) {
        clearTimeout(timeout);
        console.error("[SocialVigilante] Grounding fetch error:", err instanceof Error ? err.message : err);
        return { posts: [], searchQueries: [] };
    }
}

// ---------------------------------------------------------------------------
// Synthetic posts fallback (kept from before)
// ---------------------------------------------------------------------------

interface GeminiPost {
    platform: string;
    author: string;
    content: string;
    sentiment: string;
    riskLevel: string;
    event: string;
    timestamp?: string;
}

async function generateSyntheticPosts(term: string): Promise<GeminiPost[]> {
    const prompt = `Você é um sistema de monitoramento de farmacovigilância em redes sociais.
Gere ${4 + Math.floor(Math.random() * 3)} posts REALISTAS que poderiam ser encontrados em redes sociais brasileiras sobre "${term}".

Os posts devem simular o que REALMENTE seria publicado por pacientes, profissionais de saúde ou cuidadores em plataformas brasileiras.
Varie as plataformas, sentimentos e níveis de risco. Inclua pelo menos 1 post com risco alto ou crítico (evento adverso real).`;

    const model = genAI.getGenerativeModel({
        model: GEMINI_LITE_MODEL,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        platform: { type: SchemaType.STRING, format: "enum", enum: ["twitter", "facebook", "instagram", "reddit", "reclameaqui"] },
                        author: { type: SchemaType.STRING },
                        content: { type: SchemaType.STRING },
                        sentiment: { type: SchemaType.STRING, format: "enum", enum: ["negative", "neutral", "positive"] },
                        riskLevel: { type: SchemaType.STRING, format: "enum", enum: ["critical", "high", "medium", "low"] },
                        event: { type: SchemaType.STRING }
                    },
                    required: ["platform", "author", "content", "sentiment", "riskLevel", "event"]
                }
            },
            thinkingConfig: {
                thinkingBudgetTargetCount: 1024
            }
        } as any
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

        // Step 1: Try Grounding with Google Search
        const grounded = await fetchGroundedPosts(term);

        if (grounded.posts.length > 0) {
            const now = Date.now();
            const mappedPosts = grounded.posts.map((post, index) => {
                const platform = normalizePlatform(post.platform);
                const sentiment = normalizeSentiment(post.sentiment);
                const riskLevel = normalizeRisk(post.riskLevel);

                return {
                    id: `grounded-${now}-${index}`,
                    platform,
                    author: post.author || "Usuário",
                    handle: post.author ? `@${post.author.replace(/\s/g, "").toLowerCase()}` : "@monitoring",
                    avatar: `https://i.pravatar.cc/150?u=grounded-${now}-${index}`,
                    content: String(post.content || "").slice(0, 190),
                    timestamp: post.timestamp ? parseTimestamp(post.timestamp) : new Date(now - (index + 1) * 3600000).toISOString(),
                    likes: Math.floor(Math.random() * 80) + 5,
                    shares: Math.floor(Math.random() * 25),
                    sentiment,
                    riskLevel,
                    sourceUrl: post.sourceUrl || undefined,
                    aiAnalysis: {
                        detectedEvent: post.event || "Sinal detectado",
                        drugMentioned: term,
                        complianceFlag: riskLevel === "critical" || riskLevel === "high",
                        confidence: 0.85,
                    },
                    isSimulated: false,
                    dataSource: "google-search",
                    status: "new",
                };
            });

            source = "live";
            posts = mappedPosts;
        }

        // Step 2: Fallback — generate synthetic posts with Gemini
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
