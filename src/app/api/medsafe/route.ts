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

// Inline fallback context: key RDC 96/2008 articles used when Vertex Search is unavailable or returns no results.
const RDC96_INLINE_CONTEXT = `[DOC_1]
id: rdc96-art3
title: RDC 96/2008 — Art. 3º Definições
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 3º Para efeito desta Resolução são adotadas as seguintes definições: Propaganda ou publicidade de medicamentos: toda e qualquer forma de comunicação com o público em geral, divulgada por qualquer meio de comunicação de massa, com o objetivo de influenciar a prescrição, aquisição ou uso de medicamentos.

[DOC_2]
id: rdc96-art4
title: RDC 96/2008 — Art. 4º Vedações Gerais
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 4º É vedado, na propaganda ou publicidade de medicamentos: I - afirmar que o medicamento é inócuo e que não produz efeitos colaterais; II - comparar o medicamento com outros, sem comprovação técnico-científica; III - assegurar que o medicamento não possui contraindicações; IV - afirmar que o medicamento é eficaz para todos os casos; V - utilizar imagens ou alegações que induzam ao uso indiscriminado do medicamento; VI - utilizar expressões que induzam ao exagero ou à promessa de cura não comprovada.

[DOC_3]
id: rdc96-art7
title: RDC 96/2008 — Art. 7º Advertências Obrigatórias
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 7º A propaganda ou publicidade de medicamentos isentos de prescrição deve incluir as seguintes frases de advertência obrigatória: "Ao persistirem os sintomas, o médico deverá ser consultado". A advertência deve ser veiculada de forma visível, legível e em destaque. O descumprimento implica infração sanitária.

[DOC_4]
id: rdc96-art12
title: RDC 96/2008 — Art. 12º Medicamentos com Retenção de Receita
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 12 A propaganda ou publicidade de medicamentos sujeitos à retenção de receita médica é proibida para o público em geral. Só é permitida para profissionais de saúde habilitados a prescrever e/ou dispensar medicamentos. Neste caso, deverão constar: a) a indicação do uso restrito a determinados ambientes; b) a frase "Venda sob prescrição médica".

[DOC_5]
id: rdc96-art24
title: RDC 96/2008 — Art. 24º Proibições Específicas de Conteúdo
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 24 São proibidas propagandas que utilizem: I - personagens que induzam crianças ao uso de medicamentos; II - depoimentos de pacientes que garantam eficácia absoluta; III - imagens de médicos ou profissionais de saúde recomendando o produto; IV - alegações não respaldadas por evidências científicas ou não aprovadas pela ANVISA; V - termos como "milagroso", "garantido", "100% eficaz", "sem risco", "natural é sempre bom" ou similares.

[DOC_6]
id: rdc96-art27
title: RDC 96/2008 — Art. 27º Alegações Terapêuticas
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 27 Toda alegação terapêutica veiculada na propaganda deve estar respaldada em evidências científicas e na bula aprovada pela ANVISA. É vedado alegar indicações terapêuticas não constantes no registro do medicamento. A propaganda não pode sugerir que o medicamento trata condições diferentes das aprovadas no registro.

[DOC_7]
id: rdc96-art8
title: RDC 96/2008 — Art. 8º Informações Obrigatórias
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 8º Toda propaganda de medicamento deve conter: I - nome do medicamento; II - nome do princípio ativo; III - indicações; IV - contraindicações; V - advertências e precauções. Para medicamentos de venda livre, o número do registro na ANVISA deve ser explicitado. Omitir informações obrigatórias constitui infração sanitária.

[DOC_8]
id: rdc96-art5
title: RDC 96/2008 — Art. 5º Termos e Expressões Proibidos
uri: https://www.anvisa.gov.br/legislacao/rdc/2008/rdc0096_17_12_2008.pdf
snippet: Art. 5º São proibidas em propaganda de medicamentos as seguintes expressões: "sem receita médica", "seguro", "natural", "sem contraindicações", "definitivamente", "cura garantida", "mais eficaz", "o melhor", "superior", "único", "aprovado por médicos", bem como quaisquer superlativos absolutos que impliquem ausência de risco ou eficácia universal.`;

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

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ error: "GOOGLE_API_KEY não configurado." }, { status: 503 });
        }

        // Attempt Vertex Search RAG; fall back to inline RDC 96 context if unavailable
        let ragContext = "";
        let retrievalCount = 0;
        let ragSource: "vertex" | "inline" = "inline";

        if (MEDSAFE_SERVING_CONFIG) {
            try {
                const references = await queryVertexSearch({
                    servingConfig: MEDSAFE_SERVING_CONFIG,
                    query: texto.slice(0, 600),
                    pageSize: 8,
                });

                if (references.length > 0) {
                    ragContext = references
                        .map(
                            (doc, index) =>
                                `[DOC_${index + 1}]\nid: ${doc.id}\ntitle: ${doc.title}\nuri: ${doc.uri || "N/A"}\nsnippet: ${doc.snippet}`
                        )
                        .join("\n\n");
                    retrievalCount = references.length;
                    ragSource = "vertex";
                } else {
                    console.warn("[MedSafe] Vertex Search returned no results — using inline RDC 96 fallback");
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn("[MedSafe] Vertex Search error, using inline fallback:", msg);
            }
        } else {
            console.warn("[MedSafe] VERTEX_MEDSAFE_SERVING_CONFIG not set — using inline RDC 96 fallback");
        }

        // Use inline context if Vertex Search wasn't available
        if (!ragContext) {
            ragContext = RDC96_INLINE_CONTEXT;
            retrievalCount = 8; // 8 inline docs
        }

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
            retrievalCount,
            ragSource,
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
            ragSource: validated.ragSource,
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
