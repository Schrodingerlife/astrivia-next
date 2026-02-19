'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    ChevronRight,
    Clock,
    Download,
    Target,
    TrendingUp,
    Calendar
} from 'lucide-react';

const historico = [
    { id: '1', cenario: 'Objeção de Preço', medico: 'Dr. Roberto Silva', score: 85, data: '15/01/2024', duracao: '12min', status: 'aprovado' as const },
    { id: '2', cenario: 'Dúvida sobre Eficácia', medico: 'Dra. Ana Costa', score: 72, data: '14/01/2024', duracao: '15min', status: 'aprovado' as const },
    { id: '3', cenario: 'Comparação com Concorrente', medico: 'Dr. Carlos Mendes', score: 58, data: '13/01/2024', duracao: '10min', status: 'reprovado' as const },
    { id: '4', cenario: 'Primeiro Contato', medico: 'Dr. Paulo Ferreira', score: 90, data: '12/01/2024', duracao: '8min', status: 'aprovado' as const },
    { id: '5', cenario: 'Objeção de Preço', medico: 'Dr. Roberto Silva', score: 65, data: '11/01/2024', duracao: '14min', status: 'reprovado' as const },
    { id: '6', cenario: 'Dúvida sobre Eficácia', medico: 'Dra. Ana Costa', score: 82, data: '10/01/2024', duracao: '11min', status: 'aprovado' as const },
    { id: '7', cenario: 'Primeiro Contato', medico: 'Dr. Paulo Ferreira', score: 77, data: '09/01/2024', duracao: '9min', status: 'aprovado' as const },
    { id: '8', cenario: 'Comparação com Concorrente', medico: 'Dr. Carlos Mendes', score: 45, data: '08/01/2024', duracao: '7min', status: 'reprovado' as const },
];

export default function HistoryPage() {
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState<'todos' | 'aprovado' | 'reprovado'>('todos');

    const sessoesFiltradas = historico.filter(sessao => {
        const matchBusca = sessao.cenario.toLowerCase().includes(busca.toLowerCase()) ||
            sessao.medico.toLowerCase().includes(busca.toLowerCase());
        const matchStatus = filtroStatus === 'todos' || sessao.status === filtroStatus;
        return matchBusca && matchStatus;
    });

    const totalSessoes = historico.length;
    const aprovados = historico.filter(s => s.status === 'aprovado').length;
    const scoreMedio = Math.round(historico.reduce((acc, s) => acc + s.score, 0) / historico.length);

    return (
        <div className="min-h-screen pt-20 py-8 px-6">
            <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div className="flex items-center gap-4">
                            <Link href="/tools/pharmaroleplay/dashboard" className="text-white/30 hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Histórico de Sessões</h1>
                                <p className="text-white/40">Todas as suas sessões de treinamento</p>
                            </div>
                        </div>
                        <button className="border border-white/10 text-white/50 hover:bg-white/5 px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="glass-card rounded-xl p-4 text-center">
                            <Target className="w-5 h-5 text-[#00D9FF] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{totalSessoes}</p>
                            <p className="text-xs text-white/40">Total Sessões</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="glass-card rounded-xl p-4 text-center">
                            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{aprovados}/{totalSessoes}</p>
                            <p className="text-xs text-white/40">Aprovações</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="glass-card rounded-xl p-4 text-center">
                            <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{scoreMedio}</p>
                            <p className="text-xs text-white/40">Score Médio</p>
                        </motion.div>
                    </div>

                    {/* Search & Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 mb-6"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar por cenário ou médico..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            {[
                                { label: 'Todos', value: 'todos' as const },
                                { label: 'Aprovados', value: 'aprovado' as const },
                                { label: 'Reprovados', value: 'reprovado' as const },
                            ].map(filtro => (
                                <button
                                    key={filtro.value}
                                    onClick={() => setFiltroStatus(filtro.value)}
                                    className={`px-4 py-2.5 rounded-xl text-sm transition-all ${filtroStatus === filtro.value
                                            ? 'bg-[#00D9FF] text-white'
                                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    {filtro.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Session List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-xl overflow-hidden"
                    >
                        <div className="divide-y divide-white/5">
                            {sessoesFiltradas.map((sessao) => (
                                <div
                                    key={sessao.id}
                                    className="flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors group"
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Score */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sessao.score >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
                                            }`}>
                                            <span className={`text-lg font-bold ${sessao.score >= 70 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {sessao.score}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <p className="text-white font-medium">{sessao.cenario}</p>
                                            <p className="text-white/40 text-sm">{sessao.medico}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex items-center gap-1 text-white/30 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {sessao.data}
                                        </div>
                                        <div className="flex items-center gap-1 text-white/30 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {sessao.duracao}
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full ${sessao.status === 'aprovado'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {sessao.status === 'aprovado' ? '✓ Aprovado' : '✗ Reprovado'}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white/30 transition-colors" />
                                    </div>
                                </div>
                            ))}

                            {sessoesFiltradas.length === 0 && (
                                <div className="p-12 text-center">
                                    <p className="text-white/30">Nenhuma sessão encontrada</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
            </div>
        </div>
    );
}
