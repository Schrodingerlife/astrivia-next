"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    Search,
    Filter,
    BarChart3,
    Share2,
    MessageSquare,
    ThumbsUp,
    MoreHorizontal,
    Globe,
    Zap,
    Loader2
} from "lucide-react";

// Mock Data Types
interface SocialPost {
    id: string;
    platform: "twitter" | "instagram" | "reddit" | "reclameaqui";
    author: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    shares: number;
    sentiment: "positive" | "neutral" | "negative";
    riskLevel: "low" | "medium" | "high" | "critical";
    aiAnalysis?: {
        detectedEvent?: string;
        drugMentioned?: string;
        complianceFlag?: boolean;
    };
    status: "new" | "reviewing" | "resolved";
}

const MOCK_POSTS_POOL: Omit<SocialPost, "id" | "timestamp" | "status">[] = [
    {
        platform: "twitter",
        author: "Ana Paula Ferreira",
        handle: "@anapaula_fer",
        avatar: "https://i.pravatar.cc/150?u=anapaula1",
        content: "Gente, comecei a tomar DRUG_NAME faz 3 semanas e estou com uma náusea constante que não passa. Meu médico disse pra continuar, mas tá difícil. Alguém mais passou por isso no início? 😰",
        likes: 23,
        shares: 7,
        sentiment: "negative",
        riskLevel: "high",
        aiAnalysis: { detectedEvent: "Náusea persistente (SOC: Distúrbios gastrointestinais)", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
    {
        platform: "reddit",
        author: "MarcosFarma",
        handle: "u/marcos_farma",
        avatar: "https://i.pravatar.cc/150?u=marcos2",
        content: "Alguém que toma DRUG_NAME notou alteração nos exames de função hepática? Minhas transaminases subiram bastante na última coleta e meu hepato pediu pra investigar. Estou preocupado se pode ser do medicamento.",
        likes: 67,
        shares: 12,
        sentiment: "negative",
        riskLevel: "critical",
        aiAnalysis: { detectedEvent: "Hepatotoxicidade (elevação de ALT/AST)", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
    {
        platform: "instagram",
        author: "Dra. Camila Nutri",
        handle: "@dracamilanutri",
        avatar: "https://i.pravatar.cc/150?u=camila3",
        content: "Vejo muitos pacientes usando DRUG_NAME por conta própria pra emagrecer, sem indicação médica. Isso é perigoso! O medicamento tem indicações específicas e efeitos colaterais sérios. Procurem orientação profissional 🙏",
        likes: 2340,
        shares: 189,
        sentiment: "neutral",
        riskLevel: "high",
        aiAnalysis: { detectedEvent: "Uso off-label sem prescrição", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
    {
        platform: "reclameaqui",
        author: "Roberto Santos",
        handle: "Cliente Verificado",
        avatar: "https://i.pravatar.cc/150?u=roberto4",
        content: "Comprei DRUG_NAME na farmácia e quando abri a embalagem o comprimido estava com manchas escuras e cheiro diferente do normal. Lote #BR2024-1847. Já registrei reclamação na ANVISA também. Estou com medo de ter tomado produto adulterado.",
        likes: 0,
        shares: 0,
        sentiment: "negative",
        riskLevel: "critical",
        aiAnalysis: { detectedEvent: "Desvio de qualidade - alteração organoléptica", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
    {
        platform: "twitter",
        author: "Dr. Ricardo Endo",
        handle: "@dr_endo_sp",
        avatar: "https://i.pravatar.cc/150?u=ricardo5",
        content: "Novo estudo publicado no NEJM mostra que DRUG_NAME pode ter benefício cardiovascular além da indicação primária. Precisamos acompanhar os dados de longo prazo antes de extrapolar, mas é promissor.",
        likes: 156,
        shares: 89,
        sentiment: "positive",
        riskLevel: "low",
        aiAnalysis: { detectedEvent: "Benefício cardiovascular potencial (uso off-label)", drugMentioned: "DRUG_NAME", complianceFlag: false }
    },
    {
        platform: "reddit",
        author: "JuliaHealthBR",
        handle: "u/julia_health",
        avatar: "https://i.pravatar.cc/150?u=julia6",
        content: "3 meses de DRUG_NAME e posso dizer: funciona, mas o preço é a adaptação gastrointestinal nas primeiras semanas. Diarreia, cólica, gases. Depois estabiliza. Minha dica: comece com dose baixa e suba devagar.",
        likes: 234,
        shares: 45,
        sentiment: "neutral",
        riskLevel: "medium",
        aiAnalysis: { detectedEvent: "Distúrbios gastrointestinais (diarreia, flatulência)", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
    {
        platform: "instagram",
        author: "Pedro Treino",
        handle: "@pedrotreino",
        avatar: "https://i.pravatar.cc/150?u=pedro7",
        content: "Galera da academia me indicou DRUG_NAME pra secar mais rápido kkk já encomendei, chega semana que vem. Bora ficar trincado 💪🔥 #fitness #emagrecimento",
        likes: 567,
        shares: 23,
        sentiment: "positive",
        riskLevel: "high",
        aiAnalysis: { detectedEvent: "Uso recreativo/estético sem prescrição", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
    {
        platform: "reclameaqui",
        author: "Maria Conceição",
        handle: "Cliente",
        avatar: "https://i.pravatar.cc/150?u=maria8",
        content: "Minha mãe de 72 anos tomou DRUG_NAME e começou a ter episódios de hipoglicemia severa, precisou ir ao pronto-socorro 2 vezes. O médico disse que pode ser interação com outro medicamento que ela toma. A bula não é clara sobre essa interação.",
        likes: 3,
        shares: 0,
        sentiment: "negative",
        riskLevel: "critical",
        aiAnalysis: { detectedEvent: "Hipoglicemia severa - interação medicamentosa em idoso", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
    {
        platform: "twitter",
        author: "Flávia Costa",
        handle: "@flavia_cst",
        avatar: "https://i.pravatar.cc/150?u=flavia9",
        content: "Estou no segundo mês de DRUG_NAME e finalmente os efeitos colaterais diminuíram. Valeu a persistência! Quem está no início, não desista. Melhora muito depois da adaptação.",
        likes: 45,
        shares: 8,
        sentiment: "positive",
        riskLevel: "low",
        aiAnalysis: { detectedEvent: "Adaptação terapêutica positiva", drugMentioned: "DRUG_NAME", complianceFlag: false }
    },
    {
        platform: "reddit",
        author: "FarmaVigilante",
        handle: "u/farma_vig",
        avatar: "https://i.pravatar.cc/150?u=farmav10",
        content: "PSA: Se vocês estão comprando DRUG_NAME pela internet sem receita, saibam que já foram apreendidos lotes falsificados pela PF. Só comprem em farmácias físicas com nota fiscal. Sério, não arrisquem a saúde.",
        likes: 890,
        shares: 234,
        sentiment: "neutral",
        riskLevel: "critical",
        aiAnalysis: { detectedEvent: "Falsificação e venda ilegal", drugMentioned: "DRUG_NAME", complianceFlag: true }
    },
];

export default function SocialVigilanteApp() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [stats, setStats] = useState({ highRisk: 0, processed: 0, sources: 0 });
    const [isSimulating, setIsSimulating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("Ozempic");
    const [activeTerm, setActiveTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const postIndexRef = useRef(0);

    // Initial Stats
    useEffect(() => {
        setStats({ highRisk: 12, processed: 1450, sources: 4 });
    }, []);

    // Simulation Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isSimulating && activeTerm) {
            // Reset index on new search
            postIndexRef.current = 0;

            const fetchSimulation = async () => {
                try {
                    const response = await fetch("/api/social-vigilante/stream", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ keyword: activeTerm }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.posts && data.posts.length > 0) {
                            addPosts(data.posts);
                            return;
                        }
                    }
                    throw new Error("API Failed or empty");
                } catch (error) {
                    console.warn("API unavailable, using local simulation:", error);
                    simulateLocalPost();
                }
            };

            const simulateLocalPost = () => {
                // Pick next post sequentially from pool (cycles through all 10)
                const idx = postIndexRef.current % MOCK_POSTS_POOL.length;
                postIndexRef.current += 1;
                const post = MOCK_POSTS_POOL[idx];

                // Add realistic time variance
                const minutesAgo = Math.floor(Math.random() * 45) + 1;
                const newPost: SocialPost = {
                    ...post,
                    id: `local-${Date.now()}-${idx}`,
                    timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
                    status: "new" as const,
                    content: post.content.replace(/DRUG_NAME/g, activeTerm),
                    aiAnalysis: post.aiAnalysis ? {
                        ...post.aiAnalysis,
                        drugMentioned: activeTerm
                    } : undefined,
                };
                addPosts([newPost]);
            };

            // First fetch immediately
            fetchSimulation();

            // Then every 4 seconds — one post at a time feels more realistic
            interval = setInterval(fetchSimulation, 4000);
        }

        return () => clearInterval(interval);
    }, [isSimulating, activeTerm]);

    const addPosts = (newPosts: SocialPost[]) => {
        setPosts(prev => {
            const combined = [...newPosts, ...prev].slice(0, 50);
            return combined;
        });

        // Update stats based on new batch
        const newHighRisk = newPosts.filter(p => p.riskLevel === "high" || p.riskLevel === "critical").length;
        setStats(prev => ({
            processed: prev.processed + newPosts.length,
            highRisk: prev.highRisk + newHighRisk,
            sources: 4
        }));
    };

    const handleStartSimulation = () => {
        if (!searchTerm) return;
        setPosts([]); // Clear previous
        setActiveTerm(searchTerm);
        setIsSimulating(true);
        setLoading(true);
        setTimeout(() => setLoading(false), 2000); // Fake logic loading for UI feel
    };

    const handleStopSimulation = () => {
        setIsSimulating(false);
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
            case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            default: return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "twitter": return "🐦";
            case "instagram": return "📷";
            case "reddit": return "👽";
            case "reclameaqui": return "📢";
            default: return "🌐";
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-[#050B14] text-white overflow-hidden font-sans">
            {/* Sidebar / Stats */}
            <div className="w-80 bg-[#0A1628]/50 border-r border-white/5 p-6 flex flex-col gap-6 hidden md:flex">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">Social Vigilante</h2>
                        <span className="text-xs text-white/40 flex items-center gap-1">
                            {isSimulating ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Monitoring: <span className="text-white ml-1">{activeTerm}</span>
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                                    Offline
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="glass p-4 rounded-xl border border-white/5">
                        <div className="text-white/40 text-xs mb-1">Processados</div>
                        <div className="text-2xl font-bold font-mono">{stats.processed}</div>
                    </div>
                    <div className="glass p-4 rounded-xl border border-white/5">
                        <div className="text-white/40 text-xs mb-1">Alto Risco</div>
                        <div className="text-2xl font-bold font-mono text-red-400">{stats.highRisk}</div>
                    </div>
                </div>

                {/* Active Signals Chart Mockup */}
                <div className="glass p-4 rounded-xl border border-white/5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm">Velocidade de Sinais</h3>
                        <Activity size={14} className="text-cyan-400" />
                    </div>
                    <div className="flex-1 flex items-end gap-1 h-32 relative">
                        {/* Fake Bar Chart */}
                        {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-400/80 rounded-t-sm transition-all duration-500"
                                style={{ height: `${isSimulating ? Math.random() * 100 : h}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Feed */}
            <div className="flex-1 flex flex-col max-w-4xl border-r border-white/5">
                {/* Header */}
                <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A1628]/30 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-white/5 rounded-lg px-4 py-2 w-96 border border-white/10 focus-within:border-cyan-500/50 transition-colors">
                        <Search size={16} className="text-white/40" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nome do medicamento (ex: Ozempic, Rivotril, Ritalina)..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20 text-white"
                            onKeyDown={(e) => e.key === 'Enter' && handleStartSimulation()}
                        />
                    </div>

                    <button
                        onClick={isSimulating ? handleStopSimulation : handleStartSimulation}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isSimulating
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                            }`}
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                        {isSimulating ? "Parar" : "Iniciar Monitoramento"}
                    </button>
                </div>

                {/* Feed List */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-4 relative" ref={scrollRef}>
                    {!isSimulating && posts.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-white/30">
                            <Globe size={48} className="mb-4 opacity-50" />
                            <p>Digite o nome de um medicamento e inicie o monitoramento para capturar sinais.</p>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`relative group rounded-2xl p-5 border transition-all hover:border-white/10 ${post.status === "new" ? "bg-[#0F1C2E]/60 border-[#00D9FF]/20" : "bg-[#0A1628]/40 border-white/5"
                                    }`}
                            >
                                {/* Compliance Tag if High Risk */}
                                {post.riskLevel === "critical" || post.riskLevel === "high" ? (
                                    <div className="absolute -top-2 -right-2">
                                        <span className="relative flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                        </span>
                                    </div>
                                ) : null}

                                <div className="flex gap-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.avatar}
                                        alt={post.author}
                                        className="w-12 h-12 rounded-full border border-white/10"
                                    />

                                    <div className="flex-1">
                                        {/* Post Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{post.author}</span>
                                                <span className="text-white/40 text-xs">{post.handle}</span>
                                                <span className="text-lg leading-none opacity-80" title={post.platform}>
                                                    {getPlatformIcon(post.platform)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getRiskColor(post.riskLevel)}`}>
                                                    {post.riskLevel} Risk
                                                </span>
                                                <span className="text-white/20 text-xs">
                                                    Now
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <p className="text-white/80 text-sm leading-relaxed mb-4">
                                            {post.content}
                                        </p>

                                        {/* AI Analysis Box */}
                                        {post.aiAnalysis && (
                                            <div className="bg-[#00D9FF]/5 border border-[#00D9FF]/10 rounded-lg p-3 mb-3 flex items-start gap-3">
                                                <Zap size={16} className="text-[#00D9FF] shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <div className="flex gap-4 text-xs mb-1">
                                                        <span className="text-white/40">Evento Detectado:</span>
                                                        <span className="text-[#00D9FF] font-medium">{post.aiAnalysis.detectedEvent || "None"}</span>
                                                    </div>
                                                    <div className="flex gap-4 text-xs">
                                                        <span className="text-white/40">Medicamento:</span>
                                                        <span className="text-white/80">{post.aiAnalysis.drugMentioned}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Panel / Event Detail Placeholer */}
            <div className="w-[300px] bg-[#0A1628]/30 hidden lg:flex flex-col p-6 border-l border-white/5">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Alertas Recentes</h3>

                <div className="space-y-4">
                    {/* Placeholder static alerts for visual balance */}
                    <div className="flex gap-3 items-start p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                            <AlertTriangle size={14} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white/90">Detecção de Cluster</div>
                            <div className="text-[10px] text-white/50 mb-1">Pico recente de sentimento negativo</div>
                            <div className="text-[10px] text-orange-400">Alta Confiança</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
