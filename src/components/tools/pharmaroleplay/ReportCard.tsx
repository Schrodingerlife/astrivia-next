'use client';

import { useState } from 'react';
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
    MessageSquare,
    AlertTriangle,
    Lightbulb,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import ScoreRing from './ScoreRing';
import Link from 'next/link';

interface AnaliseItem {
    frase_usuario: string;
    problema: string;
    exemplo_melhor: string;
}

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
    analiseDetalhada?: AnaliseItem[];
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
    const [selectedAnalise, setSelectedAnalise] = useState<number | null>(null);

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

    const handleDownload = () => {
        const cenario = relatorio.cenario;
        const score = relatorio.scoreGeral;
        const aprovado = relatorio.aprovado ? 'Aprovado' : 'Reprovado';
        const data = new Date().toLocaleDateString('pt-BR');

        const transcricao = relatorio.transcricaoCompleta.map(msg =>
            `<div style="margin-bottom:12px;padding:10px 14px;border-radius:8px;background:${msg.role === 'Você' ? '#e0f4ff' : '#f5f0ff'};border-left:3px solid ${msg.role === 'Você' ? '#0099cc' : '#7c3aed'}">
                <strong style="font-size:12px;color:${msg.role === 'Você' ? '#0077aa' : '#5b21b6'}">${msg.role}</strong>
                <p style="margin:4px 0 0;font-size:14px;color:#222">${msg.content}</p>
            </div>`
        ).join('');

        const analise = (relatorio.analiseDetalhada || []).map((item, i) =>
            `<div style="margin-bottom:16px;padding:14px;border-radius:8px;border:1px solid #fca5a5;background:#fff5f5">
                <p style="font-size:12px;color:#888;margin:0 0 6px">MOMENTO ${i + 1}</p>
                <blockquote style="border-left:3px solid #f87171;padding-left:10px;margin:0 0 8px;font-style:italic;color:#555">"${item.frase_usuario}"</blockquote>
                <p style="margin:0 0 6px"><strong style="color:#dc2626">⚠ Problema:</strong> <span style="color:#444">${item.problema}</span></p>
                <p style="margin:0"><strong style="color:#16a34a">✓ Poderia ter dito:</strong> <span style="color:#444">${item.exemplo_melhor}</span></p>
            </div>`
        ).join('');

        const sugestoes = relatorio.sugestoes.map((s, i) =>
            `<li style="margin-bottom:8px;color:#333">${s}</li>`
        ).join('');

        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Relatório PharmaRoleplay — ${cenario}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 24px; color: #222; background: #fff; }
  h1 { font-size: 24px; color: #1a1a2e; margin-bottom: 4px; }
  .meta { font-size: 13px; color: #666; margin-bottom: 24px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-left: 8px; }
  .aprovado { background: #dcfce7; color: #16a34a; }
  .reprovado { background: #fee2e2; color: #dc2626; }
  .score-box { background: linear-gradient(135deg, #e0f4ff, #f0e7ff); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; text-align: center; }
  .score-num { font-size: 56px; font-weight: 900; color: #1a1a2e; line-height: 1; }
  .score-label { font-size: 14px; color: #888; margin-top: 4px; }
  h2 { font-size: 17px; color: #1a1a2e; margin: 28px 0 12px; border-bottom: 2px solid #eee; padding-bottom: 6px; }
  .bar-row { margin-bottom: 10px; }
  .bar-label { display: flex; justify-content: space-between; font-size: 13px; color: #555; margin-bottom: 3px; }
  .bar { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  .stat { text-align: center; padding: 12px; border-radius: 8px; background: #f9fafb; border: 1px solid #e5e7eb; }
  .stat-val { font-size: 22px; font-weight: 800; color: #1a1a2e; }
  .stat-label { font-size: 11px; color: #888; margin-top: 2px; }
  ul { padding-left: 20px; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<h1>Relatório de Treinamento <span class="badge ${relatorio.aprovado ? 'aprovado' : 'reprovado'}">${aprovado}</span></h1>
<div class="meta">Cenário: <strong>${cenario}</strong> &nbsp;|&nbsp; Data: ${data} &nbsp;|&nbsp; ID: ${sessaoId}</div>

<div class="score-box">
  <div class="score-num">${score}</div>
  <div class="score-label">Score Geral / 100</div>
</div>

<div class="stats">
  <div class="stat"><div class="stat-val">${formatarTempo(relatorio.resumo.tempoSessao)}</div><div class="stat-label">Tempo Total</div></div>
  <div class="stat"><div class="stat-val">${relatorio.resumo.mensagensUsuario}</div><div class="stat-label">Turnos</div></div>
  <div class="stat"><div class="stat-val">${relatorio.resumo.palavrasFaladas}</div><div class="stat-label">Palavras</div></div>
  <div class="stat"><div class="stat-val">${relatorio.resumo.feedbacksPositivos}</div><div class="stat-label">Acertos</div></div>
</div>

<h2>Desempenho por Categoria</h2>
${categorias.map(c => `
<div class="bar-row">
  <div class="bar-label"><span>${c.nome}</span><span>${c.score}/100</span></div>
  <div class="bar"><div class="bar-fill" style="width:${c.score}%;background:${c.score >= 80 ? '#22c55e' : c.score >= 60 ? '#3b82f6' : '#f59e0b'}"></div></div>
</div>`).join('')}

${analise ? `<h2>Análise Detalhada — Momentos para Melhorar</h2>${analise}` : ''}

<h2>Sugestões de Melhoria</h2>
<ul>${sugestoes}</ul>

<h2>Transcrição Completa</h2>
${transcricao}
</body>
</html>`;

        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(html);
        win.document.close();
        setTimeout(() => win.print(), 400);
    };

    // Check if a user message matches an analysis item
    const getAnaliseIndexForMessage = (content: string): number => {
        if (!relatorio.analiseDetalhada) return -1;
        return relatorio.analiseDetalhada.findIndex(item =>
            content.toLowerCase().includes(item.frase_usuario.toLowerCase().slice(0, 30))
        );
    };

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

            {/* Análise Detalhada com exemplos */}
            {relatorio.analiseDetalhada && relatorio.analiseDetalhada.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="glass-card p-6 mb-8 rounded-xl"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <h2 className="text-xl font-semibold text-white">Análise Detalhada — Clique para ver</h2>
                    </div>
                    <p className="text-white/40 text-sm mb-5">
                        Clique em um momento para ver o que poderia ter sido melhor. As frases correspondentes ficam destacadas na transcrição abaixo.
                    </p>
                    <div className="space-y-3">
                        {relatorio.analiseDetalhada.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                onClick={() => setSelectedAnalise(selectedAnalise === i ? null : i)}
                                className={`rounded-xl border cursor-pointer transition-all ${
                                    selectedAnalise === i
                                        ? 'border-orange-500/50 bg-orange-500/10'
                                        : 'border-white/10 bg-white/5 hover:border-orange-500/30 hover:bg-orange-500/5'
                                }`}
                            >
                                {/* Header sempre visível */}
                                <div className="flex items-start gap-3 p-4">
                                    <span className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-orange-300 text-xs font-bold">{i + 1}</span>
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/50 text-xs mb-1">Você disse:</p>
                                        <p className="text-white/80 text-sm italic truncate">
                                            &ldquo;{item.frase_usuario}&rdquo;
                                        </p>
                                    </div>
                                    {selectedAnalise === i
                                        ? <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0 mt-1" />
                                        : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0 mt-1" />
                                    }
                                </div>

                                {/* Detalhe expandido */}
                                {selectedAnalise === i && (
                                    <div className="px-4 pb-4 space-y-3">
                                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">Problema</span>
                                            </div>
                                            <p className="text-white/80 text-sm">{item.problema}</p>
                                        </div>
                                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <Lightbulb className="w-3.5 h-3.5 text-green-400" />
                                                <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">Poderia ter dito</span>
                                            </div>
                                            <p className="text-white/80 text-sm">{item.exemplo_melhor}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

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

            {/* Transcrição completa com highlighting */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 mb-8 rounded-xl"
            >
                <h2 className="text-xl font-semibold text-white mb-4">Transcrição Completa</h2>
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                    {relatorio.transcricaoCompleta.map((msg, i) => {
                        const analiseIdx = msg.role === 'Você' ? getAnaliseIndexForMessage(msg.content) : -1;
                        const isHighlighted = analiseIdx !== -1 && selectedAnalise === analiseIdx;
                        const hasAnalise = analiseIdx !== -1;

                        return (
                            <div
                                key={i}
                                onClick={() => hasAnalise ? setSelectedAnalise(analiseIdx) : undefined}
                                className={`p-3 rounded-lg transition-all ${msg.role === 'Você'
                                        ? `bg-[#00D9FF]/10 ml-8 border-l-2 ${isHighlighted ? 'border-orange-400 bg-orange-500/15 ring-1 ring-orange-400/30' : 'border-[#00D9FF]'}`
                                        : 'bg-purple-500/10 mr-8 border-l-2 border-purple-500'
                                    } ${hasAnalise ? 'cursor-pointer hover:bg-orange-500/10' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <p className={`text-xs ${msg.role === 'Você' ? 'text-[#00D9FF]' : 'text-purple-300'}`}>
                                        {msg.role}
                                    </p>
                                    {hasAnalise && (
                                        <span className="flex items-center gap-1 text-xs text-orange-400">
                                            <AlertTriangle className="w-3 h-3" />
                                            ver análise
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/70 text-sm">{msg.content}</p>
                            </div>
                        );
                    })}
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

                <button
                    onClick={handleDownload}
                    className="btn-outline px-6 py-3 rounded-xl inline-flex items-center gap-2"
                >
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
