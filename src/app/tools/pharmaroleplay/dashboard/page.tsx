'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft, Play, Target, TrendingUp, Clock, Award,
    ChevronRight, Users, BarChart3,
    Flame, Zap, Star, Shield, CheckCircle2,
    AlertTriangle, ChevronUp, ChevronDown, Loader2,
} from 'lucide-react';
import ScoreRing from '@/components/tools/pharmaroleplay/ScoreRing';

// ── Types ────────────────────────────────────────────────────────────────────

interface AvaliacaoData {
    score_final: number;
    aprovado: boolean;
    xp_ganho: number;
    motivo_reprovacao: string | null;
    pontos_fortes: string[];
    pontos_melhoria: string[];
    usou_tecnicas_fechamento: boolean;
}

interface Sessao {
    id: string;
    cenario: string;
    dificuldade: string;
    scoreGeral: number;
    aprovado: boolean;
    createdAt: string;
    resumo?: { tempoSessao?: number; mensagensUsuario?: number };
    avaliacao?: AvaliacaoData | null;
}

// ── Level / XP system ────────────────────────────────────────────────────────

const NIVEIS = [
    { nome: 'Iniciante', xpMin: 0, xpMax: 500, cor: '#6b7280', icone: '🌱' },
    { nome: 'Praticante', xpMin: 500, xpMax: 1500, cor: '#3b82f6', icone: '📘' },
    { nome: 'Avançado', xpMin: 1500, xpMax: 3000, cor: '#8b5cf6', icone: '⚡' },
    { nome: 'Especialista', xpMin: 3000, xpMax: 5000, cor: '#f59e0b', icone: '🏅' },
    { nome: 'Mestre', xpMin: 5000, xpMax: 99999, cor: '#00D9FF', icone: '👑' },
];

function calcXp(sessoes: Sessao[]): number {
    return sessoes.reduce((acc, s) => {
        // Use LLM-as-a-Judge xp_ganho when available
        if (s.avaliacao?.xp_ganho) return acc + s.avaliacao.xp_ganho;
        let xp = s.scoreGeral;
        if (s.aprovado) xp += 30;
        if (s.scoreGeral >= 90) xp += 20;
        return acc + xp;
    }, 0);
}

function getNivel(xp: number) {
    return NIVEIS.find((n, i) => xp >= n.xpMin && (i === NIVEIS.length - 1 || xp < NIVEIS[i + 1].xpMin)) || NIVEIS[0];
}

// ── Streak ───────────────────────────────────────────────────────────────────

function calcStreak(sessoes: Sessao[]): number {
    if (!sessoes.length) return 0;
    const dias = Array.from(new Set(sessoes.map(s => s.createdAt.slice(0, 10)))).sort().reverse();
    let streak = 0;
    const hoje = new Date().toISOString().slice(0, 10);
    let esperado = hoje;
    for (const dia of dias) {
        if (dia === esperado) {
            streak++;
            const d = new Date(esperado);
            d.setDate(d.getDate() - 1);
            esperado = d.toISOString().slice(0, 10);
        } else break;
    }
    return streak;
}

// ── Achievements ─────────────────────────────────────────────────────────────

interface Achievement {
    id: string;
    titulo: string;
    descricao: string;
    icone: string;
    cor: string;
    check: (s: Sessao[]) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
    { id: 'first', titulo: 'Primeiro Passo', descricao: 'Complete sua primeira sessão', icone: '🎯', cor: '#22c55e', check: s => s.length >= 1 },
    { id: 'veteran', titulo: 'Veterano', descricao: 'Complete 5 sessões', icone: '🎖️', cor: '#3b82f6', check: s => s.length >= 5 },
    { id: 'excellence', titulo: 'Excelência', descricao: 'Score 90+ em qualquer sessão', icone: '⭐', cor: '#f59e0b', check: s => s.some(x => x.scoreGeral >= 90) },
    { id: 'allscenarios', titulo: 'Explorador', descricao: 'Complete todos os 4 cenários', icone: '🗺️', cor: '#8b5cf6', check: s => new Set(s.map(x => x.cenario)).size >= 4 },
    { id: 'streak3', titulo: 'Em Chamas', descricao: '3 dias consecutivos de treino', icone: '🔥', cor: '#ef4444', check: s => calcStreak(s) >= 3 },
    { id: 'perfecto', titulo: 'Perfeito', descricao: 'Score 100 em alguma sessão', icone: '💎', cor: '#00D9FF', check: s => s.some(x => x.scoreGeral >= 100) },
];

