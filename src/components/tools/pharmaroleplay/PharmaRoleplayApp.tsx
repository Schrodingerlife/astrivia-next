'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    PhoneOff,
    Volume2,
    VolumeX,
    AlertCircle,
    Send
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
    timestamp: number;
}

interface Metricas {
    palavrasFaladas: number;
    tempoDecorrido: number;
    scoreAtual: number;
    totalMensagens: number;
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

export default function PharmaRoleplayApp() {
    // State: sessão
    const [sessaoIniciada, setSessaoIniciada] = useState(false);
    const [cenarioSelecionado, setCenarioSelecionado] = useState('objecao_preco');

    // State: voice interface
    const [isGravando, setIsGravando] = useState(false);
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isConectado, setIsConectado] = useState(false);
    const [isReconectando, setIsReconectando] = useState(false);
    const [audioMutado, setAudioMutado] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [metricas, setMetricas] = useState<Metricas>({
        palavrasFaladas: 0,
        tempoDecorrido: 0,
        scoreAtual: 70,
        totalMensagens: 0
    });
    const [nivelAudio, setNivelAudio] = useState(0);
    const [isIaFalando, setIsIaFalando] = useState(false);
    const [inputTexto, setInputTexto] = useState('');

    // Refs
    const wsRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const transcricaoRef = useRef<HTMLDivElement>(null);
    const tempoIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const animFrameRef = useRef<number | null>(null);

    const BACKEND_URL = 'pharmaroleplay-backend-759156439718.us-central1.run.app';

    const cenarios = [
        { id: 'objecao_preco', nome: 'Objeção de Preço', desc: 'O médico questiona o custo elevado.', dificuldade: 'Média', duracao: '10 min' },
        { id: 'duvida_eficacia', nome: 'Dúvida sobre Eficácia', desc: 'Convença com dados científicos.', dificuldade: 'Alta', duracao: '15 min' },
        { id: 'comparacao_concorrente', nome: 'Comparação com Concorrente', desc: 'Diferencie seu produto.', dificuldade: 'Alta', duracao: '15 min' },
        { id: 'primeiro_contato', nome: 'Primeiro Contato', desc: 'Conquiste atenção de um médico ocupado.', dificuldade: 'Média', duracao: '10 min' },
    ];

    // ═══════════════════════════════════════════════════════════════════════
    // WEBSOCKET
    // ═══════════════════════════════════════════════════════════════════════

    const sessaoId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const conectarWebSocket = useCallback(() => {
        const wsUrl = `wss://${BACKEND_URL}/ws/${sessaoId.current}`;
        setIsReconectando(true);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setIsConectado(true);
            setIsReconectando(false);
            setErro(null);

            ws.send(JSON.stringify({
                type: 'init',
                scenario: cenarioSelecionado,
                sessionId: sessaoId.current
            }));

            iniciarTimer();
        };

        ws.onmessage = (event) => {
            const dados = JSON.parse(event.data);

            if (dados.tipo === 'transcript' || dados.type === 'transcript') {
                const novaMensagem: Mensagem = {
                    role: dados.role,
                    content: dados.text,
                    timestamp: Date.now()
                };
                setMensagens(prev => [...prev, novaMensagem]);
                setTimeout(() => {
                    transcricaoRef.current?.scrollTo({
                        top: transcricaoRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }

            if (dados.tipo === 'feedback' || dados.type === 'feedback') {
                setFeedbacks(prev => [...prev, {
                    tipo: dados.severity,
                    mensagem: dados.message,
                    categoria: dados.categoria || 'geral',
                    timestamp: Date.now()
                }]);
            }

            if (dados.tipo === 'audio' || dados.type === 'audio') {
                if (!audioMutado && dados.audioData) {
                    reproduzirAudio(dados.audioData);
                }
            }

            if (dados.tipo === 'metricas' || dados.type === 'metricas') {
                setMetricas({
                    palavrasFaladas: dados.palavrasFaladas || 0,
                    tempoDecorrido: dados.tempoDecorrido || 0,
                    scoreAtual: dados.scoreAtual || 70,
                    totalMensagens: dados.totalMensagens || 0
                });
            }

            if (dados.tipo === 'sessao_encerrada' || dados.type === 'sessao_encerrada') {
                pararTimer();
            }
        };

        ws.onerror = () => {
            setErro('Falha na conexão com o servidor. Tentando reconectar...');
        };

        ws.onclose = () => {
            setIsConectado(false);
        };

        wsRef.current = ws;
    }, [cenarioSelecionado, audioMutado]);

    // ═══════════════════════════════════════════════════════════════════════
    // TIMER
    // ═══════════════════════════════════════════════════════════════════════

    const iniciarTimer = () => {
        if (tempoIntervalRef.current) return;
        tempoIntervalRef.current = setInterval(() => {
            setMetricas(prev => ({ ...prev, tempoDecorrido: prev.tempoDecorrido + 1 }));
        }, 1000);
    };

    const pararTimer = () => {
        if (tempoIntervalRef.current) {
            clearInterval(tempoIntervalRef.current);
            tempoIntervalRef.current = null;
        }
    };

    const formatarTempo = (segundos: number): string => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // GRAVAÇÃO DE ÁUDIO
    // ═══════════════════════════════════════════════════════════════════════

    const iniciarGravacao = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 }
            });

