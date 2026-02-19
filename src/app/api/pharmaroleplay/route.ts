import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEMINI_TEXT_MODEL } from "@/lib/ai-models";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });

const MEDICOS: Record<string, { nome: string; especialidade: string; personalidade: string; perfil: string }> = {
    objecao_preco: {
        nome: "Dr. Roberto Silva",
        especialidade: "Cardiologista",
        personalidade: "cético e pragmático sobre custos",
        perfil: `Você prescreve genéricos quando possível. Seus pacientes têm renda média e plano básico.
Você questiona DIRETAMENTE qualquer argumento de preço com dados concretos (ex: "quanto custa por mês?", "qual a diferença real vs genérico?").
Se o representante citar estudos vagos, peça nomes e números específicos.
Se o representante oferecer programa de acesso, pergunte sobre burocracia e adesão do paciente.`
    },
    duvida_eficacia: {
        nome: "Dra. Ana Costa",
        especialidade: "Clínica Geral",
        personalidade: "científica e exigente com evidências",
        perfil: `Você exige estudos peer-reviewed, tamanhos de amostra, p-valores e comparações head-to-head.
Se o representante citar um estudo, pergunte: qual o endpoint primário? Foi feito na população brasileira?
Se o representante usar jargão sem substância, você fica impaciente: "isso é marketing, quero dados."
Se os dados forem bons, mostre interesse real e pergunte sobre efeitos adversos.`
    },
    comparacao_concorrente: {
        nome: "Dr. Carlos Mendes",
        especialidade: "Oncologista",
        personalidade: "leal ao produto atual e conservador",
        perfil: `Você usa o concorrente há 5 anos com bons resultados e alta fidelidade.
Para mudar, você precisa de dados de superioridade REAL, não só não-inferioridade.
Se o representante fizer comparações vagas, questione: "superioridade em qual endpoint exato? OS ou PFS?"
Se o representante apresentar dados convincentes, responda com preocupação sobre transição do paciente.
Você não muda por "diferencial de conveniência" — só por benefício clínico comprovado.`
    },
    contato_frio: {
        nome: "Dr. Paulo Ferreira",
        especialidade: "Clínico Geral",
        personalidade: "ocupado e direto",
        perfil: `Você tem 3 minutos entre consultas. Corta qualquer apresentação longa: "vai direto ao ponto".
Se o representante demorar a chegar ao benefício, você interrompe.
Se a proposta for relevante para sua prática, você mostra interesse rápido e pede material.
Se o representante conseguir prender sua atenção nos primeiros 30 segundos, você dá mais tempo.`
    },
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const cenario = typeof body.cenario === "string" ? body.cenario : "objecao_preco";
        const mensagens = Array.isArray(body.mensagens) ? body.mensagens : [];
        const cenarioNome = typeof body.cenarioNome === "string" ? body.cenarioNome : "Objeção de Preço";

        // Check if this is a final report request
        const lastMsg = mensagens[mensagens.length - 1];
        const isRelatorio = lastMsg?.role === "user" && lastMsg.content?.includes("[SISTEMA - RELATÓRIO FINAL]");

        if (isRelatorio) {
            // Handle report generation with a direct prompt
            const result = await model.generateContent(
                `Você é um coach especialista em treinamento de representantes farmacêuticos.

${lastMsg.content}

IMPORTANTE: Retorne APENAS o JSON solicitado, sem texto antes ou depois, sem markdown.`
            );
            return NextResponse.json({ resposta: result.response.text().trim(), feedback: null });
        }

        const medico = MEDICOS[cenario] || MEDICOS["objecao_preco"];

        // Build conversation history — the last user message is highlighted
        const turnos = mensagens.slice(0, -1);
        const historicoAnterior = turnos
            .map((m: { role: string; content: string }) =>
                `${m.role === "user" ? "Representante" : "Médico"}: ${m.content}`
            )
            .join("\n");

        const ultimaFala = mensagens[mensagens.length - 1];
        const ultimaFalaTexto = ultimaFala?.role === "user" ? ultimaFala.content : "";

        const numTurnos = mensagens.filter((m: { role: string }) => m.role === "user").length;

        const prompt = `Você é ${medico.nome}, ${medico.especialidade}. Está em uma visita médica com um representante farmacêutico.

CENÁRIO: ${cenarioNome}
SEU PERFIL: ${medico.perfil}

HISTÓRICO DA CONVERSA ATÉ AGORA:
${historicoAnterior || "(início da visita)"}

ÚLTIMA FALA DO REPRESENTANTE:
"${ultimaFalaTexto}"

INSTRUÇÕES CRÍTICAS:
1. Reaja ESPECIFICAMENTE ao que o representante acabou de dizer acima — não dê resposta genérica
2. Se ele mencionou dados, estudo, preço, benefício específico → responda sobre AQUILO exatamente
3. Se ele falou algo vago ou incorreto → pressione pedindo precisão ou corrija implicitamente
4. Se ele foi convincente → mostre interesse genuíno mas levante a próxima objeção natural
5. Tom coloquial de médico brasileiro, direto, sem floreios
6. MÁXIMO 2 frases curtas
${numTurnos >= 7 ? "7. Esta é uma das últimas falas — comece a encerrar naturalmente (ex: 'ok, deixa o material que eu analiso')" : ""}

Sua resposta (apenas o texto do médico, sem aspas, sem prefixo):`;

        const result = await model.generateContent(prompt);
        const resposta = result.response.text().trim();

        // Feedback on the rep's last message
        let feedback = null;
        if (ultimaFalaTexto) {
            const feedbackPrompt = `Analise esta fala de um representante farmacêutico no cenário "${cenarioNome}":

"${ultimaFalaTexto}"

Contexto da conversa: ${historicoAnterior ? historicoAnterior.slice(-400) : "(início)"}

Retorne JSON (sem markdown):
{
  "tipo": "success"|"warning"|"error",
  "categoria": "Técnica de Vendas"|"Conhecimento do Produto"|"Comunicação"|"Compliance",
  "mensagem": "<feedback específico sobre o que foi dito, 1 frase concreta, em pt-BR>",
  "pontos": <0-100>
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
                // Feedback is optional
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
