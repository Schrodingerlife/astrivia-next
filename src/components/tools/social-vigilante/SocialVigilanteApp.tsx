"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    BarChart3,
    Share2,
    MessageSquare,
    ThumbsUp,
    MoreHorizontal,
    Globe,
    Zap
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
        author: "Ana Silva",
        handle: "@ana_s",
        avatar: "https://i.pravatar.cc/150?u=a",
        content: "Tomei o #CardioFix hoje cedo e senti uma tontura muito forte, quase desmaiei no trabalho. Alguém mais teve isso? 😰",
        likes: 12,
        shares: 4,
        sentiment: "negative",
        riskLevel: "high",
        aiAnalysis: {
            detectedEvent: "Tontura, Síncope",
            drugMentioned: "CardioFix",
            complianceFlag: true
        }
    },
    {
        platform: "reddit",
        author: "PharmaGuy99",
        handle: "u/pharmaguy",
        avatar: "https://i.pravatar.cc/150?u=b",
        content: "Review honesto do NeuroCalm: funciona bem para ansiedade, mas tenho notado que minha boca fica muito seca 30min depois de tomar.",
        likes: 45,
        shares: 0,
        sentiment: "neutral",
        riskLevel: "medium",
        aiAnalysis: {
            detectedEvent: "Boca seca (Xerostomia)",
            drugMentioned: "NeuroCalm",
            complianceFlag: true
        }
    },
    {
        platform: "instagram",
        author: "Bella Fitness",
        handle: "@bellafit",
        avatar: "https://i.pravatar.cc/150?u=c",
        content: "Gente, amando os resultados do DermGlow! Minha pele nunca esteve tão radiante ✨ #skincare #dermglow",
        likes: 1205,
        shares: 56,
        sentiment: "positive",
        riskLevel: "low",
        aiAnalysis: {
            detectedEvent: "Eficácia Terapêutica",
            drugMentioned: "DermGlow",
            complianceFlag: false
        }
    },
    {
        platform: "reclameaqui",
        author: "Carlos M.",
        handle: "Cliente",
        avatar: "https://i.pravatar.cc/150?u=d",
        content: "Comprei 3 caixas de FlexiJoint e o lote veio com cheiro estranho. Lote CJ8892. Quero troca imediata.",
        likes: 0,
        shares: 0,
        sentiment: "negative",
        riskLevel: "critical",
        aiAnalysis: {
            detectedEvent: "Desvio de Qualidade",
            drugMentioned: "FlexiJoint",
            complianceFlag: true
        }
    },
    {
        platform: "twitter",
        author: "Dr. João",
        handle: "@drjoao_med",
        avatar: "https://i.pravatar.cc/150?u=e",
        content: "Interessante novo estudo sobre o uso de ImunoBoost em pacientes idosos. Resultados promissores na redução de inflamação.",
        likes: 89,
        shares: 32,
        sentiment: "positive",
        riskLevel: "low",
        aiAnalysis: {
            detectedEvent: "Uso Off-label Potencial",
            drugMentioned: "ImunoBoost",
            complianceFlag: false
        }
    }
];