            streamRef.current = stream;

            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            analisarNivelAudio();

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Audio = (reader.result as string).split(',')[1];
                        wsRef.current?.send(JSON.stringify({
                            type: 'audio',
                            data: base64Audio
                        }));
                    };
                    reader.readAsDataURL(event.data);
                }
            };

            mediaRecorder.start(100);
            mediaRecorderRef.current = mediaRecorder;
            setIsGravando(true);

        } catch (error: any) {
            if (error.name === 'NotAllowedError') {
                setErro('Permissão de microfone negada. Por favor, permita o acesso.');
            } else {
                setErro('Erro ao acessar microfone: ' + error.message);
            }
        }
    };

    const pararGravacao = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        setIsGravando(false);
        setNivelAudio(0);
    };

    const analisarNivelAudio = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const atualizar = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            const media = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setNivelAudio(media / 255);
            animFrameRef.current = requestAnimationFrame(atualizar);
        };
        atualizar();
    };

    // ═══════════════════════════════════════════════════════════════════════
    // REPRODUÇÃO DE ÁUDIO
    // ═══════════════════════════════════════════════════════════════════════

    const reproduzirAudio = (base64Audio: string) => {
        setIsIaFalando(true);
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => setIsIaFalando(false);
        audio.onerror = () => setIsIaFalando(false);
        audio.play().catch(() => setIsIaFalando(false));
    };

    // ═══════════════════════════════════════════════════════════════════════
    // TEXTO (fallback)
    // ═══════════════════════════════════════════════════════════════════════

    const enviarTexto = () => {
        if (!inputTexto.trim() || !wsRef.current) return;
        wsRef.current.send(JSON.stringify({ type: 'texto', texto: inputTexto }));
        setInputTexto('');
    };

    const encerrarSessao = () => {
        pararGravacao();
        pararTimer();
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'end_session' }));
        }
        setSessaoIniciada(false);
        setMensagens([]);
        setFeedbacks([]);
        setMetricas({ palavrasFaladas: 0, tempoDecorrido: 0, scoreAtual: 70, totalMensagens: 0 });
    };

    const iniciarSessao = () => {
        sessaoId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessaoIniciada(true);
        conectarWebSocket();
    };

    useEffect(() => {
        return () => {
            pararGravacao();
            pararTimer();
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER: SELEÇÃO DE CENÁRIO
    // ═══════════════════════════════════════════════════════════════════════

    if (!sessaoIniciada) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4" style={{ background: 'rgba(0, 217, 255, 0.1)', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
                        <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse" />
                        <span className="text-white/80">Powered by Gemini 3 Flash + Chirp 3 HD</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Selecione um Cenário</h2>
                    <p className="text-white/50">Pratique situações reais de vendas farmacêuticas com IA por voz</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {cenarios.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setCenarioSelecionado(c.id)}
                            className={`text-left p-5 rounded-xl border transition-all ${cenarioSelecionado === c.id
                                    ? 'border-[#00D9FF]/50 bg-[#00D9FF]/5'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                        >
                            <h3 className="text-lg font-semibold text-white mb-1">{c.nome}</h3>
                            <p className="text-white/50 text-sm mb-3">{c.desc}</p>
                            <div className="flex gap-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{c.dificuldade}</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-[#00D9FF]/20 text-[#00D9FF]">{c.duracao}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={iniciarSessao}
                        className="btn-primary px-8 py-4 rounded-xl text-lg inline-flex items-center gap-3"
                    >
                        <Mic size={22} />
                        Iniciar Treinamento
                    </button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER: INTERFACE DE VOZ
    // ═══════════════════════════════════════════════════════════════════════

    return (
        <div className="flex flex-col h-full p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Treinamento em Progresso</h2>
                    <p className="text-white/40 text-sm">
                        Cenário: {cenarios.find(c => c.id === cenarioSelecionado)?.nome}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConectado ? 'bg-green-500' : isReconectando ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                            }`} />
                        <span className="text-white/40 text-xs">
                            {isConectado ? 'Conectado' : isReconectando ? 'Reconectando...' : 'Desconectado'}
                        </span>
                    </div>
                    <button
                        onClick={() => setAudioMutado(!audioMutado)}
                        className={`p-2 rounded-lg transition-colors ${audioMutado ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40'
                            }`}
                    >
                        {audioMutado ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>
            </div>

            {/* Error */}
            <AnimatePresence>
                {erro && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-red-300 text-sm">{erro}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
                {/* Left: Waveform & Controls */}
                <div className="flex flex-col items-center justify-center glass-card rounded-xl p-6">
                    <WaveformVisualizer isAtivo={isGravando} nivel={nivelAudio} isIaFalando={isIaFalando} />

                    {/* Controls */}
                    <div className="flex gap-4 mt-6">
                        {!isGravando ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={iniciarGravacao}
                                disabled={!isConectado}
                                className="bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-[#0A1628] rounded-full w-16 h-16 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Mic size={28} />
                            </motion.button>
                        ) : (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                                <button
                                    onClick={pararGravacao}
                                    className="relative z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center transition-colors"
                                >
                                    <MicOff size={28} />
                                </button>
                            </motion.div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={encerrarSessao}
                            className="border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-full w-16 h-16 flex items-center justify-center transition-colors"
                        >
                            <PhoneOff size={28} />
                        </motion.button>
                    </div>

                    <p className="text-white/40 mt-3 text-center text-sm">
                        {isGravando ? 'Gravando... Fale naturalmente' : isConectado ? 'Clique no microfone para começar' : 'Aguardando conexão...'}
                    </p>

                    {/* Text fallback */}
                    <div className="mt-4 w-full max-w-sm">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputTexto}
                                onChange={(e) => setInputTexto(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && enviarTexto()}
                                placeholder="Ou digite sua mensagem..."
                                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50"
                            />
                            <button
                                onClick={enviarTexto}
                                disabled={!inputTexto.trim() || !isConectado}
                                className="btn-primary px-3 py-2 rounded-lg disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Transcription & Feedback */}
                <div className="flex flex-col gap-3 min-h-0">
                    {/* Transcription */}
                    <div ref={transcricaoRef} className="glass-card rounded-xl p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
                        <h3 className="text-sm font-semibold text-white mb-3 sticky top-0 bg-[#0A1628]/90 backdrop-blur-sm py-1">
                            Transcrição ao Vivo
                        </h3>
                        <div className="space-y-2">
                            <AnimatePresence>
                                {mensagens.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`p-2.5 rounded-lg text-sm ${msg.role === 'user'
                                                ? 'bg-[#00D9FF]/10 ml-6 border border-[#00D9FF]/10'
                                                : 'bg-purple-500/10 mr-6 border border-purple-500/10'
                                            }`}
                                    >
                                        <p className={`text-xs mb-1 ${msg.role === 'user' ? 'text-[#00D9FF]' : 'text-purple-300'}`}>
                                            {msg.role === 'user' ? 'Você' : 'Dr. IA'}
                                        </p>
                                        <p className="text-white/80">{msg.content}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isIaFalando && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-purple-500/5 p-2.5 rounded-lg mr-6 flex items-center gap-2 border border-purple-500/10"
                                >
                                    <div className="flex gap-1">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </div>
                                    <span className="text-purple-300 text-xs">Dr. IA está falando...</span>
                                </motion.div>
                            )}

                            {mensagens.length === 0 && !isIaFalando && (
                                <p className="text-white/20 text-sm text-center py-8">
                                    A transcrição aparecerá aqui quando você começar a falar...
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="glass-card rounded-xl p-4 h-40 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-white mb-2">Feedback em Tempo Real</h3>
                        <div className="space-y-1.5">
                            <AnimatePresence>
                                {feedbacks.slice(-5).map((feedback, i) => (
                                    <FeedbackCard key={i} tipo={feedback.tipo} mensagem={feedback.mensagem} categoria={feedback.categoria} />
                                ))}
                            </AnimatePresence>
                            {feedbacks.length === 0 && (
                                <p className="text-white/20 text-xs">Feedbacks aparecerão durante a conversa...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics bar */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="glass-card rounded-lg p-3 text-center">
                    <p className="text-white/30 text-xs">Tempo</p>
                    <p className="text-lg font-bold text-white">{formatarTempo(metricas.tempoDecorrido)}</p>
                </div>
                <div className="glass-card rounded-lg p-3 text-center">
                    <p className="text-white/30 text-xs">Palavras</p>
                    <p className="text-lg font-bold text-white">{metricas.palavrasFaladas}</p>
                </div>
                <div className="glass-card rounded-lg p-3 text-center">
                    <p className="text-white/30 text-xs">Score</p>
                    <p className={`text-lg font-bold ${metricas.scoreAtual >= 80 ? 'text-green-400' : metricas.scoreAtual >= 60 ? 'text-[#00D9FF]' : 'text-yellow-400'
                        }`}>{metricas.scoreAtual}</p>
                </div>
                <div className="glass-card rounded-lg p-3 text-center">
                    <p className="text-white/30 text-xs">Trocas</p>
                    <p className="text-lg font-bold text-purple-400">{Math.floor(metricas.totalMensagens / 2)}</p>
                </div>
            </div>
        </div>
    );
}
