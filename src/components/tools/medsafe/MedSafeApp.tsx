'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Upload,
    FileText,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Loader2,
    Sparkles,
    BarChart3
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════

interface Violacao {
    id: number;
    tipo: 'grave' | 'moderada' | 'leve';
    texto: string;
    trecho: string;
    artigo: string;
    sugestao: string;
}

interface ResultadoAnalise {
    score: number;
    violacoes: Violacao[];
    resumo: string;
    tempoAnalise: number;
}

// ═══════════════════════════════════════════════════════════════════════
// DADOS MOCK (será substituído pela API real)
// ═══════════════════════════════════════════════════════════════════════

function gerarAnaliseSimulada(texto: string): ResultadoAnalise {
    const violacoes: Violacao[] = [];
    let id = 1;

    // Detecção de claims suspeitos
    const claimPatterns = [
        { regex: /cur[ao]/i, tipo: 'grave' as const, artigo: 'Art. 3º, §1º', msg: 'Claim de cura é proibido pela RDC 96/2008', sugestao: 'Substitua por "auxilia no tratamento" ou "contribui para o manejo"' },
        { regex: /100%\s*(efic|segur|garanti)/i, tipo: 'grave' as const, artigo: 'Art. 4º, III', msg: 'Garantia absoluta de eficácia/segurança não é permitida', sugestao: 'Use dados com IC95% e referencie estudo clínico específico' },
        { regex: /sem\s*(efeito|risco|contra)/i, tipo: 'moderada' as const, artigo: 'Art. 4º, V', msg: 'Omissão de riscos/efeitos adversos pode induzir a erro', sugestao: 'Inclua referência ao perfil de segurança e bula' },
        { regex: /melhor\s*(que|do que)/i, tipo: 'moderada' as const, artigo: 'Art. 5º', msg: 'Comparação com concorrente requer estudo head-to-head publicado', sugestao: 'Cite o estudo comparativo com DOI e PMID' },
        { regex: /revolucion|inovad|únic/i, tipo: 'leve' as const, artigo: 'Art. 3º, §2º', msg: 'Linguagem superlativa pode ser considerada misleading', sugestao: 'Prefira termos como "diferenciado" ou "com novo mecanismo de ação"' },
        { regex: /natural|orgânic/i, tipo: 'leve' as const, artigo: 'Art. 7º', msg: 'Claim "natural" pode dar falsa sensação de segurança', sugestao: 'Especifique a composição e origem do ingrediente ativo' },
    ];

    const linhas = texto.split('\n').filter(l => l.trim());

    for (const linha of linhas) {
        for (const pattern of claimPatterns) {
            if (pattern.regex.test(linha)) {
                violacoes.push({
                    id: id++,
                    tipo: pattern.tipo,
                    texto: pattern.msg,
                    trecho: linha.trim().substring(0, 80) + (linha.length > 80 ? '...' : ''),
                    artigo: pattern.artigo,
                    sugestao: pattern.sugestao
                });
            }
        }
    }

    // Calcular score
    const penalidades = violacoes.reduce((acc, v) => {
        if (v.tipo === 'grave') return acc + 25;
        if (v.tipo === 'moderada') return acc + 12;
        return acc + 5;
    }, 0);

    const score = Math.max(0, Math.min(100, 100 - penalidades));

    return {
        score,
        violacoes,
        resumo: violacoes.length === 0
            ? 'Material analisado não apresenta violações identificáveis à RDC 96/2008. Recomenda-se revisão final com equipe jurídica.'
            : `Identificadas ${violacoes.length} possíveis violações à RDC 96/2008 ANVISA. ${violacoes.filter(v => v.tipo === 'grave').length} graves, ${violacoes.filter(v => v.tipo === 'moderada').length} moderadas, ${violacoes.filter(v => v.tipo === 'leve').length} leves.`,
        tempoAnalise: 1.2 + Math.random() * 2
    };
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

export default function MedSafeApp() {
    const [texto, setTexto] = useState('');
    const [analisando, setAnalisando] = useState(false);
    const [resultado, setResultado] = useState<ResultadoAnalise | null>(null);
    const [arquivoNome, setArquivoNome] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const analisar = async () => {
        if (!texto.trim()) return;
        setAnalisando(true);
        setResultado(null);

        // Simular tempo de processamento
        await new Promise(r => setTimeout(r, 2000 + Math.random() * 1500));

        const res = gerarAnaliseSimulada(texto);
        setResultado(res);
        setAnalisando(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setArquivoNome(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            setTexto(event.target?.result as string);
        };
        reader.readAsText(file);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500/20 border-green-500/30';
        if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
        return 'bg-red-500/20 border-red-500/30';
    };

    const getTipoConfig = (tipo: string) => {
        switch (tipo) {
            case 'grave': return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Grave' };
            case 'moderada': return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Moderada' };
            default: return { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Leve' };
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Input Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Text Area */}
                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <FileText size={16} className="text-[#00D9FF]" />
                            Material para Análise
                        </h3>
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt,.md,.csv"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors inline-flex items-center gap-1.5"
                            >
                                <Upload size={12} />
                                Upload
                            </button>
                        </div>
                    </div>

                    {arquivoNome && (
                        <div className="mb-3 text-xs text-[#00D9FF] bg-[#00D9FF]/10 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                            <FileText size={12} />
                            {arquivoNome}
                        </div>
                    )}

                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Cole aqui o texto do material promocional para análise de conformidade com a RDC 96/2008...

Exemplo:
'Nosso medicamento é a cura definitiva para diabetes. 100% eficaz e sem efeitos colaterais. Melhor que qualquer concorrente do mercado.'"
                        className="w-full h-64 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#00D9FF]/50 resize-none"
                    />

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-white/30 text-xs">{texto.length} caracteres</span>
                        <button
                            onClick={analisar}
                            disabled={!texto.trim() || analisando}
                            className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {analisando ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Analisando...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    Analisar Conformidade
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Score & Summary */}
                <div className="glass-card rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 size={16} className="text-[#00D9FF]" />
                        Resultado da Análise
                    </h3>

                    {analisando && (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-[#00D9FF]/20 rounded-full" />
                                <div className="absolute inset-0 w-16 h-16 border-4 border-[#00D9FF] rounded-full border-t-transparent animate-spin" />
                            </div>
                            <div className="text-center">
                                <p className="text-white text-sm font-medium">Analisando documento...</p>
                                <p className="text-white/40 text-xs mt-1">Multi-pass analysis com Gemini 3</p>
                            </div>
                        </div>
                    )}

                    {!analisando && !resultado && (
                        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                            <Shield size={40} className="text-white/10" />
                            <p className="text-white/30 text-sm">Cole ou faça upload de um material promocional para começar</p>
                            <p className="text-white/15 text-xs">Análise baseada na RDC 96/2008 ANVISA</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {resultado && !analisando && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Score Circle */}
                                <div className="flex items-center gap-6">
                                    <div className={`w-24 h-24 rounded-full border-4 ${getScoreBg(resultado.score)} flex items-center justify-center`}>
                                        <span className={`text-3xl font-bold ${getScoreColor(resultado.score)}`}>
                                            {resultado.score}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium mb-1">Score de Conformidade</p>
                                        <p className="text-white/50 text-sm">{resultado.resumo}</p>
                                        <p className="text-white/30 text-xs mt-2">
                                            Análise em {resultado.tempoAnalise.toFixed(1)}s • RDC 96/2008 ANVISA
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-red-500/10 rounded-lg p-2.5 text-center border border-red-500/10">
                                        <p className="text-red-400 text-lg font-bold">{resultado.violacoes.filter(v => v.tipo === 'grave').length}</p>
                                        <p className="text-red-400/60 text-xs">Graves</p>
                                    </div>
                                    <div className="bg-yellow-500/10 rounded-lg p-2.5 text-center border border-yellow-500/10">
                                        <p className="text-yellow-400 text-lg font-bold">{resultado.violacoes.filter(v => v.tipo === 'moderada').length}</p>
                                        <p className="text-yellow-400/60 text-xs">Moderadas</p>
                                    </div>
                                    <div className="bg-blue-500/10 rounded-lg p-2.5 text-center border border-blue-500/10">
                                        <p className="text-blue-400 text-lg font-bold">{resultado.violacoes.filter(v => v.tipo === 'leve').length}</p>
                                        <p className="text-blue-400/60 text-xs">Leves</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Violations List */}
            <AnimatePresence>
                {resultado && resultado.violacoes.length > 0 && !analisando && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-xl p-5"
                    >
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-yellow-400" />
                            Violações Identificadas ({resultado.violacoes.length})
                        </h3>

                        <div className="space-y-3">
                            {resultado.violacoes.map((v, i) => {
                                const config = getTipoConfig(v.tipo);
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={v.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`p-4 rounded-lg border ${config.bg}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon size={18} className={`${config.color} flex-shrink-0 mt-0.5`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                                        {config.label}
                                                    </span>
                                                    <span className="text-white/30 text-xs">{v.artigo}</span>
                                                </div>
                                                <p className="text-white text-sm mb-2">{v.texto}</p>
                                                <div className="bg-white/5 rounded px-3 py-2 mb-2">
                                                    <p className="text-white/40 text-xs italic">&quot;{v.trecho}&quot;</p>
                                                </div>
                                                <div className="flex items-start gap-1.5">
                                                    <CheckCircle size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-green-400/80 text-xs">{v.sugestao}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Perfect score */}
            <AnimatePresence>
                {resultado && resultado.violacoes.length === 0 && !analisando && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-xl p-8 text-center"
                    >
                        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Material Conforme</h3>
                        <p className="text-white/50 text-sm">Nenhuma violação à RDC 96/2008 foi identificada. Recomenda-se revisão final com equipe regulatória.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