export default function SocialVigilanteApp() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [stats, setStats] = useState({ highRisk: 0, processed: 0, sources: 0 });
    const [isSimulating, setIsSimulating] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const initialPosts = MOCK_POSTS_POOL.map((p, i) => ({
            ...p,
            id: `init-${i}`,
            timestamp: new Date(Date.now() - i * 1000 * 60 * 30).toISOString(),
            status: "new" as const
        }));
        setPosts(initialPosts);
        setStats({ highRisk: 2, processed: 145, sources: 12 });
    }, []);

    // Simulation Loop
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            const randomPost = MOCK_POSTS_POOL[Math.floor(Math.random() * MOCK_POSTS_POOL.length)];
            const newPost: SocialPost = {
                ...randomPost,
                id: `live-${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: "new"
            };

            setPosts(prev => [newPost, ...prev].slice(0, 50)); // Keep last 50
            setStats(prev => ({
                processed: prev.processed + 1,
                highRisk: randomPost.riskLevel === "high" || randomPost.riskLevel === "critical" ? prev.highRisk + 1 : prev.highRisk,
                sources: prev.sources
            }));
        }, 5000); // New post every 5 seconds

        return () => clearInterval(interval);
    }, [isSimulating]);

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
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Monitoring Live
                        </span>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="glass p-4 rounded-xl border border-white/5">
                        <div className="text-white/40 text-xs mb-1">Processed</div>
                        <div className="text-2xl font-bold font-mono">{stats.processed}</div>
                    </div>
                    <div className="glass p-4 rounded-xl border border-white/5">
                        <div className="text-white/40 text-xs mb-1">High Risk</div>
                        <div className="text-2xl font-bold font-mono text-red-400">{stats.highRisk}</div>
                    </div>
                </div>

                {/* Active Signals Chart Mockup */}
                <div className="glass p-4 rounded-xl border border-white/5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm">Signal Velocity</h3>
                        <Activity size={14} className="text-cyan-400" />
                    </div>
                    <div className="flex-1 flex items-end gap-1 h-32 relative">
                        {/* Fake Bar Chart */}
                        {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-400/80 rounded-t-sm transition-all duration-500"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={() => setIsSimulating(!isSimulating)}
                        className={`w-full py-3 rounded-xl border text-sm font-medium transition-colors ${isSimulating
                                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                            }`}
                    >
                        {isSimulating ? "Stop Simulation" : "Resume Stream"}
                    </button>
                </div>
            </div>

            {/* Main Feed */}
            <div className="flex-1 flex flex-col max-w-4xl border-r border-white/5">
                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A1628]/30 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-white/5 rounded-lg px-4 py-2 w-96">
                        <Search size={16} className="text-white/40" />
                        <input
                            type="text"
                            placeholder="filter keywords, events or drugs..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 transition-colors">
                            <BarChart3 size={18} />
                        </button>
                    </div>
                </div>

                {/* Feed List */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-4 relative" ref={scrollRef}>
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
                                                    {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                                        <span className="text-white/40">Event Detected:</span>
                                                        <span className="text-[#00D9FF] font-medium">{post.aiAnalysis.detectedEvent}</span>
                                                    </div>
                                                    <div className="flex gap-4 text-xs">
                                                        <span className="text-white/40">Product:</span>
                                                        <span className="text-white/80">{post.aiAnalysis.drugMentioned}</span>
                                                    </div>
                                                </div>
                                                <button className="text-xs bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] px-3 py-1.5 rounded transition-colors">
                                                    Escalate
                                                </button>
                                            </div>
                                        )}

                                        {/* Post Footer */}
                                        <div className="flex items-center gap-6 text-white/30 text-xs">
                                            <div className="flex items-center gap-1">
                                                <MessageSquare size={14} /> 2
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Share2 size={14} /> {post.shares}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp size={14} /> {post.likes}
                                            </div>
                                            <div className="ml-auto">
                                                <MoreHorizontal size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Panel / Event Detail Placeholer */}
            <div className="w-[300px] bg-[#0A1628]/30 hidden lg:flex flex-col p-6 border-l border-white/5">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Recent Alerts</h3>

                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 items-start p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                                <AlertTriangle size={14} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white/90">Cluster Detection</div>
                                <div className="text-[10px] text-white/50 mb-1">Sudden spike in "CardioFix" mentions</div>
                                <div className="text-[10px] text-orange-400">High Confidence (94%)</div>
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-3 items-start p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                            <CheckCircle size={14} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white/90">Report Submitted</div>
                            <div className="text-[10px] text-white/50 mb-1">Case #8829 sent to ANVISA</div>
                            <div className="text-[10px] text-green-400">Success</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
