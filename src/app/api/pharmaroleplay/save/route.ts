import { writeFirestoreDocument } from "@/lib/firestore-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const sessionId = typeof body.sessaoId === "string" ? body.sessaoId : crypto.randomUUID();

        const result = await writeFirestoreDocument(
            "pharmaroleplay_sessions",
            {
                sessaoId: sessionId,
                scoreGeral: body.scoreGeral ?? 0,
                aprovado: body.aprovado ?? false,
                cenario: body.cenario ?? "",
                dificuldade: body.dificuldade ?? "",
                resumo: body.resumo ?? {},
                scores: body.scores ?? {},
                sugestoes: body.sugestoes ?? [],
                analiseDetalhada: body.analiseDetalhada ?? [],
                transcricaoCompleta: body.transcricaoCompleta ?? [],
                createdAt: new Date().toISOString(),
            },
            sessionId
        );

        return NextResponse.json({ success: true, id: result?.id ?? sessionId });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Save session error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
