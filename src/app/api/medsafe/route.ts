import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";
import { queryVertexSearch } from "@/lib/vertex-search";
import { writeFirestoreDocument } from "@/lib/firestore-admin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

const MEDSAFE_SERVING_CONFIG =
    process.env.VERTEX_MEDSAFE_SERVING_CONFIG || process.env.VERTEX_MEDSAFE_RAG_SERVING_CONFIG || "";

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

const RDC96_KNOWLEDGE = `RESOLUÇÃO RDC 96/2008 - ANVISA (Principais artigos para auditoria de materiais promocionais)

Art. 3º - É proibido realizar propaganda ou publicidade de medicamentos que:
I - atribua ao produto propriedades não comprovadas cientificamente
II - utilize linguagem que induza à automedicação
III - sugira menor risco ou ausência de efeitos colaterais

Art. 4º - São proibidas expressões como:
I - "o melhor", "o mais eficaz", "o único" (superlativos sem comprovação)
II - "sem efeitos colaterais", "100% seguro", "isento de riscos"
III - "cura garantida", "resultados imediatos"

Art. 7º - Materiais devem incluir:
I - contraindicações principais
II - principais interações medicamentosas
III - principais efeitos colaterais

Art. 12º - Proibida omissão de informações de segurança relevantes

Art. 14º - Claims comparativos devem ser sustentados por estudos head-to-head publicados

Art. 23º - Informações sobre posologia devem estar de acordo com a bula aprovada

Art. 25º - Material deve conter registro do medicamento na ANVISA

Art. 27º - Propagandas devem incluir a frase "SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO"`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const texto = typeof body.texto === "string" ? body.texto.trim().slice(0, 12000) : "";

        if (!texto) {
            return NextResponse.json({ error: "Texto vazio" }, { status: 400 });
        }

        // Try RAG if configured, otherwise use built-in RDC 96 knowledge
        let ragContext = "";
        let ragRetrievalCount = 0;
        let useRag = false;

        if (MEDSAFE_SERVING_CONFIG) {
            try {
                const references = await queryVertexSearch({
                    servingConfig: MEDSAFE_SERVING_CONFIG,
                    query: texto.slice(0, 600),
                    pageSize: 8,
                });
                if (references.length > 0) {
                    useRag = true;
                    ragRetrievalCount = references.length;
                    ragContext = references
                        .map(
                            (doc, index) =>
                                `[DOC_${index + 1}]\nid: ${doc.id}\ntitle: ${doc.title}\nuri: ${doc.uri || "N/A"}\nsnippet: ${doc.snippet}`
                        )
                        .join("\n\n");
                }
            } catch (ragError) {
                console.warn("RAG unavailable, using built-in knowledge:", ragError instanceof Error ? ragError.message : ragError);
            }
        }

        const contextSection = useRag
            ? `CONTEXTO RAG (use para fundamentar citações):\n${ragContext}`
            : `REFERÊNCIA REGULATÓRIA (RDC 96/2008 - use para fundamentar citações):\n${RDC96_KNOWLEDGE}`;

        const prompt = `Você é um auditor regulatório especializado na RDC 96/2008 (ANVISA).

${contextSection}

MATERIAL PARA ANÁLISE:
"""
${texto}
"""

TAREFA:
1) Analise claims e linguagem promocional do material.
2) Identifique violações da RDC 96/2008 e classifique: grave, moderada, leve.
3) Pontue score de conformidade de 0 a 100 (100 = totalmente conforme).
4) Traga sugestões específicas e acionáveis de correção.
5) Cite o artigo específico da RDC 96 para cada violação.

Responda APENAS com JSON válido:
{
  "score": 0-100,
  "resumo": "texto resumindo a análise",
  "violacoes": [
    {
      "tipo": "grave|moderada|leve",
      "texto": "descrição da violação",
      "trecho": "trecho do material que viola",
      "artigo": "Art. Xº da RDC 96/2008",
      "sugestao": "sugestão prática de correção"
    }
  ]
}`;

        const generation = await model.generateContent(prompt);
        const responseText = generation.response.text();
        const parsed = JSON.parse(extractJsonObject(responseText));

        const validatedReferences: MedsafeReference[] = useRag && Array.isArray(parsed.referencias)
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
            grounded: useRag,
            retrievalCount: ragRetrievalCount,
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
            mode: useRag ? "rag" : "built-in",
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
            { error: "Falha na análise. Verifique se GOOGLE_API_KEY está configurada.", details: message },
            { status: 500 }
        );
    }
}
