"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, ScanText, ShieldCheck, Sparkles, Upload } from "lucide-react";

type RiskLevel = "grave" | "moderada" | "leve";
type WorkspaceTab = "overview" | "documents";

interface Violation {
    id: number;
    tipo: RiskLevel;
    texto: string;
    trecho: string;
    artigo: string;
    sugestao: string;
}

interface AnalysisResult {
    score: number;
    resumo: string;
    tempoAnalise: number;
    violacoes: Violation[];
    retrievalCount?: number;
    analysisId?: string | null;
    referencias?: Array<{
        docId: string;
        title: string;
        trecho: string;
        uri?: string;
    }>;
}

const TEXT_MIME_TYPES = new Set(["text/plain", "text/markdown", "text/csv", "application/csv"]);
const OCR_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
]);

function riskClass(level: RiskLevel) {
    if (level === "grave") return "text-red-200 border-red-500/35 bg-red-500/10";
    if (level === "moderada") return "text-amber-200 border-amber-500/35 bg-amber-500/10";
    return "text-cyan-200 border-cyan-500/35 bg-cyan-500/10";
}

export default function MedSafeApp() {
    const [tab, setTab] = useState<WorkspaceTab>("overview");
    const [text, setText] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const summary = useMemo(() => {
        if (!result) return { grave: 0, moderada: 0, leve: 0 };
        return {
            grave: result.violacoes.filter((item) => item.tipo === "grave").length,
            moderada: result.violacoes.filter((item) => item.tipo === "moderada").length,
            leve: result.violacoes.filter((item) => item.tipo === "leve").length,
        };
    }, [result]);

    const previewLines = useMemo(() => {
        const source = text.trim().length
            ? text
            : "Nosso medicamento é 100% eficaz e sem efeitos colaterais.\nMelhor que qualquer concorrente.\nResultados garantidos em todos os pacientes.";
        const lines = source.split("\n").filter(Boolean).slice(0, 9);
        return lines.map((line, index) => {
            const matched = result?.violacoes.find((item) => line.toLowerCase().includes(item.trecho.toLowerCase().slice(0, 20)));
            return { id: index, line, tipo: matched?.tipo ?? null };
        });
    }, [text, result]);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        // Reset input value so same file can be re-selected
        event.target.value = "";
        setFileName(file.name);
        setError(null);

        const isText = TEXT_MIME_TYPES.has(file.type) || /\.(txt|md|csv)$/i.test(file.name);
        const isOcr = OCR_MIME_TYPES.has(file.type) || /\.(pdf|jpe?g|png|webp|gif|bmp|tiff?)$/i.test(file.name);

        if (isText) {
            const reader = new FileReader();
            reader.onload = () => setText(String(reader.result || ""));
            reader.readAsText(file);
            return;
        }

        if (isOcr) {
            setIsExtracting(true);
            setText("");
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    // Strip the "data:mimeType;base64," prefix
                    const dataUrl = reader.result as string;
                    const base64 = dataUrl.split(",")[1];
                    const mimeType = file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg");

                    const response = await fetch("/api/medsafe/extract-text", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fileBase64: base64, mimeType }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        setError(data.error || "Falha na leitura do documento");
                    } else {
                        setText(data.text);
                    }
                } catch {
                    setError("Falha ao processar o arquivo");
                } finally {
                    setIsExtracting(false);
                }
            };
            reader.readAsDataURL(file);
            return;
        }

        setError("Formato não suportado. Use PDF, imagem (JPG, PNG, WEBP) ou texto.");
    };

    const runAnalysis = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const started = Date.now();
            const response = await fetch("/api/medsafe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: text }),
            });
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                const msg = payload?.details
                    ? `${payload.error}: ${payload.details}`
                    : payload?.error || "Falha na análise RAG";
                throw new Error(msg);
            }
            const data = (await response.json()) as AnalysisResult;
            setResult({
                ...data,
                tempoAnalise: Number(((Date.now() - started) / 1000).toFixed(1)),
            });
        } catch (analysisError) {
            const message = analysisError instanceof Error ? analysisError.message : "Falha na análise RAG";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const score = result?.score ?? 72;

    return (
        <div className="rounded-[28px] overflow-hidden border border-white/[0.12] bg-[radial-gradient(circle_at_8%_0%,rgba(16,185,129,0.18),transparent_28%),#07111D] shadow-[0_30px_95px_rgba(0,0,0,0.55)]">
            <header className="h-16 border-b border-white/10 px-5 md:px-6 flex items-center justify-between bg-[#081321]/85">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/35 text-emerald-200 grid place-items-center">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white leading-tight">MedSafe Workspace</p>
                        <p className="text-[11px] text-white/45 leading-tight">Compliance regulatório em tempo real</p>
                    </div>
                </div>
                <nav className="hidden md:flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setTab("overview")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs border ${tab === "overview" ? "border-emerald-400/45 bg-emerald-500/15 text-emerald-200" : "border-white/10 text-white/60"}`}
                    >
                        Visão Geral
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("documents")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs border ${tab === "documents" ? "border-emerald-400/45 bg-emerald-500/15 text-emerald-200" : "border-white/10 text-white/60"}`}
                    >
                        Documentos
                    </button>
                </nav>
            </header>

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] min-h-[780px]">
                <section className="p-5 md:p-6 border-r border-white/10">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <FileText size={15} className="text-emerald-300" />
                            Análise de Documento
                        </h3>
                        <div className="flex items-center gap-2">
                            {/* Hidden file input — accepts text, PDF and images */}
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".txt,.md,.csv,.pdf,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif"
                                onChange={handleUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                disabled={isExtracting}
                                className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white disabled:opacity-50"
                            >
                                {isExtracting ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                                {isExtracting ? "Lendo..." : "Upload"}
                            </button>
                        </div>
                    </div>

                    {/* File badge */}
                    {fileName ? (
                        <p className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">
                            <ScanText size={12} />
                            {fileName}
                            {isExtracting && <span className="text-emerald-300/70">— extraindo texto...</span>}
                        </p>
                    ) : null}

                    {/* Supported formats hint */}
                    <p className="mb-2 text-[11px] text-white/25">
                        Formatos: PDF, JPG, PNG, WEBP (OCR automático) · TXT, MD, CSV
                    </p>

                    <textarea
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder={isExtracting
                            ? "Extraindo texto do documento via IA..."
                            : "Cole aqui o texto do material promocional ou faça upload de um PDF/imagem para análise com a RDC 96/2008..."}
                        disabled={isExtracting}
                        className={`w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none disabled:opacity-50 ${
                            tab === "documents" ? "h-[360px]" : "h-[200px]"
                        }`}
                    />

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-white/40">{text.length} caracteres</span>
                        <button
                            type="button"
                            onClick={runAnalysis}
                            disabled={!text.trim() || isLoading || isExtracting}
                            className="btn-primary !px-5 !py-2.5 !text-sm inline-flex items-center gap-2 disabled:opacity-45"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={15} />}
                            Analisar Conformidade
                        </button>
                    </div>

                    {error ? (
                        <div className="mt-3 rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                            {error}
                        </div>
                    ) : null}

                    <div className="mt-5 rounded-xl border border-white/10 bg-[#0A1525] p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs text-white/55">marketing brochure.pdf</p>
                            <p className="text-[11px] text-white/35">Análise Documento</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-[#F8FAFC] p-4">
                            <p className="text-[13px] text-[#10B981] font-semibold mb-3">Marketing</p>
                            <div className="space-y-1.5">
                                {previewLines.map((item) => (
                                    <p
                                        key={item.id}
                                        className={`rounded px-2 py-1 text-[11px] ${
                                            item.tipo === "grave"
                                                ? "bg-red-400/45 text-slate-900"
                                                : item.tipo === "moderada"
                                                    ? "bg-amber-300/65 text-slate-900"
                                                    : item.tipo === "leve"
                                                        ? "bg-cyan-300/70 text-slate-900"
                                                        : "text-slate-700"
                                        }`}
                                    >
                                        {item.line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="p-5 md:p-6 bg-[#07111D]">
                    <h3 className="mb-4 text-sm font-semibold text-white">Pontuação de Conformidade</h3>

                    {isLoading ? (
                        <div className="h-[420px] rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 text-white/60">
                            <Loader2 className="animate-spin" />
                            Processando material promocional...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="h-28 w-28 rounded-full grid place-items-center border border-white/15 flex-shrink-0"
                                        style={{ background: `conic-gradient(#10B981 ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
                                    >
                                        <span className="h-[86px] w-[86px] rounded-full bg-[#07111D] grid place-items-center text-4xl font-bold text-emerald-200">
                                            {score}%
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white">Pontuação Geral</p>
                                        <p className="text-xs text-white/55 mt-1">{result?.resumo ?? "A análise aparecerá após envio do material."}</p>
                                        <p className="text-[11px] text-white/35 mt-2">Tempo: {(result?.tempoAnalise ?? 0).toFixed(1)}s</p>
                                        {result?.analysisId ? (
                                            <p className="text-[11px] text-emerald-300/90 mt-1">ID: {result.analysisId}</p>
                                        ) : null}
                                        {typeof result?.retrievalCount === "number" ? (
                                            <p className="text-[11px] text-cyan-300/90 mt-1">Contextos RAG: {result.retrievalCount}</p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-lg border border-red-500/25 bg-red-500/10 py-2"><p className="text-lg font-semibold text-red-200">{summary.grave}</p><p className="text-[11px] text-red-200/70">Graves</p></div>
                                <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 py-2"><p className="text-lg font-semibold text-amber-200">{summary.moderada}</p><p className="text-[11px] text-amber-200/70">Moderadas</p></div>
                                <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 py-2"><p className="text-lg font-semibold text-cyan-200">{summary.leve}</p><p className="text-[11px] text-cyan-200/70">Leves</p></div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                                    Violações Regulatórias (RDC 96/2008)
                                </p>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                    {result?.violacoes?.length ? (
                                        result.violacoes.map((item) => (
                                            <div key={item.id} className={`rounded-lg border p-3 ${riskClass(item.tipo)}`}>
                                                <div className="mb-1 flex items-center justify-between gap-2">
                                                    <span className="text-[11px] uppercase font-semibold">{item.tipo}</span>
                                                    <span className="text-[10px] text-white/60">{item.artigo}</span>
                                                </div>
                                                <p className="text-xs text-white/85">{item.texto}</p>
                                                <p className="mt-1 text-[11px] text-white/55">{item.sugestao}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-200 flex items-center gap-2">
                                            <CheckCircle2 size={15} />
                                            Nenhuma violação relevante detectada.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                                    Regras Avaliadas
                                </p>
                                <div className="space-y-1.5 text-xs text-white/70">
                                    <p>• Artigo 3º - alegações terapêuticas sem comprovação</p>
                                    <p>• Artigo 4º, III - promessa de eficácia/segurança absoluta</p>
                                    <p>• Artigo 12º - omissão de informações de segurança</p>
                                </div>
                            </div>

                            {result?.referencias?.length ? (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                                        Referências RAG
                                    </p>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                        {result.referencias.map((reference) => (
                                            <div key={`${reference.docId}-${reference.title}`} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                                                <p className="text-[11px] text-white/90">{reference.docId} • {reference.title}</p>
                                                <p className="text-[11px] text-white/55 line-clamp-2">{reference.trecho}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
