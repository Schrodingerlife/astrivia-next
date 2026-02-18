"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, ADMIN_EMAILS } from "@/lib/firebase";
import { Save, LogOut, Loader2, Shield, AlertCircle, Users, Home, Package } from "lucide-react";

// Types
interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    experience: string[];
    quote: string;
    linkedin: string;
}

interface Product {
    id: string;
    title: string;
    category: string;
    badge: string;
    description: string;
    benefits: string[];
}

interface HomeContent {
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    stats: { value: string; prefix: string; suffix: string; label: string }[];
}

interface SiteContent {
    team: TeamMember[];
    products: Product[];
    home: HomeContent;
}

const defaultContent: SiteContent = {
    team: [
        {
            name: "Nícollas Braga",
            role: "CEO & Founder",
            image: "/images/team-nicollas.jpg",
            bio: "Liderança em Marketing de Doenças Raras em Big Pharma. Farmácia-USP.",
            experience: ["Big Pharma", "Doenças Raras", "Marketing", "Farmácia-USP"],
            quote: "A inovação em saúde precisa de velocidade sem comprometer segurança.",
            linkedin: "https://www.linkedin.com/in/nicollas-souza-788987256/",
        },
        {
            name: "André Guilherme",
            role: "CSO",
            image: "/images/team-andre.jpg",
            bio: "Ex-Marketing Sanofi. Estratégia B2B e Finanças. Farmácia-USP.",
            experience: ["Sanofi", "B2B Strategy", "Finanças", "Farmácia-USP"],
            quote: "Dados e estratégia caminham juntos na indústria farmacêutica.",
            linkedin: "https://www.linkedin.com/in/andretobiasmendes/",
        },
        {
            name: "Gabriel Katakura",
            role: "CCO",
            image: "/images/team-gabriel.jpg",
            bio: "Qualidade na Boston Scientific. Validação Regulatória. Farmácia-USP.",
            experience: ["Boston Scientific", "Qualidade", "Regulatório", "Farmácia-USP"],
            quote: "Compliance não é obstáculo, é vantagem competitiva.",
            linkedin: "https://www.linkedin.com/in/gkatakura/",
        },
    ],
    products: [
        { id: "pharmaroleplay", title: "PharmaRoleplay", category: "High-Compute Training", badge: "Google Cloud TPU", description: "Treinamento de vendas com IA por voz em tempo real.", benefits: ["Avaliação objetiva e consistente", "Feedback instantâneo pós-simulação"] },
        { id: "vigilante", title: "Social Vigilante", category: "Pharmacovigilance", badge: "BigQuery ML", description: "Farmacovigilância em escala de terabytes.", benefits: ["Detecção antes dos canais oficiais", "Cobertura 100% das menções públicas"] },
        { id: "medsafe", title: "MedSafe AI", category: "Regulatory Compliance", badge: "Vertex AI Search", description: "Conformidade com zero alucinação.", benefits: ["Redução de 95% no tempo de revisão", "Zero falsos positivos"] },
        { id: "internmatch", title: "InternMatch", category: "Talent Matching", badge: "Vector Search", description: "Recrutamento inteligente para talentos farmacêuticos.", benefits: ["80% menos tempo em triagem", "Candidatos mais qualificados"] },
        { id: "scigen", title: "SciGen", category: "Content Generation", badge: "Gemini 3", description: "Transformação de estudos clínicos em conteúdo acessível.", benefits: ["Conteúdo em horas", "100% baseado em evidências"] },
    ],
    home: {
        heroTitle: "O Primeiro",
        heroHighlight: "Sistema Operacional",
        heroSubtitle: "de Agentes Autônomos para Life Sciences",
        stats: [
            { value: "1.5", prefix: "US$", suffix: " Tri", label: "Mercado Farmacêutico Global" },
            { value: "60", suffix: "% Faster", prefix: "", label: "Aceleração Time-to-Market" },
            { value: "20", prefix: "US$", suffix: " Bi+", label: "Investimento LatAm Marketing" },
        ],
    },
};

