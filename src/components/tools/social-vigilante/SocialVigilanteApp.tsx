"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Globe, Loader2, Search, ShieldAlert, Sparkles, Zap } from "lucide-react";

type Platform = "twitter" | "facebook" | "instagram" | "reddit" | "reclameaqui" | "hackernews";
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
    isSimulated?: boolean;
    sourceUrl?: string;
}

const platformMeta: Record<Platform, { label: string; bg: string; icon: React.ReactNode }> = {
    twitter: {
        label: "X (Twitter)",
        bg: "bg-black border border-white/20",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    facebook: {
        label: "Facebook",
        bg: "bg-[#1877F2] border border-[#60A5FA]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    instagram: {
        label: "Instagram",
        bg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] border border-[#E879F9]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
    reddit: {
        label: "Reddit",
        bg: "bg-[#FF4500] border border-[#FB923C]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
            </svg>
        ),
    },
    reclameaqui: {
        label: "Reclame Aqui",
        bg: "bg-[#2563EB] border border-[#60A5FA]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3" aria-label="Reclame Aqui">
                <text x="1" y="11" fontSize="8" fontWeight="bold" fontFamily="Arial,sans-serif">RA</text>
            </svg>
        ),
    },
    hackernews: {
        label: "Hacker News",
        bg: "bg-[#FF6600] border border-[#FB923C]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z" />
            </svg>
        ),
    },
};

