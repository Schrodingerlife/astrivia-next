"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { auth, db, googleProvider, ADMIN_EMAILS } from "@/lib/firebase";
import { Save, LogOut, Plus, Trash2, Loader2, Shield, AlertCircle } from "lucide-react";

interface TeamMember {
    id?: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    experience: string[];
    quote: string;
    linkedin: string;
}

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser && ADMIN_EMAILS.includes(currentUser.email || "")) {
                loadTeam();
            }
        });
        return () => unsubscribe();
    }, []);

    const loadTeam = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "team"));
            const teamData: TeamMember[] = [];
            querySnapshot.forEach((doc) => {
                teamData.push({ id: doc.id, ...doc.data() } as TeamMember);
            });

            // Se não houver dados no Firestore, carregar dados iniciais
            if (teamData.length === 0) {
                const initialTeam = [
                    {
                        name: "Nícollas Braga",
                        role: "CEO & Founder",
                        image: "/images/team-nicollas.jpg",
                        bio: "Liderança em Marketing de Doenças Raras em Big Pharma. Farmácia-USP. Especialista em estratégias de go-to-market para medicamentos de alto custo e baixa prevalência.",
                        experience: ["Big Pharma", "Doenças Raras", "Marketing", "Farmácia-USP"],
                        quote: "A inovação em saúde precisa de velocidade sem comprometer segurança.",
                        linkedin: "https://www.linkedin.com/in/nicollas-souza-788987256/",
                    },
                    {
                        name: "André Guilherme",
                        role: "CSO",
                        image: "/images/team-andre.jpg",
                        bio: "Ex-Marketing Sanofi. Estratégia B2B e Finanças. Farmácia-USP. Experiência em construção de modelos de negócio e precificação para mercado farmacêutico.",
                        experience: ["Sanofi", "B2B Strategy", "Finanças", "Farmácia-USP"],
                        quote: "Dados e estratégia caminham juntos na indústria farmacêutica.",
                        linkedin: "https://www.linkedin.com/in/andretobiasmendes/",
                    },
                    {
                        name: "Gabriel Katakura",
                        role: "CCO",
                        image: "/images/team-gabriel.jpg",
                        bio: "Qualidade na Boston Scientific. Validação Regulatória. Farmácia-USP. Background em garantia de qualidade e compliance para dispositivos médicos.",
                        experience: ["Boston Scientific", "Qualidade", "Regulatório", "Farmácia-USP"],
                        quote: "Compliance não é obstáculo, é vantagem competitiva.",
                        linkedin: "https://www.linkedin.com/in/gkatakura/",
                    },
                ];
                setTeam(initialTeam);
            } else {
                setTeam(teamData);
            }
        } catch (error) {
            console.error("Error loading team:", error);
            setMessage({ type: "error", text: "Erro ao carregar dados do time" });
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
        setTeam([]);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Primeiro, deletar todos os documentos existentes
            const querySnapshot = await getDocs(collection(db, "team"));
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // Depois, adicionar todos os membros atualizados
            const addPromises = team.map(member => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _id, ...memberData } = member;
                return addDoc(collection(db, "team"), memberData);
            });
            await Promise.all(addPromises);

            setMessage({ type: "success", text: "Dados salvos com sucesso!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Save error:", error);
            setMessage({ type: "error", text: "Erro ao salvar dados" });
        }
        setSaving(false);
    };

    const updateMember = (index: number, field: keyof TeamMember, value: string | string[]) => {
        const newTeam = [...team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setTeam(newTeam);
    };

    const addMember = () => {
        setTeam([...team, {
            name: "",
            role: "",
            image: "/images/team-new.jpg",
            bio: "",
            experience: [],
            quote: "",
            linkedin: "",
        }]);
    };

    const removeMember = (index: number) => {
        setTeam(team.filter((_, i) => i !== index));
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
                    <button
                        onClick={handleLogin}
                        className="btn-primary w-full py-4 rounded-xl text-lg"
                    >
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
                    <p className="text-white/60 mb-4">Seu email não está autorizado a acessar este painel.</p>
                    <p className="text-white/40 text-sm mb-8">{user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="btn-outline w-full py-3 rounded-xl"
                    >
                        Sair
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A1628] pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Painel Admin</h1>
                        <p className="text-white/60">{user.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Salvar
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn-outline px-4 py-3 rounded-xl"
                        >
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

                {/* Team Section */}
                <div className="glass-card rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Time</h2>
                        <button
                            onClick={addMember}
                            className="btn-outline px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" /> Adicionar Membro
                        </button>
                    </div>

                    <div className="space-y-6">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white/5 rounded-xl p-6 relative">
                                <button
                                    onClick={() => removeMember(index)}
                                    className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Nome</label>
                                        <input
                                            type="text"
                                            value={member.name}
                                            onChange={(e) => updateMember(index, "name", e.target.value)}
                                            className="form-input w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Cargo</label>
                                        <input
                                            type="text"
                                            value={member.role}
                                            onChange={(e) => updateMember(index, "role", e.target.value)}
                                            className="form-input w-full"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-white/60 mb-1">LinkedIn URL</label>
                                        <input
                                            type="text"
                                            value={member.linkedin}
                                            onChange={(e) => updateMember(index, "linkedin", e.target.value)}
                                            className="form-input w-full"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-white/60 mb-1">Bio</label>
                                        <textarea
                                            value={member.bio}
                                            onChange={(e) => updateMember(index, "bio", e.target.value)}
                                            className="form-input w-full resize-none"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-white/60 mb-1">Citação</label>
                                        <input
                                            type="text"
                                            value={member.quote}
                                            onChange={(e) => updateMember(index, "quote", e.target.value)}
                                            className="form-input w-full"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-white/60 mb-1">Experiência (separar por vírgula)</label>
                                        <input
                                            type="text"
                                            value={member.experience.join(", ")}
                                            onChange={(e) => updateMember(index, "experience", e.target.value.split(", "))}
                                            className="form-input w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">URL da Imagem</label>
                                        <input
                                            type="text"
                                            value={member.image}
                                            onChange={(e) => updateMember(index, "image", e.target.value)}
                                            className="form-input w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Help */}
                <div className="text-center text-white/40 text-sm">
                    <p>Após salvar, as alterações aparecem imediatamente na página <a href="/team" className="text-[#00D9FF] hover:underline">/team</a></p>
                </div>
            </div>
        </div>
    );
}
