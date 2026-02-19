"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
    FileText,
    Loader2,
    ShieldCheck,
    Sparkles,
    Upload,
} from "lucide-react";

interface Violacao {
    id: number;
    tipo: "grave" | "moderada" | "leve";
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

type PainelTab = "visao" | "documentos";

function gerarFallback(texto: string): ResultadoAnalise {
    const violacoes: Violacao[] = [];
    let idx = 1;

    const regras = [
        {
            regex: /cura|cura definitiva/i,
            tipo: "grave" as const,
            artigo: "Art. 3º",
            texto: "Claim de cura não é permitido.",
        },
        {
            regex: /100%\s*(efic|segur|garant)/i,
            tipo: "grave" as const,
            artigo: "Art. 4º, III",
            texto: "Garantia absoluta de eficácia/segurança é proibida.",
        },
        {
            regex: /sem efeitos|sem risco/i,
            tipo: "moderada" as const,
            artigo: "Art. 4º, V",
            texto: "Omissão de risco pode induzir erro.",
        },
        {
            regex: /melhor que|superior a/i,
            tipo: "moderada" as const,
            artigo: "Art. 5º",
            texto: "Comparação com concorrente exige base técnica robusta.",
        },
    ];

    for (const linha of texto.split("\n")) {
        for (const regra of regras) {
            if (regra.regex.test(linha)) {
                violacoes.push({
                    id: idx++,
                    tipo: regra.tipo,
                    texto: regra.texto,
                    trecho: linha.slice(0, 160),
                    artigo: regra.artigo,
                    sugestao: "Revisar o claim com base na bula aprovada e referências científicas.",
                });
            }
        }
    }

    const score = Math.max(
        0,
        100 - violacoes.reduce((acc, v) => acc + (v.tipo === "grave" ? 25 : v.tipo === "moderada" ? 10 : 5), 0)
    );

    return {
        score,
        violacoes,
        resumo: violacoes.length
            ? `Identificadas ${violacoes.length} possíveis violações com prioridade de revisão.`
            : "Nenhuma violação evidente detectada no texto informado.",
        tempoAnalise: 1.6,
    };
}

export default function MedSafeApp() {
    const [tab, setTab] = useState<PainelTab>("visao");
    const [texto, setTexto] = useState("");
    const [arquivoNome, setArquivoNome] = useState<string | null>(null);
    const [analisando, setAnalisando] = useState(false);
    const [resultado, setResultado] = useState<ResultadoAnalise | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resumo = useMemo(() => {
        if (!resultado) return { graves: 0, moderadas: 0, leves: 0 };
        return {
            graves: resultado.violacoes.filter((v) => v.tipo === "grave").length,
            moderadas: resultado.violacoes.filter((v) => v.tipo === "moderada").length,
            leves: resultado.violacoes.filter((v) => v.tipo === "leve").length,
        };
    }, [resultado]);

    const linhasComMarcacao = useMemo(() => {
        const linhas = texto.split("\n").filter((linha) => linha.trim().length > 0).slice(0, 8);
        if (!resultado || resultado.violacoes.length === 0) {
            return linhas.map((linha) => ({ linha, tipo: null as null | Violacao["tipo"] }));
        }

        return linhas.map((linha) => {
            const match = resultado.violacoes.find((violacao) =>
                linha.toLowerCase().includes(violacao.trecho.toLowerCase().slice(0, 24))
            );
            return { linha, tipo: match?.tipo || null };
        });
    }, [texto, resultado]);

    const enviarParaAnalise = async () => {
        if (!texto.trim()) return;
        setAnalisando(true);
        setResultado(null);

        try {
            const started = Date.now();
            const response = await fetch("/api/medsafe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto }),
            });

            if (!response.ok) throw new Error("API indisponível");
            const data = (await response.json()) as ResultadoAnalise;
            setResultado({
                ...data,
                tempoAnalise: Number(((Date.now() - started) / 1000).toFixed(1)),
            });
        } catch {
            setResultado(gerarFallback(texto));
        } finally {
            setAnalisando(false);
        }
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setArquivoNome(file.name);
        const reader = new FileReader();
        reader.onload = (e) => setTexto((e.target?.result as string) || "");
        reader.readAsText(file);
    };

    const classeRisco = (tipo: Violacao["tipo"]) => {
        if (tipo === "grave") return "border-red-500/30 bg-red-500/8 text-red-300";
        if (tipo === "moderada") return "border-yellow-500/30 bg-yellow-500/8 text-yellow-300";
        return "border-cyan-500/30 bg-cyan-500/8 text-cyan-300";
    };

