'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    Clock,
    Target,
    TrendingUp,
    Calendar,
    Loader2,
    RefreshCw,
} from 'lucide-react';

interface Sessao {
    id: string;
    sessaoId: string;
    cenario: string;
    dificuldade: string;
    scoreGeral: number;
    aprovado: boolean;
    createdAt: string;
    resumo: {
        tempoSessao?: number;
        mensagensUsuario?: number;
    };
}

function formatData(iso: string): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return iso.slice(0, 10);
    }
}

function formatDuracao(segundos?: number): string {
    if (!segundos) return '—';
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}min ${secs}s`;
}

function getMedicoNome(cenario: string): string {
    const nomes: Record<string, string> = {
        'Objeção de Preço': 'Dr. Roberto Silva',
        'Dúvida sobre Eficácia': 'Dra. Ana Costa',
        'Comparação com Concorrente': 'Dr. Carlos Mendes',
        'Primeiro Contato': 'Dr. Paulo Ferreira',
    };
    return nomes[cenario] || 'Médico Simulado';
}

export default function HistoryPage() {
    const [sessoes, setSessoes] = useState<Sessao[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState<'todos' | 'aprovado' | 'reprovado'>('todos');

    const buscarSessoes = async () => {
        setLoading(true);
        setErro(null);
        try {
            const res = await fetch('/api/pharmaroleplay/sessions');
            const data = await res.json();
            setSessoes(Array.isArray(data.sessions) ? data.sessions : []);
        } catch {
            setErro('Não foi possível carregar o histórico. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarSessoes();
    }, []);

    const sessoesFiltradas = sessoes.filter(sessao => {
        const matchBusca = sessao.cenario.toLowerCase().includes(busca.toLowerCase()) ||
            getMedicoNome(sessao.cenario).toLowerCase().includes(busca.toLowerCase());
        const matchStatus = filtroStatus === 'todos' ||
            (filtroStatus === 'aprovado' && sessao.aprovado) ||
            (filtroStatus === 'reprovado' && !sessao.aprovado);
        return matchBusca && matchStatus;
    });

    const aprovados = sessoes.filter(s => s.aprovado).length;
    const scoreMedio = sessoes.length > 0
        ? Math.round(sessoes.reduce((acc, s) => acc + (s.scoreGeral || 0), 0) / sessoes.length)
        : 0;

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
                            <p className="text-white/40">Todas as suas sessões de treinamento salvas</p>
                        </div>
                    </div>
                    <button
                        onClick={buscarSessoes}
                        disabled={loading}
                        className="border border-white/10 text-white/50 hover:bg-white/5 px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors disabled:opacity-40"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </button>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="glass-card rounded-xl p-4 text-center">
                        <Target className="w-5 h-5 text-[#00D9FF] mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{sessoes.length}</p>
                        <p className="text-xs text-white/40">Total Sessões</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="glass-card rounded-xl p-4 text-center">
                        <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{aprovados}/{sessoes.length}</p>
                        <p className="text-xs text-white/40">Aprovações</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass-card rounded-xl p-4 text-center">
                        <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{scoreMedio || '—'}</p>
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
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 p-16 text-white/40">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Carregando sessões...</span>
                        </div>
                    ) : erro ? (
                        <div className="p-12 text-center">
                            <p className="text-red-400 mb-4">{erro}</p>
                            <button onClick={buscarSessoes} className="btn-outline px-4 py-2 rounded-lg text-sm">
                                Tentar novamente
                            </button>
                        </div>
                    ) : sessoesFiltradas.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-white/30 text-lg mb-2">
                                {sessoes.length === 0 ? 'Nenhuma sessão salva ainda' : 'Nenhuma sessão encontrada'}
                            </p>
                            {sessoes.length === 0 && (
                                <p className="text-white/20 text-sm">Complete uma sessão de treinamento para ver o histórico aqui</p>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {sessoesFiltradas.map((sessao) => (
                                <div
                                    key={sessao.id}
                                    className="flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors"
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Score */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sessao.scoreGeral >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                            <span className={`text-lg font-bold ${sessao.scoreGeral >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                                                {sessao.scoreGeral}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <p className="text-white font-medium">{sessao.cenario}</p>
                                            <p className="text-white/40 text-sm">{getMedicoNome(sessao.cenario)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex items-center gap-1 text-white/30 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {formatData(sessao.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1 text-white/30 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {formatDuracao(sessao.resumo?.tempoSessao)}
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full ${sessao.aprovado
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {sessao.aprovado ? '✓ Aprovado' : '✗ Reprovado'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
