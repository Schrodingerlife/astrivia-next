"use client";

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
} from "lucide-react";

const platforms = [
    {
        id: "social-vigilante",
        icon: <Globe size={32} />,
        title: "Social Vigilante",
        description: "Farmacovigilância em redes sociais com IA",
        status: "demo",
        href: "/tools/social-vigilante",
        badge: "Demo Disponível",
    },
    {
        id: "pharmaroleplay",
        icon: <Mic size={32} />,
        title: "PharmaRoleplay",
        description: "Treinamento de vendas com IA por voz",
        status: "beta",
        href: "/contact",
        badge: "Solicitar Acesso",
    },
    {
        id: "medsafe",
        icon: <Shield size={32} />,
        title: "MedSafe AI",
        description: "Compliance regulatório automatizado",
        status: "beta",
        href: "/contact",
        badge: "Solicitar Acesso",
    },
    {
        id: "internmatch",
        icon: <Users size={32} />,
        title: "InternMatch",
        description: "Recrutamento inteligente para universitários",
        status: "demo",
        href: "/tools/internmatch",
        badge: "Demo Disponível",
    },
    {
        id: "scigen",
        icon: <FileText size={32} />,
        title: "SciGen",
        description: "Geração de conteúdo científico com IA",
        status: "beta",
        href: "/contact",
        badge: "Solicitar Acesso",
    },
];

export default function PlatformPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm mb-6">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/80">Plataforma SaaS</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Acesse a <span className="text-gradient-cyan">Plataforma</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Escolha o produto que deseja acessar. Alguns estão disponíveis para
                        demonstração, outros requerem credenciais corporativas.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={platform.href}>
                                <div className="glass-card rounded-2xl p-6 h-full hover:border-[#00D9FF]/50 transition-all group cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center text-[#00D9FF]">
                                            {platform.icon}
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${platform.status === "demo"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                                }`}
                                        >
                                            {platform.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#00D9FF] transition-colors">
                                        {platform.title}
                                    </h3>
                                    <p className="text-white/60 mb-4">{platform.description}</p>
                                    <div className="flex items-center gap-2 text-[#00D9FF] text-sm">
                                        {platform.status === "demo" ? (
                                            <>
                                                <ExternalLink size={16} />
                                                <span>Acessar Demo</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={16} />
                                                <span>Requer Login Corporativo</span>
                                            </>
                                        )}
                                        <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Login Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 glass-card rounded-2xl p-8 text-center"
                >
                    <Lock size={48} className="mx-auto text-[#00D9FF] mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Acesso Corporativo</h2>
                    <p className="text-white/60 mb-6 max-w-lg mx-auto">
                        Para acessar todas as funcionalidades da plataforma, entre em contato
                        para obter suas credenciais corporativas.
                    </p>
                    <Link
                        href="/contact"
                        className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2"
                    >
                        Solicitar Credenciais <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