// ── Mock team data ────────────────────────────────────────────────────────────

const TEAM = [
    { nome: 'Maria Silva', avatar: '👩‍💼', sessoes: 18, scoreMedio: 92, aprovacao: 94, cenarios: 4, ativo: true },
    { nome: 'João Santos', avatar: '👨‍💼', sessoes: 15, scoreMedio: 88, aprovacao: 87, cenarios: 4, ativo: true },
    { nome: 'Ana Costa', avatar: '👩‍💼', sessoes: 14, scoreMedio: 85, aprovacao: 86, cenarios: 3, ativo: true },
    { nome: 'Você', avatar: '🧑‍💼', sessoes: 0, scoreMedio: 0, aprovacao: 0, cenarios: 0, ativo: true, isMe: true },
    { nome: 'Rafael Souza', avatar: '👨‍💼', sessoes: 11, scoreMedio: 79, aprovacao: 73, cenarios: 3, ativo: true },
    { nome: 'Camila Ramos', avatar: '👩‍💼', sessoes: 8, scoreMedio: 68, aprovacao: 63, cenarios: 2, ativo: false },
    { nome: 'Lucas Pereira', avatar: '👨‍💼', sessoes: 5, scoreMedio: 54, aprovacao: 40, cenarios: 2, ativo: false },
];

