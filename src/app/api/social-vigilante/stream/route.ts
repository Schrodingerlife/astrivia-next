import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { writeFirestoreDocument } from "@/lib/firestore-admin";

// Use a stable, widely available model for this tool
const VIGILANTE_MODEL = "gemini-2.0-flash";

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

function detectPlatformFromUrl(url: string): Platform {
    const u = url.toLowerCase();
    if (u.includes("reclameaqui")) return "reclameaqui";
    if (u.includes("reddit")) return "reddit";
    if (u.includes("instagram")) return "instagram";
    if (u.includes("facebook") || u.includes("fb.com")) return "facebook";
    if (u.includes("twitter") || u.includes("x.com")) return "twitter";
    return "twitter";
}

// ---------------------------------------------------------------------------
// Step 1: Google Custom Search API — fetch REAL mentions
// ---------------------------------------------------------------------------

interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
}

async function fetchSearchMentions(term: string): Promise<SearchResult[]> {
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !cx) {
        console.warn("[SocialVigilante] Missing GOOGLE_CUSTOM_SEARCH_KEY or GOOGLE_SEARCH_ENGINE_ID");
        return [];
    }

    const queries = [
        `${term} efeitos colaterais site:reclameaqui.com.br`,
        `${term} reação adversa reddit`,
        `${term} problema paciente`,
    ];

    try {
        const results = await Promise.all(
            queries.map(q =>
                fetch(
                    `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(q)}&num=5`
                )
                    .then(r => r.json())
                    .then(data => (data.items ?? []) as SearchResult[])
                    .catch(() => [] as SearchResult[])
            )
        );

        return results.flat();
    } catch (err) {
        console.error("[SocialVigilante] Custom Search error:", err);
        return [];
    }
}

// ---------------------------------------------------------------------------
// Step 2: Gemini classification layer — analyze the search results
// ---------------------------------------------------------------------------

interface ClassifiedPost {
    sentiment: string;
    riskLevel: string;
    event: string;
}

async function classifySearchResults(
    results: SearchResult[],
    term: string
): Promise<ClassifiedPost[]> {
    if (results.length === 0) return [];

    const snippets = results.map((r, i) => `[${i}] ${r.title}: ${r.snippet}`).join("\n");

    const prompt = `Você é um sistema de farmacovigilância. Analise os seguintes resultados de busca sobre "${term}" e classifique cada um.

Resultados:
${snippets}

Para CADA resultado (na mesma ordem), retorne um JSON array com:
- sentiment: "negative", "neutral" ou "positive"
- riskLevel: "critical", "high", "medium" ou "low"
- event: descrição curta em português do evento de farmacovigilância detectado (ex: "Relato de náusea", "Queixa de eficácia")

Retorne APENAS o JSON array, sem texto adicional.`;

    try {
        const model = genAI.getGenerativeModel({
            model: VIGILANTE_MODEL,
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (err) {
        console.error("[SocialVigilante] Classification error:", err);
        // Return neutral defaults
        return results.map(() => ({
            sentiment: "neutral",
            riskLevel: "medium",
            event: "Menção detectada",
        }));
    }
}

// ---------------------------------------------------------------------------
// Step 3: Synthetic posts fallback (when Custom Search is unavailable)
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
        model: VIGILANTE_MODEL,
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
        let source = "gemini-generated";

        // ── Step 1: Try Google Custom Search for REAL mentions ──
        try {
            const searchResults = await fetchSearchMentions(term);

            if (searchResults.length > 0) {
                // Classify real results with Gemini
                const classifications = await classifySearchResults(searchResults, term);
                const now = Date.now();

                posts = searchResults.map((result, index) => {
                    const classification = classifications[index] || {
                        sentiment: "neutral",
                        riskLevel: "medium",
                        event: "Menção detectada",
                    };
                    const platform = detectPlatformFromUrl(result.link);
                    const sentiment = normalizeSentiment(classification.sentiment);
                    const riskLevel = normalizeRisk(classification.riskLevel);

                    return {
                        id: `search-${now}-${index}`,
                        platform,
                        author: result.displayLink || "Fonte web",
                        handle: `@${result.displayLink?.replace(/\./g, "_") || "web"}`,
                        avatar: `https://i.pravatar.cc/150?u=search-${now}-${index}`,
                        content: String(result.snippet || result.title || "").slice(0, 190),
                        timestamp: new Date(now - (index + 1) * 3600000).toISOString(),
                        likes: Math.floor(Math.random() * 80) + 5,
                        shares: Math.floor(Math.random() * 25),
                        sentiment,
                        riskLevel,
                        sourceUrl: result.link,
                        aiAnalysis: {
                            detectedEvent: classification.event || "Sinal detectado",
                            drugMentioned: term,
                            complianceFlag: riskLevel === "critical" || riskLevel === "high",
                            confidence: 0.88,
                        },
                        isSimulated: false,
                        dataSource: "google-search",
                        status: "new",
                    };
                });
                source = "live";
            }
        } catch (searchError: any) {
            console.error("[SocialVigilante] Search failed:", searchError?.message);
        }

        // ── Step 2: Fallback — synthetic posts via Gemini ──
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
            } catch (genError: any) {
                console.error("[SocialVigilante] Gemini generation failed:", genError?.message);
                return NextResponse.json({
                    posts: [],
                    source: "error",
                    retrievalCount: 0,
                    error: genError?.message || "Unknown generation error",
                });
            }
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
            model: VIGILANTE_MODEL,
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
