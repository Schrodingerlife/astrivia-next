import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";
import { queryVertexSearch } from "@/lib/vertex-search";
import { writeFirestoreDocument } from "@/lib/firestore-admin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

const MEDSAFE_SERVING_CONFIG =
    (process.env.VERTEX_MEDSAFE_SERVING_CONFIG || process.env.VERTEX_MEDSAFE_RAG_SERVING_CONFIG || "").trim();

interface MedsafeReference {
    docId: string;
    title: string;
    trecho: string;
    uri?: string;
}

function extractJsonObject(text: string): string {
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model response did not contain a JSON object");
    return match[0];
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const texto = typeof body.texto === "string" ? body.texto.trim().slice(0, 12000) : "";

        if (!texto) {
            return NextResponse.json({ error: "Texto vazio" }, { status: 400 });
        }

        if (!MEDSAFE_SERVING_CONFIG) {
            return NextResponse.json(
                { error: "VERTEX_MEDSAFE_SERVING_CONFIG não está configurado para RAG." },
                { status: 503 }
            );
        }

        const references = await queryVertexSearch({
            servingConfig: MEDSAFE_SERVING_CONFIG,
            query: texto.slice(0, 600),
            pageSize: 8,
        });

        if (!references.length) {
            return NextResponse.json(
                { error: "Nenhum contexto foi retornado pelo índice RAG do MedSafe." },
                { status: 424 }
            );
        }

        const ragContext = references
            .map(
                (doc, index) =>
                    `[DOC_${index + 1}]
id: ${doc.id}
title: ${doc.title}
uri: ${doc.uri || "N/A"}
snippet: ${doc.snippet}`
            )
            .join("\n\n");

        const prompt = `Você é um auditor regulatório especializado na RDC 96/2008 (ANVISA).

Você DEVE usar apenas o contexto abaixo (RAG) para fundamentar referências/citações.
Se faltar evidência no contexto, diga explicitamente que não há suporte documental.

CONTEXTO RAG:
${ragContext}

MATERIAL PARA ANÁLISE:
"""
${texto}
"""

TAREFA:
1) Analise claims e linguagem promocional do material.
2) Identifique violações e classifique: grave, moderada, leve.
3) Pontue score de conformidade de 0 a 100.
4) Traga sugestões específicas e acionáveis.
5) Inclua referências do contexto RAG para cada decisão relevante.

Responda APENAS com JSON válido:
{
  "score": 0-100,
  "resumo": "texto",
  "violacoes": [
    {
      "tipo": "grave|moderada|leve",
      "texto": "descrição",
      "trecho": "trecho do material",
      "artigo": "artigo/regra",
      "sugestao": "sugestão prática",
      "refs": ["DOC_1","DOC_3"]
    }
  ],
  "referencias": [
    { "docId": "DOC_1", "title": "título", "trecho": "trecho usado", "uri": "url opcional" }
  ]
}`;

        const generation = await model.generateContent(prompt);
        const responseText = generation.response.text();
        const parsed = JSON.parse(extractJsonObject(responseText));

        const validatedReferences: MedsafeReference[] = Array.isArray(parsed.referencias)
            ? parsed.referencias.map((item: any) => ({
                  docId: String(item?.docId || ""),
                  title: String(item?.title || "Referência"),
                  trecho: String(item?.trecho || "").slice(0, 420),
                  uri: item?.uri ? String(item.uri) : undefined,
              }))
            : [];

        const validated = {
            score:
                typeof parsed.score === "number"
                    ? Math.max(0, Math.min(100, Math.round(parsed.score)))
                    : 0,
            resumo: typeof parsed.resumo === "string" ? parsed.resumo : "Análise concluída.",
            violacoes: Array.isArray(parsed.violacoes)
                ? parsed.violacoes.map((item: any, index: number) => ({
                      id: index + 1,
                      tipo: ["grave", "moderada", "leve"].includes(item?.tipo) ? item.tipo : "leve",
                      texto: String(item?.texto || "Violação identificada."),
                      trecho: String(item?.trecho || "").slice(0, 300),
                      artigo: String(item?.artigo || "RDC 96/2008"),
                      sugestao: String(item?.sugestao || "Revisar o trecho com a equipe regulatória."),
                      refs: Array.isArray(item?.refs) ? item.refs.map((ref: unknown) => String(ref)) : [],
                  }))
                : [],
            referencias: validatedReferences,
            grounded: true,
            retrievalCount: references.length,
            model: GEMINI_TEXT_MODEL,
            tempoAnalise: 0,
        };

        const persisted = await writeFirestoreDocument("medsafe_analyses", {
            inputLength: texto.length,
            inputPreview: texto.slice(0, 2000),
            score: validated.score,
            resumo: validated.resumo,
            violacoes: validated.violacoes,
            referencias: validated.referencias,
            retrievalCount: validated.retrievalCount,
            model: validated.model,
            createdAt: new Date().toISOString(),
        }).catch(() => null);

        return NextResponse.json({
            ...validated,
            analysisId: persisted?.id || null,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("MedSafe API error:", message);
        return NextResponse.json(
            { error: "Falha na análise RAG", details: message },
            { status: 500 }
        );
    }
}
