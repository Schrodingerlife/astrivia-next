import { getGoogleProjectId } from "@/lib/google-auth";
import { writeFirestoreDocument, listFirestoreDocuments } from "@/lib/firestore-admin";
import { NextResponse } from "next/server";

/**
 * GET /api/pharmaroleplay/test-db
 * Diagnostic endpoint — verifies Firestore read/write connectivity.
 * Safe to call from the browser.
 */
export async function GET() {
    const results: Record<string, unknown> = {};

    // 1. Project ID
    const projectId = getGoogleProjectId();
    results.projectId = projectId ?? "(null — missing GOOGLE_CLOUD_PROJECT or quota_project_id in credentials)";
    if (!projectId) {
        return NextResponse.json({ ok: false, results }, { status: 503 });
    }

    // 2. Write test
    try {
        const docId = `_test_${Date.now()}`;
        await writeFirestoreDocument("_db_test", { ping: "pong", ts: new Date().toISOString() }, docId);
        results.write = "ok";
        results.writeDocId = docId;
    } catch (e: unknown) {
        results.write = "error";
        results.writeError = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ ok: false, results }, { status: 503 });
    }

    // 3. List sessions
    try {
        const docs = await listFirestoreDocuments("pharmaroleplay_sessions", { limit: 5 });
        results.listSessions = `ok — ${docs.length} doc(s) found`;
    } catch (e: unknown) {
        results.listSessions = "error";
        results.listError = e instanceof Error ? e.message : String(e);
    }

    return NextResponse.json({ ok: true, results });
}
