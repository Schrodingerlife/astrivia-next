"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Globe, Loader2, Search, ShieldAlert, Sparkles, Zap } from "lucide-react";

type Platform = "twitter" | "facebook" | "instagram" | "reddit" | "reclameaqui";
type Risk = "critical" | "high" | "medium" | "low";
type Sentiment = "negative" | "neutral" | "positive";
type ViewMode = "feed" | "heatmap" | "sentiment";

interface SocialPost {
    id: string;
    platform: Platform;
    author: string;
    content: string;
    risk: Risk;
    sentiment: Sentiment;
    event: string;
    createdAt: string;
}

const platformMeta: Record<Platform, { short: string; label: string; className: string }> = {
    twitter: { short: "X", label: "Twitter", className: "bg-black text-white border border-white/15" },
    facebook: { short: "f", label: "Facebook", className: "bg-[#1877F2] text-white border border-[#60A5FA]/50" },
    instagram: {
        short: "IG",
        label: "Instagram",
        className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white border border-[#E879F9]/40",
    },
    reddit: { short: "R", label: "Reddit", className: "bg-[#FF4500] text-white border border-[#FB923C]/45" },
    reclameaqui: { short: "RA", label: "Reclame Aqui", className: "bg-[#2563EB] text-white border border-[#60A5FA]/45" },
};

const riskMeta: Record<Risk, { label: string; color: string; gauge: number }> = {
    critical: { label: "Crítico", color: "text-red-300", gauge: 92 },
    high: { label: "Alto", color: "text-orange-300", gauge: 78 },
    medium: { label: "Médio", color: "text-cyan-300", gauge: 56 },
    low: { label: "Baixo", color: "text-emerald-300", gauge: 34 },
};

interface SocialVigilanteAppProps {
    embedded?: boolean;
}

function badge(platform: Platform) {
    const meta = platformMeta[platform];
    return <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-bold ${meta.className}`}>{meta.short}</span>;
}

function gaugeStyle(value: number) {
    return { background: `conic-gradient(#A855F7 ${Math.max(8, value)}%, rgba(255,255,255,0.1) 0)` };
}

function hoursAgo(timestamp: string) {
    const diff = Date.now() - new Date(timestamp).getTime();
    return `${Math.max(1, Math.round(diff / 3600000))} horas atrás`;
}

export default function SocialVigilanteApp({ embedded = false }: SocialVigilanteAppProps) {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [searchTerm, setSearchTerm] = useState("Ozempic");
    const [activeTerm, setActiveTerm] = useState("");
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("feed");
    const [processed, setProcessed] = useState(0);
    const [bars, setBars] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const highRisk = useMemo(() => posts.filter((post) => post.risk === "high" || post.risk === "critical").length, [posts]);
    const critical = useMemo(() => posts.filter((post) => post.risk === "critical").length, [posts]);
    const sentiment = useMemo(
        () =>
            posts.reduce(
                (acc, post) => {
                    acc[post.sentiment] += 1;
                    return acc;
                },
                { negative: 0, neutral: 0, positive: 0 }
            ),
        [posts]
    );
    const alerts = useMemo(() => posts.filter((post) => post.risk === "critical" || post.risk === "high").slice(0, 4), [posts]);
    const sources = useMemo(() => new Set(posts.map((post) => post.platform)).size, [posts]);
    const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

    const addPosts = useCallback((incoming: SocialPost[]) => {
        setPosts((prev) => [...incoming, ...prev].slice(0, 24));
        setProcessed((prev) => prev + incoming.length);
        setBars((prev) =>
            prev.map((value) => {
                const next = value + Math.floor((Math.random() - 0.45) * 20);
                return Math.max(24, Math.min(95, next));
            })
        );
    }, []);

    const stream = useCallback(async (term: string) => {
        try {
            const response = await fetch("/api/social-vigilante/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keyword: term }),
            });
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload?.error || "Falha no stream de monitoramento");
            }
            const data = await response.json();
            if (!Array.isArray(data.posts)) throw new Error("Resposta inválida do stream");
            const normalized = data.posts.slice(0, 3).map((post: any, idx: number): SocialPost => {
                const platform = String(post.platform || "twitter").toLowerCase() as Platform;
                return {
                    id: post.id || `api-${Date.now()}-${idx}`,
                    platform: platformMeta[platform] ? platform : "twitter",
                    author: post.author || "@monitoring",
                    content: String(post.content || "").slice(0, 190),
                    risk: (post.riskLevel || "medium") as Risk,
                    sentiment: (post.sentiment || "neutral") as Sentiment,
                    event: post.aiAnalysis?.detectedEvent || "Evento em análise",
                    createdAt: post.timestamp || new Date().toISOString(),
                };
            });
            setError(null);
            addPosts(normalized);
        } catch (streamError) {
            const message = streamError instanceof Error ? streamError.message : "Falha no monitoramento";
            setError(message);
            setIsMonitoring(false);
            setIsLoading(false);
        }
    }, [addPosts]);

    useEffect(() => {
        if (!isMonitoring || !activeTerm) return;
        let mounted = true;
        stream(activeTerm).finally(() => mounted && setIsLoading(false));
        const timer = setInterval(() => stream(activeTerm), 4200);
        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [isMonitoring, activeTerm, stream]);

    const start = () => {
        if (!searchTerm.trim()) return;
        setPosts([]);
        setProcessed(0);
        setBars([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setError(null);
        setActiveTerm(searchTerm.trim());
        setIsMonitoring(true);
        setIsLoading(true);
    };

    return (
        <div className={`flex overflow-hidden text-white ${embedded ? "h-full min-h-[760px]" : "h-[calc(100vh-82px)]"} bg-[radial-gradient(circle_at_20%_0%,#22103f_0%,#0b1330_36%,#050913_78%)]`}>
            <aside className="hidden md:flex w-[320px] shrink-0 border-r border-white/10 bg-[#090f24]/80 backdrop-blur-xl p-6 flex-col gap-5">
                <header className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-[#2a1a4f] border border-[#8b5cf6]/35 text-[#c4b5fd] grid place-items-center"><Globe size={19} /></div>
                    <div>
                        <p className="text-2xl font-semibold leading-none">Social Vigilante</p>
                        <p className="mt-1 text-sm text-white/60">{isMonitoring ? `Monitorando: ${activeTerm}` : "Offline"}</p>
                        {error ? <p className="mt-1 text-[11px] text-rose-300">{error}</p> : null}
                    </div>
                </header>
                <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-xs text-white/55">Processados</p><p className="text-4xl font-semibold leading-tight mt-1">{formatNumber(processed)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-xs text-white/55">Alto Risco</p><p className="text-4xl font-semibold leading-tight mt-1 text-[#FB7185]">{formatNumber(highRisk)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-xs text-white/55">Fontes</p><p className="text-4xl font-semibold leading-tight mt-1 text-[#A78BFA]">{formatNumber(sources)}</p></div>
                </div>
                <section className="flex-1 rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between mb-3"><p className="text-xl font-semibold">Velocidade de Sinais</p><Zap size={15} className="text-cyan-300" /></div>
                    <div className="h-[320px] flex items-end gap-2">{bars.map((h, i) => <div key={`${h}-${i}`} className="flex-1 rounded-t-md bg-gradient-to-t from-[#1f5562] to-[#2dd4bf]" style={{ height: `${Math.max(4, h)}%` }} />)}</div>
                </section>
            </aside>

            <main className="flex-1 flex flex-col border-r border-white/10 min-w-0">
                <div className="h-[78px] border-b border-white/10 bg-[#0b1633]/65 px-6 flex items-center gap-3">
                    <div className="h-11 flex-1 rounded-xl border border-white/15 bg-[#0a152d] px-4 flex items-center gap-3"><Search size={16} className="text-white/45" /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && start()} placeholder="Ozempic" className="w-full bg-transparent border-none outline-none text-base text-white placeholder:text-white/35" /></div>
                    <button onClick={isMonitoring ? () => setIsMonitoring(false) : start} disabled={isLoading} className={`h-11 px-5 rounded-xl text-sm font-semibold border inline-flex items-center gap-2 ${isMonitoring ? "border-rose-400/40 bg-rose-500/15 text-rose-200" : "border-cyan-400/45 bg-cyan-500/15 text-cyan-200"}`}>{isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}{isMonitoring ? "Parar Monitoramento" : "Iniciar Monitoramento"}</button>
                </div>
                <div className="h-[58px] border-b border-white/10 px-6 flex items-center gap-2 bg-[#0b1330]/60">
                    {(["feed", "heatmap", "sentiment"] as ViewMode[]).map((tab) => (
                        <button key={tab} onClick={() => setViewMode(tab)} className={`px-3 py-1.5 rounded-lg text-xs border ${viewMode === tab ? "border-[#8B5CF6]/55 bg-[#7C3AED]/20 text-[#DDD6FE]" : "border-white/10 text-white/60"}`}>
                            {tab === "feed" ? "Feed ao Vivo" : tab === "heatmap" ? "Mapa de Calor" : "Sentimento"}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {!isMonitoring && posts.length === 0 ? (
                        <div className="h-full rounded-3xl border border-white/10 bg-black/20 flex items-center justify-center text-center px-6"><div><Globe size={42} className="mx-auto mb-3 text-white/40" /><p className="text-white/60">Digite o nome de um medicamento e inicie o monitoramento para capturar sinais.</p></div></div>
                    ) : null}

                    {(isMonitoring || posts.length > 0) && viewMode === "feed" ? (
                        <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-4 min-h-[620px]">
                            <section className="rounded-2xl border border-white/10 bg-[#0b1227]/80 p-3"><p className="text-xs text-white/65 mb-2">Feed de Mídias Sociais em Tempo Real</p><div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">{posts.map((post) => <article key={post.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="flex items-start gap-2">{badge(post.platform)}<div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2 mb-1"><p className="text-xs font-semibold text-white/90 truncate">{post.author}</p><p className="text-[10px] text-white/45">{hoursAgo(post.createdAt)}</p></div><p className="text-[11px] text-white/70 leading-relaxed line-clamp-2">{post.content}</p><p className="mt-1 text-[10px] text-white/45 truncate">{activeTerm}: {post.event}</p></div><div className="w-12 shrink-0"><div className="h-9 w-9 rounded-full p-1.5 ml-auto" style={gaugeStyle(riskMeta[post.risk].gauge)}><div className="h-full w-full rounded-full bg-[#101935] grid place-items-center text-[9px] text-white/80">{riskMeta[post.risk].gauge}</div></div><p className={`mt-1 text-[10px] text-right ${riskMeta[post.risk].color}`}>{riskMeta[post.risk].label}</p></div></div></article>)}</div></section>
                            <section className="grid grid-rows-[1.05fr_auto_auto] gap-4">
                                <article className="rounded-2xl border border-white/10 bg-[#101629] p-3 relative overflow-hidden"><p className="text-xs text-white/65 mb-2">Mapa de Calor de Menções</p><div className="absolute inset-0 opacity-65 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.2),transparent_35%),radial-gradient(circle_at_80%_45%,rgba(236,72,153,0.16),transparent_32%),radial-gradient(circle_at_55%_70%,rgba(59,130,246,0.13),transparent_36%)]" /><div className="absolute inset-x-4 top-10 bottom-6 rounded-xl border border-white/10 bg-[#101827]/75">{[{ l: "17%", t: "36%", s: 16 }, { l: "24%", t: "53%", s: 13 }, { l: "47%", t: "34%", s: 18 }, { l: "66%", t: "49%", s: 15 }, { l: "81%", t: "65%", s: 11 }].map((p, i) => <span key={`${p.l}-${i}`} className="absolute rounded-full bg-[#C084FC]/65 shadow-[0_0_18px_rgba(192,132,252,0.8)]" style={{ left: p.l, top: p.t, width: p.s, height: p.s }} />)}</div></article>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <article className="rounded-2xl border border-white/10 bg-[#101629] p-4"><p className="text-xs text-white/65 mb-3">Análise de Sentimento Geral</p><div className="h-[100px] w-[100px] rounded-full mx-auto p-2" style={gaugeStyle(Math.min(98, 58 + sentiment.negative * 5))}><div className="h-full w-full rounded-full bg-[#101935] grid place-items-center"><span className="text-xl font-semibold text-white">{Math.min(99, 55 + sentiment.negative * 2)}%</span></div></div><div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-center"><p className="text-red-300">Neg {sentiment.negative}</p><p className="text-white/70">Neu {sentiment.neutral}</p><p className="text-emerald-300">Pos {sentiment.positive}</p></div></article>
                                    <article className="rounded-2xl border border-white/10 bg-[#101629] p-4"><p className="text-xs text-white/65 mb-3">Reações Adversas Detectadas</p><div className="space-y-2 text-[11px]">{alerts.slice(0, 3).map((post) => <div key={post.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2"><p className="text-white/85 truncate">{post.event}</p><div className="mt-1 flex items-center justify-between text-white/50"><span>{platformMeta[post.platform].label}</span><span className={riskMeta[post.risk].color}>{riskMeta[post.risk].label}</span></div></div>)}{alerts.length === 0 ? <p className="text-white/45">Sem alertas críticos no momento.</p> : null}</div></article>
                                </div>
                                <article className="rounded-2xl border border-white/10 bg-[#101629] p-4"><p className="text-xs text-white/65 mb-3">Tendências de Volume</p><div className="h-[120px] grid grid-cols-10 gap-1.5 items-end">{[18, 42, 33, 64, 41, 71, 39, 58, 49, 67].map((v, i) => <div key={`${v}-${i}`} className="rounded-t bg-gradient-to-t from-[#4C1D95] via-[#7C3AED] to-[#C084FC]" style={{ height: `${v}%` }} />)}</div></article>
                            </section>
                        </div>
                    ) : null}

                    {viewMode === "heatmap" ? <article className="rounded-3xl border border-white/10 bg-[#0f1833] p-6 min-h-[620px] relative overflow-hidden"><p className="text-sm text-white/75">Mapa global de clusters para {activeTerm || searchTerm}</p><div className="absolute inset-6 rounded-2xl border border-white/10 bg-[#121c39]" /></article> : null}
                    {viewMode === "sentiment" ? <section className="grid lg:grid-cols-2 gap-4 min-h-[620px]"><article className="rounded-2xl border border-white/10 bg-[#101629] p-6"><p className="text-sm text-white/75 mb-5">Distribuição de sentimento</p><div className="space-y-4">{(["negative", "neutral", "positive"] as Sentiment[]).map((key) => { const total = Math.max(1, posts.length); const count = sentiment[key]; const width = Math.max(8, Math.round((count / total) * 100)); const color = key === "negative" ? "from-red-500 to-rose-300" : key === "neutral" ? "from-slate-500 to-slate-300" : "from-emerald-500 to-emerald-300"; return <div key={key}><div className="mb-1 flex items-center justify-between text-xs text-white/70"><span>{key === "negative" ? "Negativo" : key === "neutral" ? "Neutro" : "Positivo"}</span><span>{count}</span></div><div className="h-2.5 rounded-full bg-white/10 overflow-hidden"><div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${width}%` }} /></div></div>; })}</div></article><article className="rounded-2xl border border-white/10 bg-[#101629] p-6"><p className="text-sm text-white/75 mb-5">Reações adversas por severidade</p><div className="space-y-3">{(["critical", "high", "medium", "low"] as Risk[]).map((risk) => <div key={risk} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 flex items-center justify-between"><p className={`text-sm ${riskMeta[risk].color}`}>{riskMeta[risk].label}</p><p className="text-sm font-semibold text-white">{posts.filter((post) => post.risk === risk).length}</p></div>)}</div></article></section> : null}
                </div>
            </main>

            <aside className="hidden xl:flex w-[300px] shrink-0 bg-[#091229]/80 border-l border-white/10 p-5 flex-col">
                <h3 className="text-sm uppercase tracking-[0.14em] text-white/70 mb-4">Alertas Recentes</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"><p className="text-[11px] text-white/50">Negativo</p><p className="text-3xl font-semibold text-red-300">{formatNumber(sentiment.negative)}</p></div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"><p className="text-[11px] text-white/50">Crítico/Alto</p><p className="text-3xl font-semibold text-orange-300">{formatNumber(critical + alerts.length)}</p></div>
                </div>
                <div className="space-y-2 overflow-y-auto pr-1">
                    {alerts.length === 0 ? <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-white/45">Nenhum alerta crítico no momento.</div> : null}
                    {alerts.map((post) => <article key={`alert-${post.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="flex items-start gap-2"><div className="h-7 w-7 rounded-full bg-[#7c2d12]/45 text-orange-300 grid place-items-center shrink-0"><AlertTriangle size={13} /></div><div className="min-w-0"><p className="text-xs font-semibold text-white/90 line-clamp-2">{post.event}</p><p className="text-[10px] text-white/50 mt-1">{post.author} • {hoursAgo(post.createdAt)}</p><div className="mt-1 flex items-center gap-2">{badge(post.platform)}<span className={`text-[10px] ${riskMeta[post.risk].color}`}>{riskMeta[post.risk].label}</span></div></div></div></article>)}
                </div>
                <div className="mt-3 rounded-lg border border-[#7c3aed]/40 bg-[#6d28d9]/15 px-3 py-2 text-[11px] text-[#ddd6fe]"><ShieldAlert size={13} className="inline mr-1" />Detecção de cluster ativo para {activeTerm || searchTerm}.</div>
            </aside>
        </div>
    );
}