const TEAM_SCENARIOS = [
    { cenario: 'Objeção de Preço', scores: [88, 84, 90, 0, 76, 62, 50] },
    { cenario: 'Dúvida sobre Eficácia', scores: [94, 91, 82, 0, 80, 71, 55] },
    { cenario: 'Comparação', scores: [90, 85, 80, 0, 75, 0, 0] },
    { cenario: 'Primeiro Contato', scores: [96, 92, 88, 0, 84, 70, 58] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatData(iso: string): string {
    try { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); }
    catch { return iso.slice(5, 10); }
}

function formatDuracao(s?: number): string {
    if (!s) return '—';
    return `${Math.floor(s / 60)}min`;
}

function getMedicoNome(cenario: string): string {
    const m: Record<string, string> = {
        'Objeção de Preço': 'Dr. Roberto Silva',
        'Dúvida sobre Eficácia': 'Dra. Ana Costa',
        'Comparação com Concorrente': 'Dr. Carlos Mendes',
        'Primeiro Contato': 'Dr. Paulo Ferreira',
    };
    return m[cenario] || 'Médico Simulado';
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const [view, setView] = useState<'user' | 'manager'>('user');
    const [sessoes, setSessoes] = useState<Sessao[]>([]);
    const [loading, setLoading] = useState(true);
    const [managerSort, setManagerSort] = useState<'scoreMedio' | 'sessoes' | 'aprovacao'>('scoreMedio');
    const [managerSortDir, setManagerSortDir] = useState<'desc' | 'asc'>('desc');

    useEffect(() => {
        fetch('/api/pharmaroleplay/sessions')
            .then(r => r.json())
            .then(d => setSessoes(Array.isArray(d.sessions) ? d.sessions : []))
            .catch(() => setSessoes([]))
            .finally(() => setLoading(false));
    }, []);

    // ── User computed stats ──
    const xp = calcXp(sessoes);
    const nivel = getNivel(xp);
    const proximoNivel = NIVEIS[NIVEIS.indexOf(nivel) + 1];
    const xpProgress = proximoNivel
        ? Math.round(((xp - nivel.xpMin) / (proximoNivel.xpMin - nivel.xpMin)) * 100)
        : 100;
    const streak = calcStreak(sessoes);
    const scoreMedio = sessoes.length ? Math.round(sessoes.reduce((a, s) => a + s.scoreGeral, 0) / sessoes.length) : 0;
    const aprovados = sessoes.filter(s => s.aprovado).length;
    const tempoTotal = sessoes.reduce((a, s) => a + (s.resumo?.tempoSessao || 0), 0);
    const horas = Math.floor(tempoTotal / 3600);
    const minutos = Math.floor((tempoTotal % 3600) / 60);
    const tempoStr = horas > 0 ? `${horas}h ${minutos}min` : minutos > 0 ? `${minutos}min` : '—';

    const progressoCenarios = [
        'Objeção de Preço',
        'Dúvida sobre Eficácia',
        'Comparação com Concorrente',
        'Primeiro Contato',
    ].map(nome => {
        const deste = sessoes.filter(s => s.cenario === nome);
        const melhor = deste.length ? Math.max(...deste.map(s => s.scoreGeral)) : 0;
        return { nome, tentativas: deste.length, melhor };
    });

    // ── Manager computed ──
    const teamWithMe = TEAM.map(m => m.isMe
        ? { ...m, sessoes: sessoes.length, scoreMedio, aprovacao: sessoes.length ? Math.round((aprovados / sessoes.length) * 100) : 0, cenarios: new Set(sessoes.map(s => s.cenario)).size }
        : m
    );
    const teamSorted = [...teamWithMe].sort((a, b) => {
        const dir = managerSortDir === 'desc' ? -1 : 1;
        return (a[managerSort] - b[managerSort]) * dir;
    });
    const teamAvg = Math.round(teamWithMe.reduce((a, m) => a + m.scoreMedio, 0) / teamWithMe.filter(m => m.sessoes > 0).length) || 0;
    const teamAprovacao = Math.round(teamWithMe.reduce((a, m) => a + m.aprovacao, 0) / teamWithMe.filter(m => m.sessoes > 0).length) || 0;
    const ativos = teamWithMe.filter(m => m.ativo).length;
    const underperformers = teamWithMe.filter(m => m.sessoes > 0 && m.scoreMedio < 65);

    function toggleSort(col: typeof managerSort) {
        if (managerSort === col) setManagerSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setManagerSort(col); setManagerSortDir('desc'); }
    }

    const SortIcon = ({ col }: { col: typeof managerSort }) => {
        if (managerSort !== col) return <ChevronDown className="w-3 h-3 text-white/20" />;
        return managerSortDir === 'desc' ? <ChevronDown className="w-3 h-3 text-[#00D9FF]" /> : <ChevronUp className="w-3 h-3 text-[#00D9FF]" />;
    };

    return (
        <div className="min-h-screen pt-20 py-8 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/tools/pharmaroleplay" className="text-white/30 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                            <p className="text-white/40">PharmaRoleplay — Análise de Desempenho</p>
                        </div>
                    </div>
                    <Link href="/tools/pharmaroleplay/training">
                        <button className="btn-primary px-6 py-2.5 rounded-xl inline-flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Novo Treino
                        </button>
                    </Link>
                </motion.div>

                {/* View Toggle */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
                    <button
                        onClick={() => setView('user')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'user' ? 'bg-[#00D9FF] text-white shadow-lg shadow-[#00D9FF]/20' : 'text-white/50 hover:text-white'}`}
                    >
                        <Target className="w-4 h-4" />
                        Meu Desempenho
                    </button>
                    <button
                        onClick={() => setView('manager')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'manager' ? 'bg-[#00D9FF] text-white shadow-lg shadow-[#00D9FF]/20' : 'text-white/50 hover:text-white'}`}
                    >
                        <Users className="w-4 h-4" />
                        Visão do Gestor
                    </button>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* ══════════════════ USER VIEW ══════════════════ */}
                    {view === 'user' && (
                        <motion.div key="user" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>

                            {/* Level + streak bar */}
                            <div className="glass-card rounded-xl p-5 mb-6 flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{nivel.icone}</span>
                                    <div>
                                        <p className="text-white font-bold text-lg">{nivel.nome}</p>
                                        <p className="text-white/50 text-xs">{xp} XP total</p>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between text-xs text-white/40 mb-1.5">
                                        <span>{xp - nivel.xpMin} XP</span>
                                        {proximoNivel && <span>→ {proximoNivel.nome} ({proximoNivel.xpMin - xp} XP)</span>}
                                    </div>
                                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${xpProgress}%` }}
                                            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: nivel.cor }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                    <div>
                                        <p className="text-white font-bold leading-none">{streak}</p>
                                        <p className="text-orange-400/70 text-xs">dias streak</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <div>
                                        <p className="text-white font-bold leading-none">{xp}</p>
                                        <p className="text-yellow-400/70 text-xs">XP ganho</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {[
                                    { label: 'Sessões', value: loading ? '…' : sessoes.length, icon: Target, color: '#00D9FF' },
                                    { label: 'Score Médio', value: loading ? '…' : (scoreMedio || '—'), icon: TrendingUp, color: '#22c55e' },
                                    { label: 'Aprovações', value: loading ? '…' : `${aprovados}/${sessoes.length}`, icon: Award, color: '#A855F7' },
                                    { label: 'Tempo Treinado', value: loading ? '…' : tempoStr, icon: Clock, color: '#f59e0b' },
                                ].map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + i * 0.07 }}
                                        className="glass-card rounded-xl p-5">
                                        <s.icon className="w-5 h-5 mb-3" style={{ color: s.color }} />
                                        <p className="text-2xl font-bold text-white">{s.value}</p>
                                        <p className="text-sm text-white/40">{s.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Weekly challenge */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                className="rounded-xl p-5 mb-6 border border-[#00D9FF]/20 bg-[#00D9FF]/5 flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/20 flex items-center justify-center flex-shrink-0">
                                    <Star className="w-6 h-6 text-[#00D9FF]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-white font-semibold">Desafio da Semana</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF]">+150 XP</span>
                                    </div>
                                    <p className="text-white/50 text-sm">Consiga score 80+ em 3 cenários diferentes esta semana</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[#00D9FF] font-bold text-xl">
                                        {Math.min(progressoCenarios.filter(c => c.melhor >= 80).length, 3)}/3
                                    </p>
                                    <p className="text-white/30 text-xs">cenários</p>
                                </div>
                            </motion.div>

                            {/* Main grid */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-6">
                                    {/* Recent sessions */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="glass-card rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-lg font-semibold text-white">Sessões Recentes</h2>
                                            <Link href="/tools/pharmaroleplay/history" className="text-sm text-[#00D9FF] hover:underline inline-flex items-center gap-1">
                                                Ver todas <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-3 py-10 text-white/30">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span className="text-sm">Carregando...</span>
                                            </div>
                                        ) : sessoes.length === 0 ? (
                                            <div className="py-14 text-center border-t border-white/5 mt-4">
                                                <div className="w-16 h-16 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center mx-auto mb-5 relative">
                                                    <div className="absolute inset-0 bg-[#00D9FF]/20 blur-xl rounded-full" />
                                                    <Target className="w-8 h-8 text-[#00D9FF] relative z-10" />
                                                </div>
                                                <h3 className="text-white font-semibold text-lg mb-2">Sua jornada começa aqui</h3>
                                                <p className="text-white/50 text-sm max-w-[280px] mx-auto mb-6">
                                                    Você ainda não possui sessões gravadas. Simule seu primeiro atendimento e ganhe insights com IA!
                                                </p>
                                                <Link href="/tools/pharmaroleplay/training">
                                                    <button className="btn-primary px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                                                        Iniciar Meu 1º Treino
                                                    </button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {sessoes.slice(0, 5).map((s) => (
                                                    <div key={s.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${s.aprovado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                {s.scoreGeral}
                                                            </div>
                                                            <div>
                                                                <p className="text-white text-sm font-medium">{s.cenario}</p>
                                                                <p className="text-white/40 text-xs">{getMedicoNome(s.cenario)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-white/30 text-xs">{formatData(s.createdAt)}</span>
                                                            <span className="text-white/30 text-xs">{formatDuracao(s.resumo?.tempoSessao)}</span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${s.aprovado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                {s.aprovado ? '✓' : '✗'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Scenario progress */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                        className="glass-card rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-white mb-5">Progresso por Cenário</h2>
                                        <div className="space-y-5">
                                            {progressoCenarios.map((c, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white/70 text-sm">{c.nome}</span>
                                                            {c.tentativas > 0 && (
                                                                <span className="text-xs text-white/30">{c.tentativas} sess.</span>
                                                            )}
                                                        </div>
                                                        <span className={`text-sm font-semibold ${c.melhor >= 80 ? 'text-green-400' : c.melhor >= 60 ? 'text-[#00D9FF]' : c.melhor > 0 ? 'text-yellow-400' : 'text-white/20'}`}>
                                                            {c.melhor > 0 ? `${c.melhor} melhor` : 'Não iniciado'}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${c.melhor}%` }}
                                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: c.melhor >= 80 ? '#22c55e' : c.melhor >= 60 ? '#00D9FF' : '#f59e0b' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Achievements */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                        className="glass-card rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-white mb-5">Conquistas</h2>
                                        <div className="grid grid-cols-3 gap-3">
                                            {ACHIEVEMENTS.map(a => {
                                                const unlocked = a.check(sessoes);
                                                return (
                                                    <div key={a.id} className={`rounded-xl p-4 text-center border transition-all ${unlocked ? 'border-white/20 bg-white/5' : 'border-white/5 bg-white/[0.02] opacity-50'}`}>
                                                        <div className="text-2xl mb-2">{unlocked ? a.icone : '🔒'}</div>
                                                        <p className={`text-xs font-semibold mb-1 ${unlocked ? 'text-white' : 'text-white/30'}`}>{a.titulo}</p>
                                                        <p className="text-[10px] text-white/30">{a.descricao}</p>
                                                        {unlocked && (
                                                            <div className="mt-2">
                                                                <CheckCircle2 className="w-3.5 h-3.5 mx-auto" style={{ color: a.cor }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right col */}
                                <div className="space-y-6">
                                    {/* Score ring */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="glass-card rounded-xl p-6 text-center">
                                        <h2 className="text-lg font-semibold text-white mb-5">Score Geral</h2>
                                        <div className="flex justify-center">
                                            <ScoreRing score={scoreMedio} size={160} strokeWidth={10} />
                                        </div>
                                        <p className="text-white/50 mt-4 text-xs">
                                            {sessoes.length > 0 ? `Baseado em ${sessoes.length} sessão${sessoes.length > 1 ? 'ões' : ''}` : 'Sem sessões ainda'}
                                        </p>
                                    </motion.div>

                                    {/* Leaderboard preview */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                        className="glass-card rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-lg font-semibold text-white">🏆 Ranking</h2>
                                            <button onClick={() => setView('manager')} className="text-xs text-[#00D9FF] hover:underline">ver time →</button>
                                        </div>
                                        <div className="space-y-2">
                                            {[...teamWithMe]
                                                .sort((a, b) => b.scoreMedio - a.scoreMedio)
                                                .map((u, i) => {
                                                    const rankIcons = ['🥇', '🥈', '🥉'];
                                                    return (
                                                        <div key={u.nome} className={`flex items-center justify-between p-2.5 rounded-lg ${u.isMe ? 'bg-[#00D9FF]/10 border border-[#00D9FF]/20' : 'bg-white/[0.02]'}`}>
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-sm w-5 text-center">{rankIcons[i] || `#${i + 1}`}</span>
                                                                <span className="text-base">{u.avatar}</span>
                                                                <span className={`text-sm ${u.isMe ? 'text-[#00D9FF] font-medium' : 'text-white/70'}`}>{u.nome}</span>
                                                            </div>
                                                            <span className="text-white font-bold text-sm">{u.scoreMedio || '—'}</span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ══════════════════ MANAGER VIEW ══════════════════ */}
                    {view === 'manager' && (
                        <motion.div key="manager" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                            {/* Team KPIs */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {[
                                    { label: 'Membros no Time', value: teamWithMe.length, icon: Users, color: '#00D9FF' },
                                    { label: 'Score Médio do Time', value: teamAvg || '—', icon: BarChart3, color: '#22c55e' },
                                    { label: 'Taxa de Aprovação', value: teamAprovacao ? `${teamAprovacao}%` : '—', icon: Shield, color: '#A855F7' },
                                    { label: 'Ativos esta semana', value: ativos, icon: Flame, color: '#f59e0b' },
                                ].map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                        className="glass-card rounded-xl p-5">
                                        <s.icon className="w-5 h-5 mb-3" style={{ color: s.color }} />
                                        <p className="text-2xl font-bold text-white">{s.value}</p>
                                        <p className="text-sm text-white/40">{s.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Alerts */}
                            {underperformers.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="rounded-xl p-4 mb-6 border border-orange-500/30 bg-orange-500/5 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-medium text-sm mb-1">Atenção: representantes abaixo do mínimo (65)</p>
                                        <p className="text-orange-400/70 text-xs">
                                            {underperformers.map(u => u.nome).join(', ')} precisam de suporte adicional.
                                            Considere sessões de coaching ou cenários mais simples para recuperação.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Aggregated pontos_melhoria from real sessions */}
                            {sessoes.some(s => s.avaliacao?.pontos_melhoria?.length) && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                    className="rounded-xl p-5 mb-6 border border-[#00D9FF]/20 bg-[#00D9FF]/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Target className="w-5 h-5 text-[#00D9FF]" />
                                        <h3 className="text-white font-semibold text-sm">Pontos de Melhoria — Análise LLM Agregada</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {(() => {
                                            const melhorias: Record<string, number> = {};
                                            sessoes.forEach(s => {
                                                (s.avaliacao?.pontos_melhoria || []).forEach(pm => {
                                                    const key = pm.toLowerCase().trim();
                                                    melhorias[key] = (melhorias[key] || 0) + 1;
                                                });
                                            });
                                            return Object.entries(melhorias)
                                                .sort((a, b) => b[1] - a[1])
                                                .slice(0, 5)
                                                .map(([melhoria, count], i) => (
                                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03]">
                                                        <span className="text-white/70 text-sm capitalize">{melhoria}</span>
                                                        <span className="text-[#00D9FF] text-xs font-medium">{count}x mencionado</span>
                                                    </div>
                                                ));
                                        })()}
                                    </div>
                                </motion.div>
                            )}

                            {/* Team table + scenario breakdown */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-6">
                                    {/* Team leaderboard table */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                        className="glass-card rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-white mb-5">Ranking do Time</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-white/5">
                                                        <th className="text-left text-xs text-white/30 pb-3 font-normal">#</th>
                                                        <th className="text-left text-xs text-white/30 pb-3 font-normal">Representante</th>
                                                        <th className="text-right pb-3">
                                                            <button onClick={() => toggleSort('scoreMedio')} className="text-xs text-white/30 hover:text-white flex items-center gap-1 ml-auto">
                                                                Score <SortIcon col="scoreMedio" />
                                                            </button>
                                                        </th>
                                                        <th className="text-right pb-3">
                                                            <button onClick={() => toggleSort('sessoes')} className="text-xs text-white/30 hover:text-white flex items-center gap-1 ml-auto">
                                                                Sessões <SortIcon col="sessoes" />
                                                            </button>
                                                        </th>
                                                        <th className="text-right pb-3">
                                                            <button onClick={() => toggleSort('aprovacao')} className="text-xs text-white/30 hover:text-white flex items-center gap-1 ml-auto">
                                                                Aprovação <SortIcon col="aprovacao" />
                                                            </button>
                                                        </th>
                                                        <th className="text-right text-xs text-white/30 pb-3 font-normal">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {teamSorted.map((m, i) => {
                                                        const rankFull = [...teamWithMe].sort((a, b) => b.scoreMedio - a.scoreMedio);
                                                        const rank = rankFull.findIndex(x => x.nome === m.nome) + 1;
                                                        const medalIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
                                                        return (
                                                            <tr key={m.nome} className={`border-b border-white/5 ${m.isMe ? 'bg-[#00D9FF]/5' : ''}`}>
                                                                <td className="py-3 text-sm">
                                                                    <span>{medalIcons[rank] || <span className="text-white/30">#{rank}</span>}</span>
                                                                </td>
                                                                <td className="py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-lg">{m.avatar}</span>
                                                                        <span className={`text-sm ${m.isMe ? 'text-[#00D9FF] font-medium' : 'text-white/80'}`}>{m.nome}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 text-right">
                                                                    <span className={`text-sm font-bold ${m.scoreMedio >= 80 ? 'text-green-400' : m.scoreMedio >= 65 ? 'text-white' : m.scoreMedio > 0 ? 'text-red-400' : 'text-white/20'}`}>
                                                                        {m.scoreMedio || '—'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 text-right text-sm text-white/60">{m.sessoes || '—'}</td>
                                                                <td className="py-3 text-right">
                                                                    <span className={`text-sm ${m.aprovacao >= 80 ? 'text-green-400' : m.aprovacao >= 60 ? 'text-yellow-400' : m.aprovacao > 0 ? 'text-red-400' : 'text-white/20'}`}>
                                                                        {m.aprovacao ? `${m.aprovacao}%` : '—'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 text-right">
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${m.ativo ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                                                                        {m.ativo ? 'Ativo' : 'Inativo'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>

                                    {/* Scenario breakdown heatmap */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="glass-card rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-white mb-5">Performance por Cenário</h2>
                                        <div className="space-y-4">
                                            {TEAM_SCENARIOS.map((sc, si) => {
                                                const scores = sc.scores.map((score, mi) => ({
                                                    score: mi === 3 ? (scoreMedio || 0) : score,
                                                    nome: teamWithMe[mi]?.nome,
                                                }));
                                                const avgScore = Math.round(scores.filter(s => s.score > 0).reduce((a, s) => a + s.score, 0) / scores.filter(s => s.score > 0).length) || 0;
                                                return (
                                                    <div key={si}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-white/70 text-sm">{sc.cenario}</span>
                                                            <span className={`text-xs font-semibold ${avgScore >= 80 ? 'text-green-400' : avgScore >= 65 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                                Média: {avgScore}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {scores.map((s, i) => (
                                                                <div key={i} className="group relative flex-1">
                                                                    <div className="h-7 rounded" style={{
                                                                        backgroundColor: s.score === 0 ? 'rgba(255,255,255,0.05)'
                                                                            : s.score >= 80 ? `rgba(34,197,94,${0.3 + (s.score - 80) / 200})`
                                                                                : s.score >= 65 ? `rgba(245,158,11,${0.3 + (s.score - 65) / 150})`
                                                                                    : `rgba(239,68,68,${0.3 + (65 - s.score) / 200})`
                                                                    }} />
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                                        {s.nome}: {s.score || 'N/A'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <p className="text-white/45 text-xs mt-2">Passe o mouse sobre cada bloco para ver o score individual</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right col */}
                                <div className="space-y-6">
                                    {/* Top performers */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="glass-card rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-white mb-5">🏆 Top Performers</h2>
                                        <div className="space-y-3">
                                            {[...teamWithMe]
                                                .filter(m => m.sessoes > 0)
                                                .sort((a, b) => b.scoreMedio - a.scoreMedio)
                                                .slice(0, 3)
                                                .map((m, i) => {
                                                    const medals = ['🥇', '🥈', '🥉'];
                                                    const colors = ['#f59e0b', '#9ca3af', '#b45309'];
                                                    return (
                                                        <div key={m.nome} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                                                            <span className="text-xl">{medals[i]}</span>
                                                            <div className="flex-1">
                                                                <p className={`text-sm font-medium ${m.isMe ? 'text-[#00D9FF]' : 'text-white'}`}>{m.nome}</p>
                                                                <p className="text-white/30 text-xs">{m.sessoes} sessões · {m.aprovacao}% aprovação</p>
                                                            </div>
                                                            <span className="text-lg font-bold" style={{ color: colors[i] }}>{m.scoreMedio}</span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </motion.div>

                                    {/* Score distribution */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                        className="glass-card rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-white mb-5">Distribuição de Scores</h2>
                                        {[
                                            { label: '90-100 (Excelente)', count: teamWithMe.filter(m => m.scoreMedio >= 90).length, color: '#22c55e' },
                                            { label: '80-89 (Bom)', count: teamWithMe.filter(m => m.scoreMedio >= 80 && m.scoreMedio < 90).length, color: '#00D9FF' },
                                            { label: '65-79 (Regular)', count: teamWithMe.filter(m => m.scoreMedio >= 65 && m.scoreMedio < 80).length, color: '#f59e0b' },
                                            { label: '< 65 (Atenção)', count: teamWithMe.filter(m => m.scoreMedio > 0 && m.scoreMedio < 65).length, color: '#ef4444' },
                                        ].map((b, i) => (
                                            <div key={i} className="mb-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-white/50">{b.label}</span>
                                                    <span className="font-medium" style={{ color: b.color }}>{b.count}</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(b.count / teamWithMe.length) * 100}%` }}
                                                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: b.color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>

                                    {/* Cenário coverage */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                        className="glass-card rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-white mb-5">Cobertura de Cenários</h2>
                                        <div className="space-y-3">
                                            {TEAM_SCENARIOS.map((sc, i) => {
                                                const covered = sc.scores.filter((s, mi) => mi === 3 ? sessoes.length > 0 : s > 0).length;
                                                return (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-white/50 truncate max-w-[140px]">{sc.cenario}</span>
                                                            <span className="text-white/70">{covered}/{teamWithMe.length}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(covered / teamWithMe.length) * 100}%` }}
                                                                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                                                                className="h-full bg-purple-500 rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
