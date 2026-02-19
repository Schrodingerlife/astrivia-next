import { listFirestoreDocuments } from "@/lib/firestore-admin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const docs = await listFirestoreDocuments("pharmaroleplay_sessions", {
            limit: 30,
            orderBy: "createdAt",
        });

        const sessions = docs.map(({ id, data }) => ({
            id,
            sessaoId: data.sessaoId ?? id,
            cenario: data.cenario ?? "",
            dificuldade: data.dificuldade ?? "",
            scoreGeral: data.scoreGeral ?? 0,
            aprovado: data.aprovado ?? false,
            createdAt: data.createdAt ?? "",
            resumo: data.resumo ?? {},
        }));

        return NextResponse.json({ sessions });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("List sessions error:", message);
        return NextResponse.json({ sessions: [], error: message });
    }
}
