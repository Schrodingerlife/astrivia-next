'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    PhoneOff,
    Volume2,
    VolumeX,
    Send,
    MessageSquare
} from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';
import FeedbackCard from './FeedbackCard';

// ═══════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════

interface Mensagem {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface Feedback {
    tipo: 'success' | 'warning' | 'error';
    mensagem: string;
    categoria: string;
    pontos: number;
    timestamp: number;
}

interface VoiceInterfaceProps {
    sessaoId: string;
    cenario: string;
    cenarioNome: string;
    onEncerrar: (relatorio: any) => void;
}

// ═══════════════════════════════════════════════════════════════════════
// DADOS DO MÉDICO (IA SIMULADA LOCAL)
// ═══════════════════════════════════════════════════════════════════════

const personasMedico: Record<string, {
    nome: string;
    abertura: string;
    personalidade: string;
    respostas: string[];
}> = {
    'objecao_preco': {
        nome: 'Dr. Roberto Silva - Cardiologista',
        abertura: 'Bom dia. Você é da indústria farmacêutica, certo? Olha, já adianto que meus pacientes são muito sensíveis a preço. A maioria não tem plano de saúde bom. O que você tem para me mostrar?',
        personalidade: 'cético sobre custos',
        respostas: [
            'Interessante, mas quanto custa esse medicamento? Meus pacientes geralmente não podem pagar caro.',
            'Entendo os benefícios, mas o genérico que eu prescrevo funciona bem e custa um terço do preço.',
            'Vocês têm algum programa de desconto ou parceria com farmácias populares?',
            'E se o paciente não conseguir manter o tratamento por questão financeira? Isso me preocupa.',
            'Ok, mas me mostre os estudos de custo-efetividade. Preciso justificar para meus pacientes.',
            'Hmm, isso é um ponto válido. Tem alguma amostra grátis para eu testar com alguns pacientes primeiro?',
        ]
    },
    'duvida_eficacia': {
        nome: 'Dra. Ana Costa - Clínica Geral',
        abertura: 'Olá! Estou curiosa sobre esse medicamento novo. Mas preciso ver dados concretos - quais são os estudos clínicos que comprovam a eficácia? Quantos pacientes foram estudados?',
        personalidade: 'focada em evidências',
        respostas: [
            'Qual foi o tamanho da amostra do estudo principal? E qual foi o p-valor?',
            'Interessante, mas esse estudo foi feito em qual população? Brasileiros ou estrangeiros?',
            'E quanto aos efeitos colaterais? Qual a taxa de eventos adversos graves?',
            'Vocês têm estudos de vida real, não só ensaios clínicos controlados?',
            'Como esse medicamento se compara ao padrão-ouro atual no tratamento?',
            'Ok, isso é convincente. Pode me deixar essa literatura para eu analisar com calma?',
        ]
    },
    'comparacao_concorrente': {
        nome: 'Dr. Carlos Mendes - Oncologista',
        abertura: 'Boa tarde. Olha, já uso o produto da concorrência há cinco anos e meus pacientes estão bem controlados. Por que eu deveria considerar mudar para o seu produto?',
        personalidade: 'leal à marca atual',
        respostas: [
            'Meus pacientes já estão adaptados ao tratamento atual. Mudar agora pode ser arriscado.',
            'O produto que eu uso tem um histórico de segurança de décadas. O seu é novo demais.',
            'E quanto à interação medicamentosa? Meus pacientes oncológicos tomam muitos remédios.',
            'Se eu mudar e o paciente tiver algum problema, a responsabilidade é minha.',
            'Você tem algum estudo head-to-head comparando diretamente com o que eu uso?',
            'Hmm, esse dado de superioridade é interessante. Me fale mais sobre isso.',
        ]
    },
    'contato_frio': {
        nome: 'Dr. Paulo Ferreira - Clínico Geral',
        abertura: 'Sim? Olha, tenho apenas cinco minutos entre consultas. O que você precisa? Seja breve.',
        personalidade: 'ocupado e impaciente',
        respostas: [
            'Pode ir direto ao ponto? Tenho paciente esperando.',
            'Resumo em uma frase: por que esse medicamento é melhor?',
            'Deixa esse material aí que eu leio depois. Próximo!',
            'Interessante, mas preciso ver funcionando na prática.',
            'Vocês vão ter algum simpósio ou webinar sobre isso? Prefiro ver uma apresentação completa.',
            'Ok, gostei. Pode agendar um horário melhor para conversarmos com mais calma?',
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// ANÁLISE DE RESPOSTA (LOCAL)
// ═══════════════════════════════════════════════════════════════════════

// Categories tracked by the Gemini API feedback
const CATEGORIAS = ['Tom de Voz', 'Argumentação', 'Gestão de Objeções', 'Empatia', 'Conhecimento do Produto', 'Compliance'] as const;

type CategoriaScores = Record<string, number[]>;

function calcularMediaCategoria(scores: number[]): number {
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function calcularScoreGeral(categoryScores: CategoriaScores): number {
    const allScores = Object.values(categoryScores).flat();
    if (allScores.length === 0) return 0;
    return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

export default function VoiceInterfaceLocal({
    sessaoId,
    cenario,
    cenarioNome,
    onEncerrar
}: VoiceInterfaceProps) {
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isGravando, setIsGravando] = useState(false);
    const [isFalando, setIsFalando] = useState(false);
    const [textoDigitado, setTextoDigitado] = useState('');
    const [modoTexto, setModoTexto] = useState(false);
    const [audioMutado, setAudioMutado] = useState(false);
    const [pontuacao, setPontuacao] = useState(0);
    const [turno, setTurno] = useState(0);
    const [tempoDecorrido, setTempoDecorrido] = useState(0);
    const [nivelAudio, setNivelAudio] = useState(0);
    const [transcricaoAtual, setTranscricaoAtual] = useState('');
    const [categoryScores, setCategoryScores] = useState<CategoriaScores>({});
    const [suportaVoz, setSuportaVoz] = useState(true);
    const [mouthOpen, setMouthOpen] = useState(false);

    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ttsAbortRef = useRef<AbortController | null>(null);
    const ttsRequestIdRef = useRef(0);
    const transcricaoRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const medicoAtual = personasMedico[cenario] || personasMedico['objecao_preco'];

    // ═══════════════════════════════════════════════════════════════════════
    // INICIALIZAÇÃO
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSuportaVoz(false);
            setModoTexto(true);
        } else {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';

            recognition.onresult = (event: any) => {
                let textoFinal = '';
                let textoInterim = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        textoFinal += event.results[i][0].transcript;
                    } else {
                        textoInterim += event.results[i][0].transcript;
                    }
                }

                if (textoInterim) setTranscricaoAtual(textoInterim);

                if (textoFinal) {
                    setTranscricaoAtual('');
                    enviarMensagem(textoFinal);
                }
            };

            recognition.onerror = (event: any) => {
                if (event.error === 'not-allowed') {
                    setModoTexto(true);
                    setSuportaVoz(false);
                }
            };

            recognition.onend = () => setIsGravando(false);
            recognitionRef.current = recognition;
        }

        const interval = setInterval(() => {
            setTempoDecorrido(prev => prev + 1);
        }, 1000);

        setTimeout(() => {
            const mensagemInicial: Mensagem = {
                role: 'assistant',
                content: medicoAtual.abertura,
                timestamp: Date.now()
            };
            setMensagens([mensagemInicial]);

            if (!audioMutado && 'speechSynthesis' in window) {
                falarTexto(medicoAtual.abertura);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            if (recognitionRef.current) recognitionRef.current.stop();
            if (ttsAbortRef.current) ttsAbortRef.current.abort();
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            window.speechSynthesis?.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Animate mouth when doctor is speaking
    useEffect(() => {
        if (!isFalando) { setMouthOpen(false); return; }
        const interval = setInterval(() => setMouthOpen(prev => !prev), 160);
        return () => clearInterval(interval);
    }, [isFalando]);

    useEffect(() => {
        if (!audioMutado) return;
        if (ttsAbortRef.current) ttsAbortRef.current.abort();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        window.speechSynthesis?.cancel();
        setIsFalando(false);
    }, [audioMutado]);

    // ═══════════════════════════════════════════════════════════════════════
    // SÍNTESE DE VOZ (Google Cloud TTS → browser fallback)
    // ═══════════════════════════════════════════════════════════════════════

    const falarTexto = async (texto: string) => {
        if (audioMutado || !texto.trim()) return;

        ttsRequestIdRef.current += 1;
        const requestId = ttsRequestIdRef.current;

        // Stop any currently playing audio
        if (ttsAbortRef.current) ttsAbortRef.current.abort();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        window.speechSynthesis?.cancel();

        const controller = new AbortController();
        ttsAbortRef.current = controller;

        setIsFalando(true);

        try {
            // Try Gemini TTS API first (natural LLM-based voice)
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: texto }),
                signal: controller.signal,
            });

            if (requestId !== ttsRequestIdRef.current) {
                return;
            }

            if (response.ok && response.headers.get('content-type')?.includes('audio')) {
                const blob = await response.blob();
                if (requestId !== ttsRequestIdRef.current) {
                    return;
                }
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audioRef.current = audio;
                audio.onended = () => {
                    if (requestId !== ttsRequestIdRef.current) return;
                    setIsFalando(false);
                    URL.revokeObjectURL(url);
                };
                audio.onerror = () => {
                    if (requestId !== ttsRequestIdRef.current) return;
                    setIsFalando(false);
                    URL.revokeObjectURL(url);
                    falarComBrowser(texto);
                };
                await audio.play();
                return;
            }

            if (response.status !== 200) {
                console.warn("TTS route returned non-audio response, using browser fallback.");
            }

            // API returned error, fallback
            falarComBrowser(texto);
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }
            // Network error, fallback to browser TTS
            falarComBrowser(texto);
        }
    };

