"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Mic,
    Globe,
    Shield,
    Users,
    FileText,
    ExternalLink,
    Lock,
    ArrowRight,
    Loader2,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const platforms = [
    {
        id: "social-vigilante",
        icon: <Globe size={32} />,
        title: "Social Vigilante",
        description: "Farmacovigilância em redes sociais com IA",
        status: "demo",
        href: "/tools/social-vigilante",
        badge: "Demo Disponível",
        color: "#A855F7",
    },
    {
        id: "pharmaroleplay",
        icon: <Mic size={32} />,
        title: "PharmaRoleplay",
        description: "Treinamento de vendas com IA por voz",
        status: "demo",
        href: "/tools/pharmaroleplay",
        badge: "Demo Disponível",
        color: "#00D9FF",
    },
    {
        id: "medsafe",
        icon: <Shield size={32} />,
        title: "MedSafe AI",
        description: "Compliance regulatório automatizado",
        status: "demo",
        href: "/tools/medsafe",
        badge: "Demo Disponível",
        color: "#10B981",
    },
    {
        id: "internmatch",
        icon: <Users size={32} />,
        title: "InternMatch",
        description: "Recrutamento inteligente para universitários",
        status: "beta",
        href: "/contact",
        badge: "Em Breve",
        color: "#F59E0B",
    },
    {
        id: "scigen",
        icon: <FileText size={32} />,
        title: "SciGen",
        description: "Geração de conteúdo científico com IA",
        status: "beta",
        href: "/contact",
        badge: "Em Breve",
        color: "#EC4899",
    },
];

export default function PlatformPage() {
    const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
        } catch (err: any) {
            setError(
                err.code === "auth/invalid-credential"
                    ? "Email ou senha incorretos"
                    : err.code === "auth/email-already-in-use"
                    ? "Email já cadastrado"
                    : err.code === "auth/weak-password"
                    ? "Senha deve ter no mínimo 6 caracteres"
                    : "Erro ao autenticar. Tente novamente."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setSubmitting(true);
        try {
            await signInWithGoogle();
        } catch {
            setError("Erro ao autenticar com Google. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#00D9FF]" />
            </div>
        );
    }

    // Login screen
    if (!user) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="max-w-md mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm mb-6">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-white/50">Plataforma SaaS</span>
                        </div>
                        <h1 className="heading-lg mb-3">
                            {isLogin ? "Entrar na" : "Criar Conta na"}{" "}
                            <span className="text-gradient-cyan">Plataforma</span>
                        </h1>
                        <p className="body-lg">
                            {isLogin
                                ? "Acesse sua conta para usar nossos produtos"
                                : "Crie sua conta e comece a usar nossos produtos"}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full btn-primary py-3 justify-center"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isLogin ? (
                                    "Entrar"
                                ) : (
                                    "Criar Conta"
                                )}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.08]" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[var(--bg-card)] text-white/30">ou</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={submitting}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-white">Continuar com Google</span>
                        </button>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError("");
                                }}
                                className="text-white/40 hover:text-[#00D9FF] transition-colors text-sm"
                            >
                                {isLogin
                                    ? "Não tem conta? Criar conta"
                                    : "Já tem conta? Entrar"}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-center text-white/30 text-sm"
                    >
                        <p>
                            Ao criar uma conta, você concorda com nossos{" "}
                            <Link href="/docs" className="text-[#00D9FF] hover:underline">
                                Termos de Uso
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Authenticated platform
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
                {/* User header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#A855F7] flex items-center justify-center text-white font-bold text-lg">
                                {user.displayName?.[0]?.toUpperCase() ||
                                    user.email?.[0]?.toUpperCase() ||
                                    "U"}
                            </div>
                            <div>
                                <p className="text-white font-medium">
                                    {user.displayName || "Usuário"}
                                </p>
                                <p className="text-white/40 text-sm">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-white/60"
                        >
                            <LogOut size={18} />
                            <span>Sair</span>
                        </button>
                    </div>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-12"
                >
                    <p className="label mb-4 text-[#00D9FF]">Plataforma</p>
                    <h1 className="heading-lg mb-4">
                        Seus <span className="text-gradient-cyan">Produtos</span>
                    </h1>
                    <p className="body-lg max-w-2xl mx-auto">
                        Escolha o produto que deseja acessar. Algumas demos estão disponíveis
                        gratuitamente.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.08 }}
                        >
                            <Link href={platform.href}>
                                <div className="glass-card rounded-2xl p-6 h-full group cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                                            style={{ background: `${platform.color}12`, color: platform.color }}
                                        >
                                            {platform.icon}
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                platform.status === "demo"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                        >
                                            {platform.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                                        {platform.title}
                                    </h3>
                                    <p className="text-white/40 mb-4 text-sm">{platform.description}</p>
                                    <div className="flex items-center gap-2 text-sm" style={{ color: platform.color }}>
                                        {platform.status === "demo" ? (
                                            <>
                                                <ExternalLink size={16} />
                                                <span>Acessar Demo</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={16} />
                                                <span>Em Breve</span>
                                            </>
                                        )}
                                        <ArrowRight
                                            size={16}
                                            className="ml-auto group-hover:translate-x-1 transition-transform"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
