import { NextResponse } from "next/server";
import { getGoogleAccessToken, getGoogleProjectId } from "@/lib/google-auth";
import { queryVertexSearch } from "@/lib/vertex-search";

/**
 * GET /api/medsafe/test-rag
 * Diagnostic endpoint — tests Vertex Search connectivity for MedSafe RAG.
 */
export async function GET() {
    const results: Record<string, unknown> = {};

    // 1. Serving config
    const servingConfig = (
        process.env.VERTEX_MEDSAFE_SERVING_CONFIG ||
        process.env.VERTEX_MEDSAFE_RAG_SERVING_CONFIG ||
        ""
    ).trim();
    results.servingConfig = servingConfig || "(null — VERTEX_MEDSAFE_SERVING_CONFIG not set)";
    if (!servingConfig) {
        return NextResponse.json({ ok: false, results }, { status: 503 });
    }

    // 2. Project ID
    const projectId = getGoogleProjectId();
    results.projectId = projectId ?? "(null — check GOOGLE_CLOUD_PROJECT or quota_project_id in credentials)";
    if (!projectId) {
        return NextResponse.json({ ok: false, results }, { status: 503 });
    }

    // 3. Access token
    try {
        const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/cloud-platform"]);
        results.accessToken = token ? "ok (obtained)" : "(null — credentials missing or invalid)";
        if (!token) return NextResponse.json({ ok: false, results }, { status: 503 });
    } catch (e: unknown) {
        results.accessToken = "error";
        results.accessTokenError = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ ok: false, results }, { status: 503 });
    }

    // 4. Vertex Search query
    try {
        const docs = await queryVertexSearch({
            servingConfig,
            query: "alegação terapêutica propaganda medicamento",
            pageSize: 3,
        });
        results.vertexSearch = `ok — ${docs.length} doc(s) returned`;
        results.sampleDocs = docs.map((d) => ({ id: d.id, title: d.title, snippetLength: d.snippet.length }));
    } catch (e: unknown) {
        results.vertexSearch = "error";
        results.vertexSearchError = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ ok: false, results }, { status: 503 });
    }

    return NextResponse.json({ ok: true, results });
}
