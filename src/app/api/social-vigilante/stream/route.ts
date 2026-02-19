import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";
import { writeFirestoreDocument } from "@/lib/firestore-admin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

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
    if (/pain|nausea|náusea|grave|reaction|reação|hospital|adverse event|side effect|efeito colateral/.test(lower)) return "negative";
    if (/improvement|melhora|stable|estável|positive|positivo|control|controle/.test(lower)) return "positive";
    return "neutral";
}

function heuristicRisk(text: string): RiskLevel {
    const lower = text.toLowerCase();
    if (/icu|uti|hospital|serious|grave|urgent|urgência|death|óbito|bleeding|sangramento/.test(lower)) return "critical";
    if (/adverse event|evento adverso|side effect|efeito colateral|quality deviation|drug interaction/.test(lower)) return "high";
    if (/discomfort|desconforto|nausea|náusea|pain|dor|dizziness|tontura/.test(lower)) return "medium";
    return "low";
}

function parseTimestamp(value: unknown): string {
    if (!value) return new Date().toISOString();
    // Reddit uses Unix timestamps
    if (typeof value === "number") return new Date(value * 1000).toISOString();
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

interface RedditPost {
    id: string;
    title: string;
    selftext: string;
    author: string;
    subreddit: string;
    permalink: string;
    score: number;
    num_comments: number;
    created_utc: number;
    url: string;
}

async function fetchRedditPosts(term: string): Promise<RedditPost[]> {
    const encoded = encodeURIComponent(term);
    const url = `https://www.reddit.com/search.json?q=${encoded}&sort=new&limit=20&type=link`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                "User-Agent": "AstriviaAI/1.0 (pharmacovigilance monitoring; contact: contact@astriviaai.tech)",
                "Accept": "application/json",
            },
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Reddit API returned ${response.status}`);
        }

        const data = await response.json();
        const children = data?.data?.children;
        if (!Array.isArray(children)) return [];

        return children
            .map((child: { data: RedditPost }) => child.data)
            .filter((post: RedditPost) => post && post.title);
    } catch {
        clearTimeout(timeout);
        return [];
    }
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

interface ClassifiedPost {
    index: number;
    sentiment: string;
    riskLevel: string;
    event: string;
    relevant: boolean;
}

async function classifyRedditPosts(posts: RedditPost[], term: string): Promise<ClassifiedPost[]> {
    const items = posts.slice(0, 15).map((post, i) => {
        const text = [post.title, post.selftext].filter(Boolean).join(" ").slice(0, 300);
        return `- index: ${i}\n  text: ${text}`;
    }).join("\n");

    const prompt = `Você é um especialista em farmacovigilância. Analise estes posts do Reddit relacionados a "${term}" e classifique cada um.

Posts:
${items}

Para cada post, determine:
- Se é RELEVANTE para farmacovigilância (eventos adversos, efeitos colaterais, queixas de eficácia, uso clínico)
- Sentimento: negative|neutral|positive
- Nível de risco: critical|high|medium|low
- Evento detectado (descrição curta em português)

Retorne APENAS JSON array:
[
  {
    "index": 0,
    "relevant": true,
    "sentiment": "negative|neutral|positive",
    "riskLevel": "critical|high|medium|low",
    "event": "descrição do evento"
  }
]`;

    try {
        const gen = await model.generateContent(prompt);
        const classified = JSON.parse(extractJsonArray(gen.response.text()));
        if (!Array.isArray(classified)) return [];
        return classified;
    } catch {
        return [];
    }
}

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

        // Try real Reddit search first
        const redditRaw = await fetchRedditPosts(term);

        if (redditRaw.length > 0) {
            source = "reddit-live";

            // Classify with Gemini for pharmavigilance relevance
            const classified = await classifyRedditPosts(redditRaw, term);
            const byIndex = new Map(classified.map((c) => [c.index, c]));

            const mappedPosts = redditRaw.slice(0, 15).map((post, index) => {
                const meta = byIndex.get(index);
                const text = [post.title, post.selftext].filter(Boolean).join(" ");
                const sentiment = meta?.sentiment ? normalizeSentiment(meta.sentiment) : heuristicSentiment(text);
                const riskLevel = meta?.riskLevel ? normalizeRisk(meta.riskLevel) : heuristicRisk(text);
                const content = post.selftext?.trim()
                    ? post.selftext.slice(0, 190)
                    : post.title.slice(0, 190);

                return {
                    id: `reddit-${post.id}`,
                    platform: "reddit" as Platform,
                    author: post.author || "reddit_user",
                    handle: `u/${post.author || "reddit_user"}`,
                    avatar: `https://i.pravatar.cc/150?u=reddit-${post.id}`,
                    content,
                    timestamp: parseTimestamp(post.created_utc),
                    likes: post.score || 0,
                    shares: post.num_comments || 0,
                    sentiment,
                    riskLevel,
                    sourceUrl: `https://reddit.com${post.permalink}`,
                    subreddit: post.subreddit,
                    aiAnalysis: {
                        detectedEvent: meta?.event || "Sinal detectado",
                        drugMentioned: term,
                        complianceFlag: riskLevel === "critical" || riskLevel === "high",
                        confidence: meta?.relevant ? 0.88 : 0.62,
                    },
                    status: "new",
                };
            });

            // Keep only relevant posts, or all if none classified as relevant
            const relevant = mappedPosts.filter((_, i) => byIndex.get(i)?.relevant !== false);
            posts = relevant.length > 0 ? relevant : mappedPosts.slice(0, 8);
        }

        // Fallback: generate synthetic posts with Gemini
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
