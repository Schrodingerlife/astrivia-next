import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const texto = typeof body.texto === "string" ? body.texto.trim().slice(0, 5000) : "";

        if (!texto) {
            return NextResponse.json({ error: "Texto vazio" }, { status: 400 });
        }

        const prompt = `Você é um auditor regulatório especializado na RDC 96/2008 da ANVISA (Resolução sobre publicidade de medicamentos no Brasil).

Analise o seguinte material promocional farmacêutico e identifique TODAS as possíveis violações à RDC 96/2008.

MATERIAL PARA ANÁLISE:
"""
${texto}
"""

INSTRUÇÕES:
1. Analise cada frase/claim do material
2. Para cada violação encontrada, cite o artigo específico da RDC 96/2008
3. Classifique como: "grave", "moderada" ou "leve"
4. Dê uma sugestão de correção
5. Calcule um score de compliance (0-100, onde 100 = totalmente compliant)

REGRAS DA RDC 96/2008 que você DEVE verificar:
- Art. 3º: Proibido claim de cura ou promessas absolutas
- Art. 4º, III: Proibido garantir 100% eficácia/segurança
- Art. 4º, V: Proibido omitir riscos e efeitos adversos
- Art. 5º: Comparações com concorrentes precisam de estudo head-to-head publicado
- Art. 7º: Claims de "natural" ou "orgânico" podem induzir falsa segurança
- Art. 3º, §2º: Linguagem superlativa (revolucionário, único, melhor) é considerada misleading
- Art. 6º: Toda informação deve ter referência bibliográfica verificável
- Art. 8º: Material deve incluir contraindicações e informações de segurança
- Art. 10: Informações devem ser compatíveis com a bula aprovada pela ANVISA

Responda APENAS com JSON válido (sem markdown, sem crases):
{
  "score": <número 0-100>,
  "resumo": "<resumo da análise em pt-BR>",
  "violacoes": [
    {
      "tipo": "grave"|"moderada"|"leve",
      "texto": "<descrição da violação>",
      "trecho": "<trecho do material que viola>",
      "artigo": "<artigo da RDC 96 violado>",
      "sugestao": "<sugestão de correção>"
    }
  ]
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean JSON response
        let cleanedJson = responseText
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

        const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedJson = jsonMatch[0];
        }

        const analysis = JSON.parse(cleanedJson);

        // Validate structure
        const validated = {
            score: typeof analysis.score === "number" ? Math.max(0, Math.min(100, analysis.score)) : 50,
            resumo: analysis.resumo || "Análise concluída.",
            violacoes: Array.isArray(analysis.violacoes)
                ? analysis.violacoes.map((v: any, i: number) => ({
                    id: i + 1,
                    tipo: ["grave", "moderada", "leve"].includes(v.tipo) ? v.tipo : "leve",
                    texto: v.texto || "Violação identificada",
                    trecho: v.trecho || "",
                    artigo: v.artigo || "RDC 96/2008",
                    sugestao: v.sugestao || "Revisar com equipe regulatória",
                }))
                : [],
            tempoAnalise: 0,
        };

        return NextResponse.json(validated);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("MedSafe API error:", message);
        return NextResponse.json(
            { error: "Falha na análise", details: message },
            { status: 500 }
        );
    }
}
