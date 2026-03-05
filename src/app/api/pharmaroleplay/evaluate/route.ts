import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_FALLBACK_MODEL } from "@/lib/ai-models";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// ── Types ────────────────────────────────────────────────────────────────────

interface AvaliacaoResult {
    score_final: number;
    aprovado: boolean;
    xp_ganho: number;
    motivo_reprovacao: string | null;
    pontos_fortes: string[];
    pontos_melhoria: string[];
    usou_tecnicas_fechamento: boolean;
}

// ── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é um Gerente Distrital da Indústria Farmacêutica altamente analítico. Sua função é ler a transcrição de um 'Roleplay de Vendas' entre um representante e um médico virtual e avaliar o desempenho do representante.

Você deve retornar EXCLUSIVAMENTE um objeto JSON válido, sem formatação markdown ou texto extra, seguindo exatamente a estrutura abaixo:

{
  "score_final": [Número inteiro de 0 a 100 baseando-se na persuasão, clareza e conhecimento técnico],
  "aprovado": [Booleano: true se score for >= 75, false se for < 75],
  "xp_ganho": [Número inteiro: Score * 2 se aprovado, Score * 0.5 se reprovado],
  "motivo_reprovacao": [String: Se aprovado, retorne null. Se reprovado, explique em 1 frase curta o erro fatal],
  "pontos_fortes": [Array de 2 strings curtas elogiando o que ele fez bem],
  "pontos_melhoria": [Array de 2 strings curtas apontando o que faltou],
  "usou_tecnicas_fechamento": [Booleano: O representante tentou o fechamento da prescrição?]
}`;

// ── Validation ───────────────────────────────────────────────────────────────

function validateAvaliacao(obj: unknown): AvaliacaoResult | null {
    if (!obj || typeof obj !== "object") return null;
    const o = obj as Record<string, unknown>;

    const score = typeof o.score_final === "number" ? Math.round(o.score_final) : null;
    if (score === null || score < 0 || score > 100) return null;

    const aprovado = typeof o.aprovado === "boolean" ? o.aprovado : score >= 75;
    const xp = typeof o.xp_ganho === "number" ? Math.round(o.xp_ganho) : (aprovado ? score * 2 : Math.round(score * 0.5));

    const motivo = o.motivo_reprovacao === null || o.motivo_reprovacao === undefined
        ? (aprovado ? null : "Score abaixo do mínimo.")
        : String(o.motivo_reprovacao);

    const fortes = Array.isArray(o.pontos_fortes)
        ? o.pontos_fortes.filter((s): s is string => typeof s === "string").slice(0, 3)
        : ["Participou do treinamento", "Manteve o diálogo"];

    const melhoria = Array.isArray(o.pontos_melhoria)
        ? o.pontos_melhoria.filter((s): s is string => typeof s === "string").slice(0, 3)
        : ["Aprofundar argumentação clínica", "Praticar técnicas de fechamento"];

    const fechamento = typeof o.usou_tecnicas_fechamento === "boolean" ? o.usou_tecnicas_fechamento : false;

    return {
        score_final: score,
        aprovado,
        xp_ganho: xp,
        motivo_reprovacao: aprovado ? null : motivo,
        pontos_fortes: fortes,
        pontos_melhoria: melhoria,
        usou_tecnicas_fechamento: fechamento,
    };
}

// ── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const transcript = typeof body.transcript === "string" ? body.transcript : "";
        const cenario = typeof body.cenario === "string" ? body.cenario : "Objeção de Preço";

        if (!transcript || transcript.length < 20) {
            return NextResponse.json(
                { error: "Transcrição muito curta para avaliação" },
                { status: 400 }
            );
        }

        // Use Flash for speed — JSON Mode forced
        const model = genAI.getGenerativeModel({
            model: GEMINI_TEXT_FALLBACK_MODEL,
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
            },
        });

        const prompt = `${SYSTEM_PROMPT}

Cenário do treinamento: ${cenario}

Transcrição a ser avaliada:
${transcript}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Parse JSON response
        let parsed: unknown;
        try {
            parsed = JSON.parse(text);
        } catch {
            // Fallback: try to extract JSON from text
            const jsonMatch = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse Gemini JSON response");
            }
        }

        const avaliacao = validateAvaliacao(parsed);
        if (!avaliacao) {
            throw new Error("Invalid evaluation schema from Gemini");
        }

        return NextResponse.json({ avaliacao });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Evaluate API error:", message);

        // Return a fallback evaluation so the UI doesn't break
        return NextResponse.json({
            avaliacao: {
                score_final: 50,
                aprovado: false,
                xp_ganho: 25,
                motivo_reprovacao: "Erro na avaliação automática — score estimado.",
                pontos_fortes: ["Participou do treinamento"],
                pontos_melhoria: ["Avaliação indisponível — tente novamente"],
                usou_tecnicas_fechamento: false,
            },
            fallback: true,
            error: message,
        });
    }
}