    const falarComBrowser = (texto: string) => {
        if (!('speechSynthesis' in window)) {
            setIsFalando(false);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.93;
        utterance.pitch = 0.95;
        const vozes = window.speechSynthesis.getVoices();
        const voz = vozes.find(v => v.lang.includes('pt-BR') && /(google|neural|natural|microsoft)/i.test(v.name))
            || vozes.find(v => v.lang.includes('pt-BR') && /(male|mascul|homem)/i.test(v.name))
            || vozes.find(v => v.lang.includes('pt-BR'));
        if (voz) utterance.voice = voz;
        utterance.onend = () => setIsFalando(false);
        utterance.onerror = () => setIsFalando(false);
        window.speechSynthesis.speak(utterance);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ENVIAR MENSAGEM
    // ═══════════════════════════════════════════════════════════════════════

    const enviarMensagem = async (texto: string) => {
        if (!texto.trim()) return;

        const mensagemUsuario: Mensagem = { role: 'user', content: texto, timestamp: Date.now() };
        setMensagens(prev => [...prev, mensagemUsuario]);
        setTextoDigitado('');

        try {
            // Call Gemini API for contextual doctor response + real feedback
            const allMsgs = [...mensagens, mensagemUsuario];
            const response = await fetch('/api/pharmaroleplay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cenario,
                    cenarioNome,
                    mensagens: allMsgs.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const novoTurno = turno + 1;
                setTurno(novoTurno);

                // Use real Gemini feedback for scoring
                if (data.feedback) {
                    const fbPontos = typeof data.feedback.pontos === 'number' ? data.feedback.pontos : 50;
                    const fbCategoria = data.feedback.categoria || 'Geral';
                    const fb: Feedback = {
                        tipo: data.feedback.tipo || 'success',
                        mensagem: data.feedback.mensagem || 'Feedback da IA',
                        categoria: fbCategoria,
                        pontos: fbPontos,
                        timestamp: Date.now(),
                    };
                    setFeedbacks(prev => [fb, ...prev].slice(0, 8));

                    // Track per-category scores from real API data
                    setCategoryScores(prev => {
                        const updated = { ...prev };
                        if (!updated[fbCategoria]) updated[fbCategoria] = [];
                        updated[fbCategoria] = [...updated[fbCategoria], fbPontos];
                        // Recalculate overall score from all real data
                        const newScore = calcularScoreGeral(updated);
                        setPontuacao(newScore);
                        return updated;
                    });
                }

                const mensagemMedico: Mensagem = { role: 'assistant', content: data.resposta, timestamp: Date.now() };
                setMensagens(prev => [...prev, mensagemMedico]);
                if (!audioMutado) falarTexto(data.resposta);

                setTimeout(() => {
                    transcricaoRef.current?.scrollTo({ top: transcricaoRef.current.scrollHeight, behavior: 'smooth' });
                }, 100);
                return;
            }
            throw new Error('API failed');
        } catch (error) {
            console.warn('PharmaRoleplay API unavailable, using local fallback:', error);

            // Fallback to local scripted responses (no fake scores)
            setTimeout(() => {
                const novoTurno = turno + 1;
                setTurno(novoTurno);

                let respostaMedico: string;
                if (novoTurno >= medicoAtual.respostas.length) {
                    respostaMedico = 'Ok, agradeço a visita. Vou analisar o material e, se tiver interesse, entro em contato. Tenha um bom dia!';
                } else {
                    respostaMedico = medicoAtual.respostas[novoTurno - 1];
                }

                const mensagemMedico: Mensagem = { role: 'assistant', content: respostaMedico, timestamp: Date.now() };
                setMensagens(prev => [...prev, mensagemMedico]);
                if (!audioMutado) falarTexto(respostaMedico);

                setTimeout(() => {
                    transcricaoRef.current?.scrollTo({ top: transcricaoRef.current.scrollHeight, behavior: 'smooth' });
                }, 100);
            }, 1500);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // CONTROLES DE GRAVAÇÃO
    // ═══════════════════════════════════════════════════════════════════════

    const toggleGravacao = async () => {
        if (!recognitionRef.current) {
            setModoTexto(true);
            return;
        }

        if (isGravando) {
            recognitionRef.current.stop();
            setIsGravando(false);
        } else {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                recognitionRef.current.start();
                setIsGravando(true);
            } catch (err) {
                setModoTexto(true);
                setSuportaVoz(false);
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ENCERRAR SESSÃO
    // ═══════════════════════════════════════════════════════════════════════

    const encerrarSessao = async () => {
        window.speechSynthesis?.cancel();
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        recognitionRef.current?.stop();

        // Calculate real scores from tracked Gemini feedback
        const positivos = feedbacks.filter(f => f.tipo === 'success').length;
        const alertas = feedbacks.filter(f => f.tipo === 'warning').length;
        const negativos = feedbacks.filter(f => f.tipo === 'error').length;
        const palavras = mensagens.filter(m => m.role === 'user').reduce((acc, m) => acc + m.content.split(' ').length, 0);
        const userMsgCount = mensagens.filter(m => m.role === 'user').length;

        // Build real per-category scores from accumulated data
        const realScores = {
            tom: calcularMediaCategoria(categoryScores['Tom de Voz'] || categoryScores['Comunicação'] || []),
            argumentacao: calcularMediaCategoria(categoryScores['Argumentação'] || categoryScores['Técnica de Vendas'] || categoryScores['Conhecimento do Produto'] || []),
            objecoes: calcularMediaCategoria(categoryScores['Gestão de Objeções'] || categoryScores['Compliance'] || []),
            empatia: calcularMediaCategoria(categoryScores['Empatia'] || categoryScores['Engajamento'] || []),
        };

        // Overall score from real data only
        const scoreGeral = pontuacao;

        // Require minimum interaction for approval
        const aprovado = scoreGeral >= 70 && userMsgCount >= 3;

        // Get personalized analysis from Gemini
        let sugestoes: string[] = [];
        let analiseDetalhada: Array<{ frase_usuario: string; problema: string; exemplo_melhor: string }> = [];

        try {
            const transcricao = mensagens.map((m, i) =>
                `[${i + 1}] ${m.role === 'user' ? 'Representante' : 'Médico'}: ${m.content}`
            ).join('\n');

            const res = await fetch('/api/pharmaroleplay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cenario,
                    cenarioNome,
                    mensagens: [{
                        role: 'user', content: `[SISTEMA - RELATÓRIO FINAL]

Transcrição completa:
${transcricao}

Score: ${scoreGeral}/100 | Turnos: ${userMsgCount}

Analise esta simulação e retorne APENAS o JSON abaixo (sem markdown):
{
  "sugestoes": ["sugestão geral 1", "sugestão geral 2", "sugestão geral 3"],
  "analise": [
    {
      "frase_usuario": "trecho exato do que o representante disse (máx 80 chars)",
      "problema": "descrição clara do erro ou ponto fraco (1-2 frases)",
      "exemplo_melhor": "como deveria ter dito — exemplo concreto com dados ou técnica (1-2 frases)"
    }
  ]
}

Identifique 2-4 momentos específicos onde o representante errou ou poderia ter ido muito melhor. Seja específico e cite o que foi dito.` }],
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const text = data.resposta || '';
                const jsonMatch = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (Array.isArray(parsed.sugestoes)) sugestoes = parsed.sugestoes;
                    if (Array.isArray(parsed.analise)) analiseDetalhada = parsed.analise;
                }
            }
        } catch {
            // Fallback below
        }

        if (sugestoes.length === 0) {
            sugestoes = [
                userMsgCount < 3 ? 'Interaja mais com o médico — sessões curtas limitam a avaliação' : null,
                scoreGeral < 70 ? 'Fundamente suas respostas com dados de estudos clínicos' : null,
                scoreGeral < 60 ? 'Demonstre mais empatia ao ouvir as preocupações do médico' : null,
                'Pratique diferentes cenários para desenvolver versatilidade',
            ].filter(Boolean) as string[];
        }

        const relatorio = {
            sessaoId,
            scoreGeral,
            scores: realScores,
            aprovado,
            certificadoDisponivel: aprovado && scoreGeral >= 80,
            resumo: {
                totalMensagens: mensagens.length,
                mensagensUsuario: userMsgCount,
                feedbacksPositivos: positivos,
                feedbacksAlerta: alertas,
                feedbacksNegativos: negativos,
                interrupcoes: 0,
                palavrasFaladas: palavras,
                tempoSessao: tempoDecorrido,
            },
            sugestoes,
            analiseDetalhada,
            cenario: cenarioNome,
            dificuldade: 'Média',
            transcricaoCompleta: mensagens.map(m => ({
                role: m.role === 'user' ? 'Você' : '👨‍⚕️ Médico',
                content: m.content,
                timestamp: m.timestamp
            }))
        };

        // Save session to Firestore (best-effort, don't block UI)
        fetch('/api/pharmaroleplay/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(relatorio),
        })
            .then(r => r.json())
            .then(d => { if (!d.success) console.error('[PharmaRoleplay] Save failed:', d.error); })
            .catch(e => console.error('[PharmaRoleplay] Save network error:', e));

        onEncerrar(relatorio);
    };

    const formatarTempo = (segundos: number) => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Header com métricas */}
            <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-[#00D9FF]">{medicoAtual.nome}</h2>
                        <p className="text-sm text-white/40">Cenário: {cenarioNome}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{formatarTempo(tempoDecorrido)}</p>
                            <p className="text-xs text-white/30">Tempo</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#00D9FF]">{turno > 0 ? pontuacao : '—'}</p>
                            <p className="text-xs text-white/30">Score</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">{turno}</p>
                            <p className="text-xs text-white/30">Turnos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Área principal */}
            <div className="flex gap-4 flex-1 min-h-0">
                {/* Conversa */}
                <div className="flex-1 glass-card rounded-xl p-4 flex flex-col">
                    <div
                        ref={transcricaoRef}
                        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
                    >
                        <AnimatePresence>
                            {mensagens.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-[#00D9FF]/20 to-purple-500/20 border border-[#00D9FF]/30'
                                            : 'bg-white/5 border border-white/10'
                                            }`}
                                    >
                                        <p className="text-sm font-medium mb-1 text-white/40">
                                            {msg.role === 'user' ? '🧑‍💼 Você' : '👨‍⚕️ Médico'}
                                        </p>
                                        <p className="text-white">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {transcricaoAtual && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                                <div className="max-w-[80%] p-4 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 border-dashed">
                                    <p className="text-[#00D9FF]/70 italic">{transcricaoAtual}...</p>
                                </div>
                            </motion.div>
                        )}

                        {isFalando && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="flex items-center gap-2 text-white/40">
                                    <Volume2 className="w-4 h-4 animate-pulse" />
                                    <span className="text-sm">Médico falando...</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Controles de entrada */}
                    <div className="border-t border-white/10 pt-4">
                        {modoTexto ? (
                            <form
                                onSubmit={(e) => { e.preventDefault(); enviarMensagem(textoDigitado); }}
                                className="flex gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={textoDigitado}
                                    onChange={(e) => setTextoDigitado(e.target.value)}
                                    placeholder="Digite sua resposta..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50"
                                    disabled={isFalando}
                                />
                                <button
                                    type="submit"
                                    disabled={!textoDigitado.trim() || isFalando}
                                    className="bg-gradient-to-r from-[#00D9FF] to-purple-500 hover:opacity-90 px-6 py-3 rounded-xl text-white disabled:opacity-40"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setModoTexto(true)}
                                    className="w-10 h-10 rounded-lg border border-white/10 hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </button>

                                <motion.button
                                    onClick={toggleGravacao}
                                    disabled={isFalando}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isGravando
                                        ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                                        : 'bg-gradient-to-r from-[#00D9FF] to-purple-500 hover:shadow-lg hover:shadow-[#00D9FF]/30'
                                        } ${isFalando ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isGravando ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                                </motion.button>

                                <button
                                    onClick={() => setAudioMutado(!audioMutado)}
                                    className="w-10 h-10 rounded-lg border border-white/10 hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors"
                                >
                                    {audioMutado ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                            </div>
                        )}

                        {suportaVoz && (
                            <div className="flex justify-center mt-3">
                                <button
                                    onClick={() => setModoTexto(!modoTexto)}
                                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {modoTexto ? '🎤 Usar microfone' : '⌨️ Digitar texto'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Painel lateral - Feedbacks */}
                <div className="w-80 glass-card rounded-xl p-4 flex flex-col hidden md:flex">
                    {/* Doctor Avatar */}
                    <div className="flex flex-col items-center mb-4 pb-4 border-b border-white/10">
                        <style>{`
                            @keyframes docBlink {
                                0%, 88%, 100% { transform: scaleY(1); }
                                94% { transform: scaleY(0.08); }
                            }
                            .eye-l { animation: docBlink 3.5s infinite; transform-box: fill-box; transform-origin: center; }
                            .eye-r { animation: docBlink 3.5s 0.6s infinite; transform-box: fill-box; transform-origin: center; }
                        `}</style>
                        <div className="relative">
                            <svg viewBox="0 0 120 130" width="88" height="88">
                                {/* Lab coat base */}
                                <ellipse cx="60" cy="126" rx="44" ry="16" fill="#e8eeff" opacity="0.95"/>
                                <rect x="30" y="105" width="60" height="24" rx="6" fill="#e8eeff" opacity="0.95"/>
                                {/* Collar */}
                                <polygon points="60,105 42,130 60,120" fill="#c8d0f0"/>
                                <polygon points="60,105 78,130 60,120" fill="#c8d0f0"/>
                                {/* Tie/stethoscope line */}
                                <path d="M60 108 Q55 120 50 128" stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                                <circle cx="50" cy="130" r="4" fill="none" stroke="#6366f1" strokeWidth="2"/>
                                {/* Neck */}
                                <rect x="52" y="99" width="16" height="12" rx="3" fill="#f5c89a"/>
                                {/* Head */}
                                <ellipse cx="60" cy="64" rx="36" ry="42" fill="#f5c89a"/>
                                {/* Hair */}
                                <path d="M24 50 Q24 16 60 16 Q96 16 96 50 Q93 22 60 22 Q27 22 24 50Z" fill="#1a0f00"/>
                                <rect x="24" y="44" width="72" height="8" fill="#1a0f00"/>
                                {/* Ears */}
                                <ellipse cx="24" cy="66" rx="6" ry="9" fill="#f0b882"/>
                                <ellipse cx="96" cy="66" rx="6" ry="9" fill="#f0b882"/>
                                {/* Eyebrows */}
                                <path d="M37 50 Q46 45 55 50" stroke="#1a0f00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                                <path d="M65 50 Q74 45 83 50" stroke="#1a0f00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                                {/* Left eye */}
                                <g className="eye-l">
                                    <ellipse cx="46" cy="63" rx="8" ry="9" fill="white"/>
                                    <ellipse cx="46" cy="64" rx="4.5" ry="5" fill="#1a2a4a"/>
                                    <ellipse cx="48" cy="62" rx="1.5" ry="1.5" fill="white"/>
                                </g>
                                {/* Right eye */}
                                <g className="eye-r">
                                    <ellipse cx="74" cy="63" rx="8" ry="9" fill="white"/>
                                    <ellipse cx="74" cy="64" rx="4.5" ry="5" fill="#1a2a4a"/>
                                    <ellipse cx="76" cy="62" rx="1.5" ry="1.5" fill="white"/>
                                </g>
                                {/* Nose */}
                                <path d="M56 78 Q60 84 64 78" stroke="#d4956a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                                {/* Mouth */}
                                {mouthOpen ? (
                                    <>
                                        <ellipse cx="60" cy="91" rx="11" ry="7" fill="#7a2e2e"/>
                                        <ellipse cx="60" cy="89" rx="10" ry="3" fill="#f5c89a"/>
                                        <rect x="51" y="88" width="18" height="5" rx="2.5" fill="white" opacity="0.85"/>
                                    </>
                                ) : (
                                    <path d="M50 90 Q60 97 70 90" stroke="#c06060" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                                )}
                            </svg>
                            {isFalando && (
                                <span className="absolute -right-1 top-0 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9FF] opacity-75"/>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00D9FF]"/>
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-medium text-white/60 mt-1 text-center leading-tight">
                            {isFalando ? '🗣 Falando...' : medicoAtual.nome.split(' - ')[0]}
                        </p>
                        {!isFalando && (
                            <p className="text-xs text-white/30 text-center">{medicoAtual.nome.split(' - ')[1] || ''}</p>
                        )}
                    </div>

                    <h3 className="text-sm font-bold text-white mb-3">📊 Feedback em Tempo Real</h3>

                    {/* Score visual */}
                    <div className="mb-3 flex items-center justify-between px-2">
                        <div className="relative w-20 h-20">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/10" />
                                <circle
                                    cx="40" cy="40" r="34"
                                    stroke="url(#gradient-live)"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeDasharray={`${pontuacao * 2.136} 213.6`}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                                <defs>
                                    <linearGradient id="gradient-live" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00D9FF" />
                                        <stop offset="100%" stopColor="#A855F7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-white">{turno > 0 ? pontuacao : '—'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/30 text-xs">Score</p>
                            <p className="text-white text-xs mt-1">Turno <span className="font-bold text-purple-400">{turno}</span></p>
                        </div>
                    </div>

                    {/* Lista de feedbacks */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                        <AnimatePresence>
                            {feedbacks.map((fb, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <FeedbackCard tipo={fb.tipo} mensagem={fb.mensagem} categoria={fb.categoria} />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {feedbacks.length === 0 && (
                            <p className="text-white/30 text-sm text-center py-4">
                                Os feedbacks aparecerão aqui conforme você conversa
                            </p>
                        )}
                    </div>

                    {/* Botão encerrar */}
                    <button
                        onClick={encerrarSessao}
                        className="mt-4 w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                    >
                        <PhoneOff className="w-4 h-4" />
                        Encerrar Sessão
                    </button>
                </div>
            </div>
        </div>
    );
}
