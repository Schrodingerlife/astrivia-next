import { getGoogleAccessToken, getGoogleQuotaProject } from "@/lib/google-auth";

const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

export interface VertexSearchDocument {
    id: string;
    title: string;
    snippet: string;
    uri?: string;
    score?: number;
    metadata?: Record<string, unknown>;
}

interface VertexSearchOptions {
    servingConfig: string;
    query: string;
    pageSize?: number;
}

function normalizeServingConfig(servingConfig: string): string {
    return servingConfig.replace(/^\/+/, "");
}

function sanitizeSnippet(value: string): string {
    return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickSnippet(document: any): string {
    const derived = document?.derivedStructData || {};
    const snippetFromSnippets = derived?.snippets?.[0]?.snippet;
    if (typeof snippetFromSnippets === "string" && snippetFromSnippets.trim()) {
        return sanitizeSnippet(snippetFromSnippets);
    }

    const extractiveSegment = derived?.extractive_segments?.[0]?.content || derived?.extractiveSegments?.[0]?.content;
    if (typeof extractiveSegment === "string" && extractiveSegment.trim()) {
        return sanitizeSnippet(extractiveSegment);
    }

    const structData = document?.structData || {};
    const contentCandidate = structData?.content || structData?.text || structData?.body || structData?.description;
    if (typeof contentCandidate === "string" && contentCandidate.trim()) {
        return sanitizeSnippet(contentCandidate).slice(0, 420);
    }

    return "";
}

export async function queryVertexSearch(options: VertexSearchOptions): Promise<VertexSearchDocument[]> {
    const servingConfig = normalizeServingConfig(options.servingConfig);
    if (!servingConfig) return [];

    const accessToken = await getGoogleAccessToken([CLOUD_PLATFORM_SCOPE]);
    if (!accessToken) {
        throw new Error("Google service account is not configured for Vertex Search");
    }
    const quotaProject = getGoogleQuotaProject();

    const endpoint = `https://discoveryengine.googleapis.com/v1/${servingConfig}:search`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...(quotaProject ? { "x-goog-user-project": quotaProject } : {}),
        },
        body: JSON.stringify({
            query: options.query,
            pageSize: options.pageSize ?? 8,
        }),
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Vertex Search failed: ${response.status} ${details.slice(0, 240)}`);
    }

    const payload = await response.json();
    const results = Array.isArray(payload?.results) ? payload.results : [];

    return results
        .map((item: any, index: number): VertexSearchDocument | null => {
            const document = item?.document || {};
            const docId = document?.id || document?.name?.split("/").pop() || `doc-${index}`;
            const title =
                document?.structData?.title ||
                document?.structData?.name ||
                document?.derivedStructData?.title ||
                "Documento sem título";
            const snippet = pickSnippet(document);
            if (!snippet) return null;

            return {
                id: String(docId),
                title: String(title),
                snippet,
                uri: document?.structData?.uri || document?.structData?.url || document?.derivedStructData?.link,
                score: typeof item?.score === "number" ? item.score : undefined,
                metadata: document?.structData || {},
            };
        })
        .filter((item: VertexSearchDocument | null): item is VertexSearchDocument => item !== null);
}
