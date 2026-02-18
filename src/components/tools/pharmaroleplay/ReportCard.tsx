'use client';

import { motion } from 'framer-motion';
import {
    Award,
    Download,
    Share2,
    RotateCcw,
    CheckCircle,
    XCircle,
    TrendingUp,
    Clock,
    MessageSquare
} from 'lucide-react';
import ScoreRing from './ScoreRing';
import Link from 'next/link';

interface Relatorio {
    scoreGeral: number;
    scores: {
        tom: number;
        argumentacao: number;
        objecoes: number;
        empatia: number;
    };
    aprovado: boolean;
    certificadoDisponivel: boolean;
    resumo: {
        totalMensagens: number;
        mensagensUsuario: number;
        feedbacksPositivos: number;
        feedbacksAlerta: number;
        feedbacksNegativos: number;
        interrupcoes: number;
        palavrasFaladas: number;
        tempoSessao: number;
    };
    sugestoes: string[];
    cenario: string;
    dificuldade: string;
    transcricaoCompleta: Array<{
        role: string;
        content: string;
        timestamp: number;
    }>;
}

interface ReportCardProps {
    relatorio: Relatorio;
    sessaoId: string;
}

export default function ReportCard({ relatorio, sessaoId }: ReportCardProps) {
    const formatarTempo = (segundos: number): string => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins}min ${secs}s`;
    };

    const categorias = [
        { nome: 'Tom de Voz', score: relatorio.scores.tom, peso: '35%' },
        { nome: 'Argumentação', score: relatorio.scores.argumentacao, peso: '30%' },
        { nome: 'Gestão de Objeções', score: relatorio.scores.objecoes, peso: '20%' },
        { nome: 'Empatia', score: relatorio.scores.empatia, peso: '15%' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header com Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card text-center p-8 mb-8 rounded-xl"
            >
                <div className="flex flex-col items-center">
                    <ScoreRing score={relatorio.scoreGeral} size={160} />

                    <h1 className="text-3xl font-bold text-white mt-6 mb-2">
                        {relatorio.aprovado ? 'Parabéns! Você foi aprovado!' : 'Continue praticando!'}
                    </h1>

                    <p className="text-white/40 mb-6">
                        Cenário: {relatorio.cenario} • Dificuldade: {relatorio.dificuldade}
                    </p>

                    {relatorio.aprovado && relatorio.certificadoDisponivel && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400"
                        >
                            <Award className="w-5 h-5" />
                            <span>Certificado disponível</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Grid de estatísticas */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Tempo Total', value: formatarTempo(relatorio.resumo.tempoSessao), icon: Clock },
                    { label: 'Trocas', value: Math.floor(relatorio.resumo.totalMensagens / 2), icon: MessageSquare },
                    { label: 'Palavras', value: relatorio.resumo.palavrasFaladas, icon: TrendingUp },
                    { label: 'Interrupções', value: relatorio.resumo.interrupcoes, icon: XCircle },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-xl p-4 text-center"
                    >
                        <stat.icon className="w-5 h-5 text-white/30 mx-auto mb-2" />
                        <p className="text-white/40 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Breakdown por categoria */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 mb-8 rounded-xl"
            >
                <h2 className="text-xl font-semibold text-white mb-6">Desempenho por Categoria</h2>

                <div className="space-y-4">
                    {categorias.map((cat, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/70">{cat.nome}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/30">{cat.peso}</span>
                                    <span className={`font-semibold ${cat.score >= 80 ? 'text-green-400' :
                                            cat.score >= 60 ? 'text-[#00D9FF]' :
                                                'text-yellow-400'
                                        }`}>{cat.score}</span>
                                </div>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cat.score}%` }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                    className={`h-full rounded-full ${cat.score >= 80 ? 'bg-green-500' :
                                            cat.score >= 60 ? 'bg-[#00D9FF]' :
                                                'bg-yellow-500'
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Feedbacks resumo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-3 gap-4 mb-8"
            >
                <div className="glass-card rounded-xl p-4 border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Acertos</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{relatorio.resumo.feedbacksPositivos}</p>
                </div>

                <div className="glass-card rounded-xl p-4 border-l-4 border-yellow-500">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Alertas</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{relatorio.resumo.feedbacksAlerta}</p>
                </div>

                <div className="glass-card rounded-xl p-4 border-l-4 border-red-500">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Erros</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{relatorio.resumo.feedbacksNegativos}</p>
                </div>
            </motion.div>

            {/* Sugestões de melhoria */}
            {relatorio.sugestoes.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 mb-8 rounded-xl"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Sugestões de Melhoria</h2>
                    <ul className="space-y-3">
                        {relatorio.sugestoes.map((sugestao, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/70">
                                <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-purple-300 text-sm">{i + 1}</span>
                                </span>
                                {sugestao}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Transcrição completa */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 mb-8 rounded-xl"
            >
                <h2 className="text-xl font-semibold text-white mb-4">Transcrição Completa</h2>
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                    {relatorio.transcricaoCompleta.map((msg, i) => (
                        <div
                            key={i}
                            className={`p-3 rounded-lg ${msg.role === 'Você'
                                    ? 'bg-[#00D9FF]/10 ml-8 border-l-2 border-[#00D9FF]'
                                    : 'bg-purple-500/10 mr-8 border-l-2 border-purple-500'
                                }`}
                        >
                            <p className={`text-xs mb-1 ${msg.role === 'Você' ? 'text-[#00D9FF]' : 'text-purple-300'
                                }`}>
                                {msg.role}
                            </p>
                            <p className="text-white/70 text-sm">{msg.content}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Ações */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
            >
                <Link href="/tools/pharmaroleplay/training">
                    <button className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2">
                        <RotateCcw className="w-5 h-5" />
                        Treinar Novamente
                    </button>
                </Link>

                <button className="btn-outline px-6 py-3 rounded-xl inline-flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Baixar Relatório
                </button>

                <button className="border border-white/10 text-white/40 hover:bg-white/5 px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-colors">
                    <Share2 className="w-5 h-5" />
                    Compartilhar
                </button>
            </motion.div>
        </div>
    );
}