    return (
        <div className="rounded-[28px] overflow-hidden border border-white/[0.12] bg-[#060D16] shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
            <header className="h-16 border-b border-white/10 px-5 md:px-6 flex items-center justify-between bg-[#0A1628]/55">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white leading-tight">MedSafe Workspace</p>
                        <p className="text-[11px] text-white/45 leading-tight">Compliance regulatório em tempo real</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { id: "visao", label: "Visão Geral" },
                        { id: "documentos", label: "Documentos" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setTab(item.id as PainelTab)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs border transition-colors ${
                                tab === item.id
                                    ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-200"
                                    : "border-white/10 bg-white/[0.02] text-white/55 hover:text-white/80"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </header>

            <div className="grid lg:grid-cols-[1.18fr_0.82fr] gap-0 min-h-[760px]">
                <section className="border-r border-white/10 p-5 md:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <FileText size={15} className="text-emerald-300" />
                            Material para análise
                        </h3>

                        <div className="flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt,.md,.csv"
                                onChange={handleUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:border-white/25"
                            >
                                <Upload size={13} />
                                Upload
                            </button>
                        </div>
                    </div>

                    {arquivoNome && (
                        <p className="mb-3 inline-flex items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">
                            Arquivo: {arquivoNome}
                        </p>
                    )}

                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Cole aqui o conteúdo promocional para análise de conformidade com a RDC 96/2008..."
                        className="h-[320px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-emerald-400/60 focus:outline-none"
                    />

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-white/40">{texto.length} caracteres</span>
                        <button
                            type="button"
                            onClick={enviarParaAnalise}
                            disabled={!texto.trim() || analisando}
                            className="btn-primary !px-5 !py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-40"
                        >
                            {analisando ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Analisar Conformidade
                        </button>
                    </div>

                    <div className="mt-6 rounded-xl border border-white/10 bg-[#0B1422] p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">Preview do documento</p>
                            <p className="text-[11px] text-white/35">Análise contextual</p>
                        </div>

                        {linhasComMarcacao.length === 0 && (
                            <p className="text-sm text-white/35">As linhas analisadas aparecerão aqui após inserir conteúdo.</p>
                        )}

                        <div className="space-y-2 max-h-[210px] overflow-y-auto pr-1">
                            {linhasComMarcacao.map((item, idx) => (
                                <div
                                    key={`${item.linha}-${idx}`}
                                    className={`rounded-lg border px-3 py-2 text-xs ${
                                        item.tipo
                                            ? classeRisco(item.tipo)
                                            : "border-white/10 bg-white/[0.02] text-white/65"
                                    }`}
                                >
                                    {item.linha}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="p-5 md:p-6 bg-[#07111D]">
                    <h3 className="mb-4 text-sm font-semibold text-white">Resultado da análise</h3>

                    {analisando && (
                        <div className="h-[420px] rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 text-white/60">
                            <Loader2 className="animate-spin" />
                            Processando material promocional...
                        </div>
                    )}

                    {!analisando && !resultado && (
                        <div className="h-[420px] rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 text-center text-white/35 px-8">
                            <ShieldCheck size={32} />
                            <p>Inicie uma análise para visualizar score, violações e ações sugeridas.</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {resultado && !analisando && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-24 w-24 rounded-full grid place-items-center text-2xl font-bold text-emerald-200 border border-white/15"
                                            style={{
                                                background: `conic-gradient(#10B981 ${resultado.score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                                            }}
                                        >
                                            <span className="h-[74px] w-[74px] rounded-full bg-[#07111D] grid place-items-center">
                                                {resultado.score}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white">Score de conformidade</p>
                                            <p className="text-xs text-white/55 mt-1">{resultado.resumo}</p>
                                            <p className="text-[11px] text-white/35 mt-2">
                                                Tempo: {resultado.tempoAnalise.toFixed(1)}s
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-lg border border-red-500/25 bg-red-500/10 py-2">
                                        <p className="text-lg font-semibold text-red-300">{resumo.graves}</p>
                                        <p className="text-[11px] text-red-200/70">Graves</p>
                                    </div>
                                    <div className="rounded-lg border border-yellow-500/25 bg-yellow-500/10 py-2">
                                        <p className="text-lg font-semibold text-yellow-300">{resumo.moderadas}</p>
                                        <p className="text-[11px] text-yellow-200/70">Moderadas</p>
                                    </div>
                                    <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 py-2">
                                        <p className="text-lg font-semibold text-cyan-300">{resumo.leves}</p>
                                        <p className="text-[11px] text-cyan-200/70">Leves</p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/50">
                                        Violações identificadas
                                    </p>

                                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                                        {resultado.violacoes.length === 0 && (
                                            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-200 flex items-center gap-2">
                                                <CheckCircle2 size={15} />
                                                Nenhuma violação relevante detectada.
                                            </div>
                                        )}

                                        {resultado.violacoes.map((violacao) => (
                                            <div
                                                key={violacao.id}
                                                className={`rounded-lg border p-3 ${classeRisco(violacao.tipo)}`}
                                            >
                                                <div className="mb-1 flex items-center justify-between gap-2">
                                                    <span className="text-[11px] uppercase font-semibold">{violacao.tipo}</span>
                                                    <span className="text-[10px] text-white/55">{violacao.artigo}</span>
                                                </div>
                                                <p className="text-xs text-white/80">{violacao.texto}</p>
                                                <p className="mt-1 text-[11px] text-white/55">
                                                    Sugestão: {violacao.sugestao}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/50">
                                        Regras avaliadas
                                    </p>
                                    <div className="space-y-1.5 text-xs text-white/65">
                                        <p>• Art. 3º - vedação de promessas absolutas</p>
                                        <p>• Art. 4º - segurança, eficácia e riscos</p>
                                        <p>• Art. 5º - comparações com concorrentes</p>
                                        <p>• Art. 8º - transparência de contraindicações</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>
            </div>
        </div>
    );
}
