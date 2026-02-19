'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    BarChart3,
    Award,
    Clock,
    Target,
    ChevronRight,
    TrendingUp,
    Play,
    Crown,
    Medal,
    Trophy,
    ArrowLeft
} from 'lucide-react';
import ScoreRing from '@/components/tools/pharmaroleplay/ScoreRing';

// Mock data
const estatisticas = {
    sessionsCompleted: 12,
    averageScore: 78,
    totalTime: '8h 32min',
    certificados: 3
};

const sessoesRecentes = [
    { id: '1', cenario: 'Objeção de Preço', medico: 'Dr. Roberto Silva', score: 85, data: '2024-01-15', duracao: '12min', status: 'aprovado' },
    { id: '2', cenario: 'Dúvida sobre Eficácia', medico: 'Dra. Ana Costa', score: 72, data: '2024-01-14', duracao: '15min', status: 'aprovado' },
    { id: '3', cenario: 'Comparação com Concorrente', medico: 'Dr. Carlos Mendes', score: 58, data: '2024-01-13', duracao: '10min', status: 'reprovado' },
    { id: '4', cenario: 'Primeiro Contato', medico: 'Dr. Paulo Ferreira', score: 90, data: '2024-01-12', duracao: '8min', status: 'aprovado' },
];

const leaderboard = [
    { nome: 'Maria Silva', score: 95, avatar: '👩‍💼' },
    { nome: 'João Santos', score: 92, avatar: '👨‍💼' },
    { nome: 'Ana Costa', score: 88, avatar: '👩‍💼' },
    { nome: 'Você', score: 78, avatar: '🧑‍💼' },
    { nome: 'Pedro Lima', score: 72, avatar: '👨‍💼' },
];

const progressoCenarios = [
    { nome: 'Objeção de Preço', concluidos: 4, total: 5, score: 82 },
    { nome: 'Dúvida sobre Eficácia', concluidos: 3, total: 5, score: 75 },
    { nome: 'Comparação com Concorrente', concluidos: 2, total: 5, score: 58 },
    { nome: 'Primeiro Contato', concluidos: 3, total: 5, score: 90 },
];

export default function DashboardPage() {
    const medalIcons = [Trophy, Medal, Crown];

    return (
        <div className="min-h-screen pt-20 py-8 px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8 max-w-7xl mx-auto"
                >
                    <div className="flex items-center gap-4">
                        <Link href="/tools/pharmaroleplay" className="text-white/30 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                            <p className="text-white/40">Acompanhe seu progresso no PharmaRoleplay</p>
                        </div>
                    </div>
                    <Link href="/tools/pharmaroleplay/training">
                        <button className="btn-primary px-6 py-2.5 rounded-xl inline-flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Novo Treino
                        </button>
                    </Link>
                </motion.div>

                <div className="max-w-7xl mx-auto">
                    {/* Statistics Cards */}
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Sessões Completas', value: estatisticas.sessionsCompleted, icon: Target, color: '#00D9FF' },
                            { label: 'Score Médio', value: estatisticas.averageScore, icon: TrendingUp, color: '#22c55e' },
                            { label: 'Tempo Treinado', value: estatisticas.totalTime, icon: Clock, color: '#A855F7' },
                            { label: 'Certificados', value: estatisticas.certificados, icon: Award, color: '#eab308' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card rounded-xl p-5"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                                </div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-white/40">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Column 1-2: Recent Sessions & Progress */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Recent Sessions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card rounded-xl p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-white">Sessões Recentes</h2>
                                    <Link href="/tools/pharmaroleplay/history" className="text-sm text-[#00D9FF] hover:underline inline-flex items-center gap-1">
                                        Ver todas <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {sessoesRecentes.map((sessao) => (
                                        <div
                                            key={sessao.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sessao.status === 'aprovado' ? 'bg-green-500/20' : 'bg-red-500/20'
                                                    }`}>
                                                    <span className={`text-lg font-bold ${sessao.status === 'aprovado' ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                        {sessao.score}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{sessao.cenario}</p>
                                                    <p className="text-white/40 text-sm">{sessao.medico}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-white/30 text-sm">{sessao.duracao}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${sessao.status === 'aprovado'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {sessao.status === 'aprovado' ? '✓ Aprovado' : '✗ Reprovado'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Scenario Progress */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-card rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Progresso por Cenário</h2>
                                <div className="space-y-5">
                                    {progressoCenarios.map((cenario, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-white/70">{cenario.nome}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-white/30">{cenario.concluidos}/{cenario.total}</span>
                                                    <span className={`font-semibold ${cenario.score >= 80 ? 'text-green-400' :
                                                            cenario.score >= 60 ? 'text-[#00D9FF]' :
                                                                'text-yellow-400'
                                                        }`}>{cenario.score}</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(cenario.concluidos / cenario.total) * 100}%` }}
                                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                                    className={`h-full rounded-full ${cenario.score >= 80 ? 'bg-green-500' :
                                                            cenario.score >= 60 ? 'bg-[#00D9FF]' :
                                                                'bg-yellow-500'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Column 3: Score & Leaderboard */}
                        <div className="space-y-6">
                            {/* Score Ring */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card rounded-xl p-6 text-center"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Score Geral</h2>
                                <div className="flex justify-center">
                                    <ScoreRing score={estatisticas.averageScore} size={160} strokeWidth={10} />
                                </div>
                                <p className="text-white/40 mt-4 text-sm">Baseado nas últimas 12 sessões</p>
                            </motion.div>

                            {/* Leaderboard */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-card rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">🏆 Ranking</h2>
                                <div className="space-y-3">
                                    {leaderboard.map((user, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-between p-3 rounded-lg ${user.nome === 'Você' ? 'bg-[#00D9FF]/10 border border-[#00D9FF]/20' : 'bg-white/[0.02]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold w-6 ${i === 0 ? 'text-yellow-400' :
                                                        i === 1 ? 'text-gray-300' :
                                                            i === 2 ? 'text-amber-600' : 'text-white/30'
                                                    }`}>
                                                    #{i + 1}
                                                </span>
                                                <span className="text-lg">{user.avatar}</span>
                                                <span className={`${user.nome === 'Você' ? 'text-[#00D9FF] font-medium' : 'text-white/70'}`}>
                                                    {user.nome}
                                                </span>
                                            </div>
                                            <span className="font-bold text-white">{user.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