const tabs = [
    { id: "team", label: "Time", icon: Users },
    { id: "home", label: "Home", icon: Home },
    { id: "products", label: "Produtos", icon: Package },
];

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("team");
    const [content, setContent] = useState<SiteContent>(defaultContent);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser && ADMIN_EMAILS.includes(currentUser.email || "")) {
                loadContent();
            }
        });
        return () => unsubscribe();
    }, []);

    const loadContent = async () => {
        try {
            // Load team
            const teamSnapshot = await getDocs(collection(db, "team"));
            if (!teamSnapshot.empty) {
                const teamData: TeamMember[] = [];
                teamSnapshot.forEach((doc) => teamData.push(doc.data() as TeamMember));
                setContent(prev => ({ ...prev, team: teamData }));
            }

            // Load products
            const productsSnapshot = await getDocs(collection(db, "products"));
            if (!productsSnapshot.empty) {
                const productsData: Product[] = [];
                productsSnapshot.forEach((doc) => productsData.push({ id: doc.id, ...doc.data() } as Product));
                setContent(prev => ({ ...prev, products: productsData }));
            }

            // Load home content
            const homeDoc = await getDocs(collection(db, "settings"));
            homeDoc.forEach((doc) => {
                if (doc.id === "home") {
                    setContent(prev => ({ ...prev, home: doc.data() as HomeContent }));
                }
            });
        } catch (error) {
            console.error("Error loading content:", error);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login error:", error);
            setMessage({ type: "error", text: "Erro ao fazer login" });
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save team
            for (let i = 0; i < content.team.length; i++) {
                await setDoc(doc(db, "team", `member-${i}`), content.team[i]);
            }

            // Save products
            for (const product of content.products) {
                await setDoc(doc(db, "products", product.id), product);
            }

            // Save home content
            await setDoc(doc(db, "settings", "home"), content.home);

            setMessage({ type: "success", text: "Todas as alterações foram salvas!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Save error:", error);
            setMessage({ type: "error", text: "Erro ao salvar. Verifique as regras do Firestore." });
        }
        setSaving(false);
    };

    const updateTeamMember = (index: number, field: keyof TeamMember, value: string | string[]) => {
        const newTeam = [...content.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setContent({ ...content, team: newTeam });
    };

    const updateProduct = (index: number, field: keyof Product, value: string | string[]) => {
        const newProducts = [...content.products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setContent({ ...content, products: newProducts });
    };

    const updateHome = (field: keyof HomeContent, value: HomeContent[keyof HomeContent]) => {
        setContent({ ...content, home: { ...content.home, [field]: value } });
    };

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...content.home.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setContent({ ...content, home: { ...content.home, stats: newStats } });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#00D9FF]" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-6">
                <div className="glass-card rounded-3xl p-12 text-center max-w-md">
                    <Shield className="w-16 h-16 text-[#00D9FF] mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Admin Astrivia</h1>
                    <p className="text-white/60 mb-8">Faça login com sua conta Google para acessar o painel administrativo.</p>
                    <button onClick={handleLogin} className="btn-primary w-full py-4 rounded-xl text-lg">
                        <span className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Login com Google
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    if (!ADMIN_EMAILS.includes(user.email || "")) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-6">
                <div className="glass-card rounded-3xl p-12 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
                    <p className="text-white/60 mb-4">Email não autorizado: {user.email}</p>
                    <button onClick={handleLogout} className="btn-outline w-full py-3 rounded-xl">Sair</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A1628] pt-24 pb-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Painel Admin</h1>
                        <p className="text-white/60">{user.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Salvar Tudo
                        </button>
                        <button onClick={handleLogout} className="btn-outline px-4 py-3 rounded-xl">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-[#00D9FF] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Team Tab */}
                {activeTab === "team" && (
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Membros do Time</h2>
                        <div className="space-y-6">
                            {content.team.map((member, index) => (
                                <div key={index} className="bg-white/5 rounded-xl p-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Nome</label>
                                            <input type="text" value={member.name} onChange={(e) => updateTeamMember(index, "name", e.target.value)} className="form-input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Cargo</label>
                                            <input type="text" value={member.role} onChange={(e) => updateTeamMember(index, "role", e.target.value)} className="form-input w-full" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-white/60 mb-1">LinkedIn</label>
                                            <input type="text" value={member.linkedin} onChange={(e) => updateTeamMember(index, "linkedin", e.target.value)} className="form-input w-full" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-white/60 mb-1">Bio</label>
                                            <textarea value={member.bio} onChange={(e) => updateTeamMember(index, "bio", e.target.value)} className="form-input w-full resize-none" rows={2} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-white/60 mb-1">Citação</label>
                                            <input type="text" value={member.quote} onChange={(e) => updateTeamMember(index, "quote", e.target.value)} className="form-input w-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Home Tab */}
                {activeTab === "home" && (
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Conteúdo da Home</h2>

                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="font-bold mb-4">Hero Section</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Título (parte 1)</label>
                                        <input type="text" value={content.home.heroTitle} onChange={(e) => updateHome("heroTitle", e.target.value)} className="form-input w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Destaque (colorido)</label>
                                        <input type="text" value={content.home.heroHighlight} onChange={(e) => updateHome("heroHighlight", e.target.value)} className="form-input w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Subtítulo</label>
                                        <input type="text" value={content.home.heroSubtitle} onChange={(e) => updateHome("heroSubtitle", e.target.value)} className="form-input w-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="font-bold mb-4">Estatísticas</h3>
                                <div className="space-y-4">
                                    {content.home.stats.map((stat, index) => (
                                        <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Prefixo</label>
                                                <input type="text" value={stat.prefix} onChange={(e) => updateStat(index, "prefix", e.target.value)} className="form-input w-full" placeholder="US$" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Valor</label>
                                                <input type="text" value={stat.value} onChange={(e) => updateStat(index, "value", e.target.value)} className="form-input w-full" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Sufixo</label>
                                                <input type="text" value={stat.suffix} onChange={(e) => updateStat(index, "suffix", e.target.value)} className="form-input w-full" placeholder=" Tri" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Label</label>
                                                <input type="text" value={stat.label} onChange={(e) => updateStat(index, "label", e.target.value)} className="form-input w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Produtos</h2>
                        <div className="space-y-6">
                            {content.products.map((product, index) => (
                                <div key={product.id} className="bg-white/5 rounded-xl p-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Título</label>
                                            <input type="text" value={product.title} onChange={(e) => updateProduct(index, "title", e.target.value)} className="form-input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Categoria</label>
                                            <input type="text" value={product.category} onChange={(e) => updateProduct(index, "category", e.target.value)} className="form-input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Badge</label>
                                            <input type="text" value={product.badge} onChange={(e) => updateProduct(index, "badge", e.target.value)} className="form-input w-full" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-white/60 mb-1">Descrição</label>
                                            <textarea value={product.description} onChange={(e) => updateProduct(index, "description", e.target.value)} className="form-input w-full resize-none" rows={2} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-white/60 mb-1">Benefícios (separar por vírgula)</label>
                                            <input type="text" value={product.benefits.join(", ")} onChange={(e) => updateProduct(index, "benefits", e.target.value.split(", "))} className="form-input w-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Help */}
                <div className="text-center text-white/40 text-sm mt-8">
                    <p>Clique em &quot;Salvar Tudo&quot; para aplicar as alterações em todas as seções</p>
                </div>
            </div>
        </div>
    );
}
