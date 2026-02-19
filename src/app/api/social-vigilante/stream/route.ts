import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";
import { queryVertexSearch } from "@/lib/vertex-search";
import { writeFirestoreDocument } from "@/lib/firestore-admin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

const SOCIAL_SERVING_CONFIG =
    process.env.VERTEX_SOCIAL_SERVING_CONFIG || process.env.VERTEX_SOCIAL_RAG_SERVING_CONFIG || "";

type Platform = "twitter" | "facebook" | "instagram" | "reddit" | "reclameaqui";
type Sentiment = "negative" | "neutral" | "positive";
type RiskLevel = "critical" | "high" | "medium" | "low";

function extractJsonArray(text: string): string {
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Model response did not contain a JSON array");
    return match[0];
}

function normalizePlatform(value: unknown): Platform {
    const raw = String(value || "").toLowerCase();
    if (raw.includes("insta")) return "instagram";
    if (raw.includes("face")) return "facebook";
    if (raw.includes("reddit")) return "reddit";
    if (raw.includes("reclame")) return "reclameaqui";
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

function heuristicSentiment(text: string): Sentiment {
    const lower = text.toLowerCase();
    if (/dor|náusea|nausea|grave|reação|reacao|hospital|evento adverso|efeito colateral/.test(lower)) return "negative";
    if (/melhora|estável|estavel|positivo|controle/.test(lower)) return "positive";
    return "neutral";
}

function heuristicRisk(text: string): RiskLevel {
    const lower = text.toLowerCase();
    if (/uti|hospital|grave|urgência|urgencia|óbito|obito|sangramento/.test(lower)) return "critical";
    if (/evento adverso|efeito colateral|desvio de qualidade|interação medicamentosa|interacao/.test(lower)) return "high";
    if (/desconforto|náusea|nausea|dor|tontura/.test(lower)) return "medium";
    return "low";
}

function parseTimestamp(value: unknown): string {
    if (!value) return new Date().toISOString();
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

async function generateSyntheticPosts(term: string): Promise<GeminiPost[]> {
    const prompt = `Você é um sistema de monitoramento de farmacovigilância em redes sociais.
Gere ${3 + Math.floor(Math.random() * 3)} posts REALISTAS que poderiam ser encontrados em redes sociais brasileiras sobre "${term}".

Os posts devem simular o que REALMENTE seria publicado por pacientes, profissionais de saúde ou cuidadores em plataformas brasileiras.
Varie as plataformas, sentimentos e níveis de risco. Inclua pelo menos 1 post com risco alto ou crítico (evento adverso real).

Retorne APENAS JSON array:
[
  {
    "platform": "twitter|facebook|instagram|reddit|reclameaqui",
    "author": "nome realista brasileiro",
    "content": "texto do post em português, máximo 180 caracteres",
    "sentiment": "negative|neutral|positive",
    "riskLevel": "critical|high|medium|low",
    "event": "tipo de evento detectado (ex: reação adversa, queixa de eficácia, efeito colateral)"
  }
]`;

    const generation = await model.generateContent(prompt);
    const responseText = generation.response.text();
    const parsed = JSON.parse(extractJsonArray(responseText));
    if (!Array.isArray(parsed)) return [];
    return parsed;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const keyword = typeof body.keyword === "string" ? body.keyword.trim().slice(0, 120) : "";
        const term = keyword || "";

        if (!term) {
            return NextResponse.json({ error: "Informe um termo para monitoramento." }, { status: 400 });
        }

        // Try RAG with Vertex Search if configured
        let useRag = false;
        let ragPosts: any[] = [];

        if (SOCIAL_SERVING_CONFIG) {
            try {
                const references = await queryVertexSearch({
                    servingConfig: SOCIAL_SERVING_CONFIG,
                    query: term,
                    pageSize: 12,
                });

                if (references.length > 0) {
                    useRag = true;

                    // Classify with Gemini
                    const classifyPrompt = `Classifique sinais de farmacovigilância para "${term}".\n\nItens:\n${references.map((item) => `- id: ${item.id}\ntexto: ${item.snippet.slice(0, 260)}`).join("\n")}\n\nRetorne APENAS JSON array com:\n[\n  {\n    "id": "id original",\n    "platform": "twitter|facebook|instagram|reddit|reclameaqui",\n    "sentiment": "negative|neutral|positive",\n    "riskLevel": "critical|high|medium|low",\n    "event": "evento detectado",\n    "author": "autor se identificável"\n  }\n]`;

                    let classified: any[] = [];
                    try {
                        const gen = await model.generateContent(classifyPrompt);
                        classified = JSON.parse(extractJsonArray(gen.response.text()));
                    } catch { /* use heuristics */ }

                    const byId = new Map(classified.map((item: any) => [item.id, item]));

                    ragPosts = references.slice(0, 10).map((doc, index) => {
                        const meta = doc.metadata || {};
                        const predicted = byId.get(doc.id);
                        const sentiment = predicted?.sentiment ? normalizeSentiment(predicted.sentiment) : heuristicSentiment(doc.snippet);
                        const riskLevel = predicted?.riskLevel ? normalizeRisk(predicted.riskLevel) : heuristicRisk(doc.snippet);

                        return {
                            id: doc.id || `doc-${index}`,
                            platform: normalizePlatform(predicted?.platform || (meta as Record<string, unknown>).platform),
                            author: predicted?.author || String((meta as Record<string, unknown>).author || "").trim() || "Fonte indexada",
                            handle: "@monitoring",
                            avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(doc.id)}`,
                            content: doc.snippet,
                            timestamp: parseTimestamp(predicted?.timestamp || (meta as Record<string, unknown>).timestamp),
                            likes: 0,
                            shares: 0,
                            sentiment,
                            riskLevel,
                            aiAnalysis: {
                                detectedEvent: predicted?.event || "Sinal detectado",
                                drugMentioned: term,
                                complianceFlag: riskLevel === "critical" || riskLevel === "high",
                                confidence: 0.84,
                            },
                            status: "new",
                        };
                    });
                }
            } catch (ragError) {
                console.warn("Vertex Search unavailable, using Gemini generation:", ragError instanceof Error ? ragError.message : ragError);
            }
        }

        // Fallback: generate synthetic posts with Gemini
        if (!useRag) {
            try {
                const syntheticPosts = await generateSyntheticPosts(term);
                const now = Date.now();

                ragPosts = syntheticPosts.map((post, index) => {
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

        const posts = ragPosts;
        const highRiskCount = posts.filter((post: any) => post.riskLevel === "critical" || post.riskLevel === "high").length;

        await writeFirestoreDocument("social_vigilante_runs", {
            term,
            retrievalCount: posts.length,
            postCount: posts.length,
            highRiskCount,
            source: useRag ? "vertex-search" : "gemini-generated",
            model: GEMINI_TEXT_MODEL,
            createdAt: new Date().toISOString(),
        }).catch(() => null);

        return NextResponse.json({
            posts,
            source: useRag ? "vertex-search" : "gemini-generated",
            retrievalCount: posts.length,
            highRiskCount,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Social Vigilante API error:", message);
        return NextResponse.json(
            { error: "Falha no monitoramento. Verifique se GOOGLE_API_KEY está configurada.", details: message },
            { status: 500 }
        );
    }
}