const riskMeta: Record<Risk, { label: string; color: string; gauge: number; cellColor: string }> = {
    critical: { label: "Crítico", color: "text-red-300", gauge: 92, cellColor: "bg-red-500/20 border-red-500/30 text-red-200" },
    high: { label: "Alto", color: "text-orange-300", gauge: 78, cellColor: "bg-orange-500/15 border-orange-500/30 text-orange-200" },
    medium: { label: "Médio", color: "text-cyan-300", gauge: 56, cellColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-200" },
    low: { label: "Baixo", color: "text-emerald-300", gauge: 34, cellColor: "bg-emerald-500/8 border-emerald-500/25 text-emerald-200" },
};

interface SocialVigilanteAppProps {
    embedded?: boolean;
}

function PlatformBadge({ platform }: { platform: Platform }) {
    const meta = platformMeta[platform];
    return (
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${meta.bg} shrink-0`}>
            {meta.icon}
        </span>
    );
}

function gaugeStyle(value: number) {
    return { background: `conic-gradient(#A855F7 ${Math.max(8, value)}%, rgba(255,255,255,0.1) 0)` };
}

function hoursAgo(timestamp: string) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const h = Math.max(1, Math.round(diff / 3600000));
    return h < 24 ? `${h}h atrás` : `${Math.round(h / 24)}d atrás`;
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
    const [dataSource, setDataSource] = useState<string>("");

    const highRisk = useMemo(() => posts.filter((p) => p.risk === "high" || p.risk === "critical").length, [posts]);
    const critical = useMemo(() => posts.filter((p) => p.risk === "critical").length, [posts]);
    const sentiment = useMemo(
        () =>
            posts.reduce(
                (acc, p) => { acc[p.sentiment] += 1; return acc; },
                { negative: 0, neutral: 0, positive: 0 }
            ),
        [posts]
    );
    const alerts = useMemo(() => posts.filter((p) => p.risk === "critical" || p.risk === "high").slice(0, 4), [posts]);
    const sources = useMemo(() => new Set(posts.map((p) => p.platform)).size, [posts]);
    const formatNumber = (v: number) => new Intl.NumberFormat("pt-BR").format(v);

    // Heat map data: platform × risk counts
    const heatmapData = useMemo(() => {
        const platforms = Array.from(new Set(posts.map((p) => p.platform))) as Platform[];
        const risks: Risk[] = ["critical", "high", "medium", "low"];
        return { platforms, risks, matrix: Object.fromEntries(platforms.map((pl) => [pl, Object.fromEntries(risks.map((r) => [r, posts.filter((p) => p.platform === pl && p.risk === r).length]))])) };
    }, [posts]);

    const platformCounts = useMemo(() => {
        const counts: Partial<Record<Platform, number>> = {};
        for (const p of posts) counts[p.platform] = (counts[p.platform] || 0) + 1;
        return counts;
    }, [posts]);

    const addPosts = useCallback((incoming: SocialPost[], src: string) => {
        setPosts((prev) => [...incoming, ...prev].slice(0, 24));
        setProcessed((prev) => prev + incoming.length);
        setDataSource(src);
        setBars((prev) =>
            prev.map((v) => {
                const next = v + Math.floor((Math.random() - 0.45) * 20);
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
                throw new Error(payload?.error || "Falha no monitoramento");
            }
            const data = await response.json();
            if (!Array.isArray(data.posts)) throw new Error("Resposta inválida");
            const normalized = data.posts.slice(0, 6).map((post: any, idx: number): SocialPost => {
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
                    isSimulated: Boolean(post.isSimulated),
                    sourceUrl: post.sourceUrl,
                };
            });
            setError(null);
            addPosts(normalized, data.source || "");
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
        return () => { mounted = false; clearInterval(timer); };
    }, [isMonitoring, activeTerm, stream]);

    const start = () => {
        if (!searchTerm.trim()) return;
        setPosts([]);
        setProcessed(0);
        setBars([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setError(null);
        setDataSource("");
        setActiveTerm(searchTerm.trim());
        setIsMonitoring(true);
        setIsLoading(true);
    };

    const sourceLabel = dataSource === "live"
        ? "Reddit + Hacker News"
        : dataSource === "gemini-generated"
        ? "Simulado por IA"
        : dataSource === "error"
        ? "Erro"
        : "";

    return (
        <div className={`flex text-white ${embedded ? "min-h-[900px]" : "h-[calc(100vh-82px)] overflow-hidden"} bg-[radial-gradient(circle_at_20%_0%,#22103f_0%,#0b1330_36%,#050913_78%)]`}>
            {/* Left sidebar */}
            <aside className="hidden md:flex w-[320px] shrink-0 border-r border-white/10 bg-[#090f24]/80 backdrop-blur-xl p-6 flex-col gap-5">
                <header className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-[#2a1a4f] border border-[#8b5cf6]/35 text-[#c4b5fd] grid place-items-center">
                        <Globe size={19} />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold leading-none">Social Vigilante</p>
                        <p className="mt-1 text-sm text-white/60">{isMonitoring ? `Monitorando: ${activeTerm}` : "Offline"}</p>
                        {sourceLabel ? (
                            <p className={`mt-0.5 text-[10px] font-medium ${dataSource === "gemini-generated" ? "text-amber-400/80" : "text-emerald-400/80"}`}>
                                {dataSource === "gemini-generated" ? "⚠ " : "● "}{sourceLabel}
                            </p>
                        ) : null}
                        {error ? <p className="mt-1 text-[11px] text-rose-300">{error}</p> : null}
                    </div>
                </header>

                <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                        <p className="text-xs text-white/55">Processados</p>
                        <p className="text-4xl font-semibold leading-tight mt-1">{formatNumber(processed)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                        <p className="text-xs text-white/55">Alto Risco</p>
                        <p className="text-4xl font-semibold leading-tight mt-1 text-[#FB7185]">{formatNumber(highRisk)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                        <p className="text-xs text-white/55">Fontes</p>
                        <p className="text-4xl font-semibold leading-tight mt-1 text-[#A78BFA]">{formatNumber(sources)}</p>
                    </div>
                </div>

                <section className="flex-1 rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xl font-semibold">Velocidade de Sinais</p>
                        <Zap size={15} className="text-cyan-300" />
                    </div>
                    <div className="h-[320px] flex items-end gap-2">
                        {bars.map((h, i) => (
                            <div key={`${h}-${i}`} className="flex-1 rounded-t-md bg-gradient-to-t from-[#1f5562] to-[#2dd4bf]" style={{ height: `${Math.max(4, h)}%` }} />
                        ))}
                    </div>
                </section>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col border-r border-white/10 min-w-0">
                <div className="h-[78px] border-b border-white/10 bg-[#0b1633]/65 px-6 flex items-center gap-3">
                    <div className="h-11 flex-1 rounded-xl border border-white/15 bg-[#0a152d] px-4 flex items-center gap-3">
                        <Search size={16} className="text-white/45" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && start()}
                            placeholder="Ozempic"
                            className="w-full bg-transparent border-none outline-none text-base text-white placeholder:text-white/35"
                        />
                    </div>
                    <button
                        onClick={isMonitoring ? () => setIsMonitoring(false) : start}
                        disabled={isLoading}
                        className={`h-11 px-5 rounded-xl text-sm font-semibold border inline-flex items-center gap-2 ${isMonitoring ? "border-rose-400/40 bg-rose-500/15 text-rose-200" : "border-cyan-400/45 bg-cyan-500/15 text-cyan-200"}`}
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {isMonitoring ? "Parar Monitoramento" : "Iniciar Monitoramento"}
                    </button>
                </div>

                <div className="h-[58px] border-b border-white/10 px-6 flex items-center gap-2 bg-[#0b1330]/60">
                    {(["feed", "heatmap", "sentiment"] as ViewMode[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setViewMode(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs border ${viewMode === tab ? "border-[#8B5CF6]/55 bg-[#7C3AED]/20 text-[#DDD6FE]" : "border-white/10 text-white/60"}`}
                        >
                            {tab === "feed" ? "Feed ao Vivo" : tab === "heatmap" ? "Mapa de Calor" : "Sentimento"}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {!isMonitoring && posts.length === 0 ? (
                        <div className="h-full rounded-3xl border border-white/10 bg-black/20 flex items-center justify-center text-center px-6">
                            <div>
                                <Globe size={42} className="mx-auto mb-3 text-white/40" />
                                <p className="text-white/60">Digite o nome de um medicamento e inicie o monitoramento para capturar sinais.</p>
                            </div>
                        </div>
                    ) : null}

                    {/* FEED VIEW */}
                    {(isMonitoring || posts.length > 0) && viewMode === "feed" ? (
                        <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-4 min-h-[620px]">
                            <section className="rounded-2xl border border-white/10 bg-[#0b1227]/80 p-3">
                                <p className="text-xs text-white/65 mb-2">Feed de Mídias Sociais em Tempo Real</p>
                                <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                                    {posts.map((post) => (
                                        <article key={post.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                            <div className="flex items-start gap-2">
                                                <PlatformBadge platform={post.platform} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <p className="text-xs font-semibold text-white/90 truncate">{post.author}</p>
                                                            {post.isSimulated ? (
                                                                <span className="shrink-0 text-[9px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">Simulado</span>
                                                            ) : null}
                                                        </div>
                                                        <p className="text-[10px] text-white/45 shrink-0">{hoursAgo(post.createdAt)}</p>
                                                    </div>
                                                    <p className="text-[11px] text-white/70 leading-relaxed line-clamp-2">{post.content}</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <p className="text-[10px] text-white/45 truncate flex-1">{activeTerm}: {post.event}</p>
                                                        {post.sourceUrl ? (
                                                            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] text-cyan-400/60 hover:text-cyan-300 shrink-0">↗ ver</a>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="w-12 shrink-0">
                                                    <div className="h-9 w-9 rounded-full p-1.5 ml-auto" style={gaugeStyle(riskMeta[post.risk].gauge)}>
                                                        <div className="h-full w-full rounded-full bg-[#101935] grid place-items-center text-[9px] text-white/80">{riskMeta[post.risk].gauge}</div>
                                                    </div>
                                                    <p className={`mt-1 text-[10px] text-right ${riskMeta[post.risk].color}`}>{riskMeta[post.risk].label}</p>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            <section className="grid grid-rows-[1.05fr_auto_auto] gap-4">
                                <article className="rounded-2xl border border-white/10 bg-[#101629] p-3 relative overflow-hidden">
                                    <p className="text-xs text-white/65 mb-2">Distribuição por Plataforma</p>
                                    <div className="space-y-2 mt-2">
                                        {(Object.entries(platformCounts) as [Platform, number][]).sort((a, b) => b[1] - a[1]).map(([pl, count]) => {
                                            const total = Math.max(1, posts.length);
                                            const pct = Math.round((count / total) * 100);
                                            return (
                                                <div key={pl} className="flex items-center gap-2">
                                                    <PlatformBadge platform={pl} />
                                                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7]" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-[10px] text-white/60 w-6 text-right">{count}</span>
                                                </div>
                                            );
                                        })}
                                        {Object.keys(platformCounts).length === 0 ? <p className="text-[11px] text-white/40">Aguardando dados...</p> : null}
                                    </div>
                                </article>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <article className="rounded-2xl border border-white/10 bg-[#101629] p-4">
                                        <p className="text-xs text-white/65 mb-3">Análise de Sentimento Geral</p>
                                        <div className="h-[100px] w-[100px] rounded-full mx-auto p-2" style={gaugeStyle(Math.min(98, 58 + sentiment.negative * 5))}>
                                            <div className="h-full w-full rounded-full bg-[#101935] grid place-items-center">
                                                <span className="text-xl font-semibold text-white">{Math.min(99, 55 + sentiment.negative * 2)}%</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-center">
                                            <p className="text-red-300">Neg {sentiment.negative}</p>
                                            <p className="text-white/70">Neu {sentiment.neutral}</p>
                                            <p className="text-emerald-300">Pos {sentiment.positive}</p>
                                        </div>
                                    </article>
                                    <article className="rounded-2xl border border-white/10 bg-[#101629] p-4">
                                        <p className="text-xs text-white/65 mb-3">Reações Adversas Detectadas</p>
                                        <div className="space-y-2 text-[11px]">
                                            {alerts.slice(0, 3).map((post) => (
                                                <div key={post.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
                                                    <p className="text-white/85 truncate">{post.event}</p>
                                                    <div className="mt-1 flex items-center justify-between text-white/50">
                                                        <span>{platformMeta[post.platform].label}</span>
                                                        <span className={riskMeta[post.risk].color}>{riskMeta[post.risk].label}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {alerts.length === 0 ? <p className="text-white/45">Sem alertas críticos no momento.</p> : null}
                                        </div>
                                    </article>
                                </div>

                                <article className="rounded-2xl border border-white/10 bg-[#101629] p-4">
                                    <p className="text-xs text-white/65 mb-3">Tendências de Volume</p>
                                    <div className="h-[120px] grid grid-cols-10 gap-1.5 items-end">
                                        {bars.map((v, i) => (
                                            <div key={`bar-${i}`} className="rounded-t bg-gradient-to-t from-[#4C1D95] via-[#7C3AED] to-[#C084FC]" style={{ height: `${v || 18}%` }} />
                                        ))}
                                    </div>
                                </article>
                            </section>
                        </div>
                    ) : null}

                    {/* HEATMAP VIEW */}
                    {viewMode === "heatmap" ? (
                        <article className="rounded-3xl border border-white/10 bg-[#0f1833] p-6 min-h-[620px]">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm font-semibold text-white/90">Mapa de Calor — Plataforma × Risco</p>
                                    <p className="text-xs text-white/50 mt-0.5">Distribuição de sinais para: {activeTerm || searchTerm}</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-white/50">
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-red-500/40 inline-block" />Crítico</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-orange-500/40 inline-block" />Alto</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-cyan-500/30 inline-block" />Médio</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500/25 inline-block" />Baixo</span>
                                </div>
                            </div>

                            {posts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[440px] text-white/40">
                                    <Globe size={36} className="mb-3" />
                                    <p>Inicie o monitoramento para ver a distribuição de sinais.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Matrix table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr>
                                                    <th className="text-left pb-3 text-white/50 font-medium w-36">Plataforma</th>
                                                    {(["critical", "high", "medium", "low"] as Risk[]).map((r) => (
                                                        <th key={r} className={`pb-3 text-center font-medium px-2 ${riskMeta[r].color}`}>{riskMeta[r].label}</th>
                                                    ))}
                                                    <th className="pb-3 text-center text-white/50 font-medium">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="space-y-1">
                                                {heatmapData.platforms.map((pl) => {
                                                    const rowTotal = (["critical", "high", "medium", "low"] as Risk[]).reduce((s, r) => s + (heatmapData.matrix[pl]?.[r] || 0), 0);
                                                    return (
                                                        <tr key={pl} className="border-t border-white/5">
                                                            <td className="py-2 pr-3">
                                                                <div className="flex items-center gap-2">
                                                                    <PlatformBadge platform={pl} />
                                                                    <span className="text-white/80 truncate">{platformMeta[pl].label}</span>
                                                                </div>
                                                            </td>
                                                            {(["critical", "high", "medium", "low"] as Risk[]).map((r) => {
                                                                const count = heatmapData.matrix[pl]?.[r] || 0;
                                                                const maxInCol = Math.max(1, ...heatmapData.platforms.map((p2) => heatmapData.matrix[p2]?.[r] || 0));
                                                                const intensity = count / maxInCol;
                                                                return (
                                                                    <td key={r} className="py-2 px-2 text-center">
                                                                        <div
                                                                            className={`mx-auto h-9 w-9 rounded-lg border flex items-center justify-center font-semibold transition-all ${count > 0 ? riskMeta[r].cellColor : "border-white/5 text-white/20"}`}
                                                                            style={{ opacity: count > 0 ? 0.4 + intensity * 0.6 : 1 }}
                                                                        >
                                                                            {count}
                                                                        </div>
                                                                    </td>
                                                                );
                                                            })}
                                                            <td className="py-2 text-center font-semibold text-white/70">{rowTotal}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Platform bubbles */}
                                    <div className="rounded-2xl border border-white/10 bg-[#121c39] p-5">
                                        <p className="text-xs text-white/50 mb-4">Volume por plataforma</p>
                                        <div className="flex flex-wrap gap-3 items-end">
                                            {(Object.entries(platformCounts) as [Platform, number][]).sort((a, b) => b[1] - a[1]).map(([pl, count]) => {
                                                const maxCount = Math.max(...Object.values(platformCounts) as number[]);
                                                const size = 36 + Math.round((count / maxCount) * 56);
                                                return (
                                                    <div key={pl} className="flex flex-col items-center gap-1">
                                                        <div
                                                            className="rounded-full flex items-center justify-center bg-[#7C3AED]/25 border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                                            style={{ width: size, height: size }}
                                                        >
                                                            <span className="text-white font-bold" style={{ fontSize: Math.max(10, size / 4) }}>{count}</span>
                                                        </div>
                                                        <span className="text-[10px] text-white/60">{platformMeta[pl].label.split(" ")[0]}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </article>
                    ) : null}

                    {/* SENTIMENT VIEW */}
                    {viewMode === "sentiment" ? (
                        <section className="grid lg:grid-cols-2 gap-4 min-h-[620px]">
                            <article className="rounded-2xl border border-white/10 bg-[#101629] p-6">
                                <p className="text-sm text-white/75 mb-5">Distribuição de sentimento</p>
                                <div className="space-y-4">
                                    {(["negative", "neutral", "positive"] as Sentiment[]).map((key) => {
                                        const total = Math.max(1, posts.length);
                                        const count = sentiment[key];
                                        const width = Math.max(8, Math.round((count / total) * 100));
                                        const color = key === "negative" ? "from-red-500 to-rose-300" : key === "neutral" ? "from-slate-500 to-slate-300" : "from-emerald-500 to-emerald-300";
                                        return (
                                            <div key={key}>
                                                <div className="mb-1 flex items-center justify-between text-xs text-white/70">
                                                    <span>{key === "negative" ? "Negativo" : key === "neutral" ? "Neutro" : "Positivo"}</span>
                                                    <span>{count}</span>
                                                </div>
                                                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${width}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </article>
                            <article className="rounded-2xl border border-white/10 bg-[#101629] p-6">
                                <p className="text-sm text-white/75 mb-5">Reações adversas por severidade</p>
                                <div className="space-y-3">
                                    {(["critical", "high", "medium", "low"] as Risk[]).map((risk) => (
                                        <div key={risk} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 flex items-center justify-between">
                                            <p className={`text-sm ${riskMeta[risk].color}`}>{riskMeta[risk].label}</p>
                                            <p className="text-sm font-semibold text-white">{posts.filter((p) => p.risk === risk).length}</p>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </section>
                    ) : null}
                </div>
            </main>

            {/* Right sidebar */}
            <aside className="hidden xl:flex w-[300px] shrink-0 bg-[#091229]/80 border-l border-white/10 p-5 flex-col">
                <h3 className="text-sm uppercase tracking-[0.14em] text-white/70 mb-4">Alertas Recentes</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                        <p className="text-[11px] text-white/50">Negativo</p>
                        <p className="text-3xl font-semibold text-red-300">{formatNumber(sentiment.negative)}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                        <p className="text-[11px] text-white/50">Crítico/Alto</p>
                        <p className="text-3xl font-semibold text-orange-300">{formatNumber(critical + alerts.length)}</p>
                    </div>
                </div>
                <div className="space-y-2 overflow-y-auto pr-1">
                    {alerts.length === 0 ? (
                        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-white/45">Nenhum alerta crítico no momento.</div>
                    ) : null}
                    {alerts.map((post) => (
                        <article key={`alert-${post.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <div className="flex items-start gap-2">
                                <div className="h-7 w-7 rounded-full bg-[#7c2d12]/45 text-orange-300 grid place-items-center shrink-0">
                                    <AlertTriangle size={13} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white/90 line-clamp-2">{post.event}</p>
                                    <p className="text-[10px] text-white/50 mt-1">{post.author} • {hoursAgo(post.createdAt)}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <PlatformBadge platform={post.platform} />
                                        <span className={`text-[10px] ${riskMeta[post.risk].color}`}>{riskMeta[post.risk].label}</span>
                                        {post.isSimulated ? <span className="text-[9px] text-amber-400/70">Simulado</span> : null}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="mt-3 rounded-lg border border-[#7c3aed]/40 bg-[#6d28d9]/15 px-3 py-2 text-[11px] text-[#ddd6fe]">
                    <ShieldAlert size={13} className="inline mr-1" />
                    Detecção de cluster ativo para {activeTerm || searchTerm}.
                </div>
            </aside>
        </div>
    );
}
