import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const cenario = typeof body.cenario === "string" ? body.cenario : "objecao_preco";
        const mensagens = Array.isArray(body.mensagens) ? body.mensagens : [];
        const cenarioNome = typeof body.cenarioNome === "string" ? body.cenarioNome : "Objeção de Preço";

        const historico = mensagens
            .map((m: any) => `${m.role === "user" ? "Representante" : "Médico"}: ${m.content}`)
            .join("\n");

        const prompt = `Você é um médico brasileiro experiente participando de uma simulação de treinamento para representantes farmacêuticos.

CENÁRIO: ${cenarioNome}
PERSONALIDADE:
${cenario === "objecao_preco" ? "Você é Dr. Roberto Silva, cardiologista cético sobre preços. Questione custo-benefício." :
                cenario === "duvida_eficacia" ? "Você é Dra. Ana Costa, clínica geral que quer ver evidências. Peça estudos e dados concretos." :
                    cenario === "comparacao_concorrente" ? "Você é Dr. Carlos Mendes, oncologista que compara com concorrentes. Desafie a superioridade." :
                        "Você é Dr. Paulo Ferreira, clínico geral apressado com 5 minutos. Seja direto e impaciente."}

HISTÓRICO DA CONVERSA:
${historico || "(Início da conversa)"}

REGRAS:
1. Responda como o médico, APENAS 1-3 frases
2. Seja realista — faça perguntas difíceis, mostre ceticismo natural
3. Use linguagem coloquial brasileira de consultório médico
4. Se o representante for convincente, mostre interesse gradual
5. Se o representante errar ou não souber responder, pressione mais
6. Após 6-8 turnos, comece a encerrar a conversa naturalmente
7. NUNCA quebre o personagem
8. Responda APENAS com o texto do médico, sem aspas, sem prefixo

Resposta do médico:`;

        const result = await model.generateContent(prompt);
        const resposta = result.response.text().trim();

        // Also generate feedback on the rep's last message
        let feedback = null;
        const lastUserMsg = mensagens.filter((m: any) => m.role === "user").pop();

        if (lastUserMsg) {
            const feedbackPrompt = `Analise brevemente a última fala deste representante farmacêutico em uma simulação de treinamento:

"${lastUserMsg.content}"

Contexto: ${cenarioNome}

Dê um feedback rápido em JSON (sem markdown):
{
  "tipo": "success"|"warning"|"error",
  "categoria": "Técnica de Vendas"|"Conhecimento do Produto"|"Comunicação"|"Compliance",
  "mensagem": "<feedback curto, 1 frase, em pt-BR>",
  "pontos": <número de 0 a 100 representando qualidade da resposta>
}`;

            try {
                const feedbackResult = await model.generateContent(feedbackPrompt);
                const feedbackText = feedbackResult.response.text()
                    .replace(/```json\s*/gi, "")
                    .replace(/```\s*/g, "")
                    .trim();
                const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    feedback = JSON.parse(jsonMatch[0]);
                }
            } catch {
                // Feedback is optional, don't fail the main response
            }
        }

        return NextResponse.json({ resposta, feedback });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("PharmaRoleplay API error:", message);
        return NextResponse.json(
            { error: "Falha na geração de resposta", details: message },
            { status: 500 }
        );
    }
}
