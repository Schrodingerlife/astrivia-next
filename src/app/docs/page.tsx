"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Search, Book, Code, Cpu, FileText, HelpCircle } from "lucide-react";

const sidebarItems = [
    {
        title: "Primeiros Passos",
        icon: <Book size={18} />,
        items: ["Introdução", "Quick Start", "Visão da Arquitetura"],
    },
    {
        title: "Produtos",
        icon: <Cpu size={18} />,
        items: ["PharmaRoleplay", "Social Vigilante", "MedSafe AI", "InternMatch", "SciGen"],
    },
    {
        title: "Tech Stack",
        icon: <Code size={18} />,
        items: ["Vertex AI", "ReAct Framework", "LangChain", "Cloud Run"],
    },
    {
        title: "API Reference",
        icon: <FileText size={18} />,
        items: ["Autenticação", "Endpoints", "Rate Limits", "Erros"],
    },
    {
        title: "FAQ",
        icon: <HelpCircle size={18} />,
        items: ["Geral", "Preços", "Segurança", "Suporte"],
    },
];

const faqs = [
    {
        question: "O que diferencia a Astrivia de outras soluções de IA?",
        answer:
            "Somos especializados em Life Sciences com agentes autônomos que entendem regulação farmacêutica (RDC 96, ANVISA). Nossa IA é grounded em fontes verificáveis com zero alucinação.",
    },
    {
        question: "Como funciona a integração com sistemas existentes?",
        answer:
            "Oferecemos APIs RESTful e integrações pré-construídas para os principais ERPs e CRMs do mercado farmacêutico. O onboarding típico leva 2-4 semanas.",
    },
    {
        question: "Os dados são processados de forma segura?",
        answer:
            "Sim. Todos os dados são processados em infraestrutura Google Cloud no Brasil, com criptografia em trânsito e em repouso. Somos LGPD compliant.",
    },
    {
        question: "Qual o modelo de precificação?",
        answer:
            "Oferecemos planos por uso (pay-as-you-go) e enterprise (volume). Entre em contato para uma proposta personalizada.",
    },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("Introdução");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            {/* Search */}
                            <div className="relative mb-8">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Buscar na documentação..."
                                    className="form-input pl-12 py-3 text-sm"
                                />
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-6">
                                {sidebarItems.map((section) => (
                                    <div key={section.title}>
                                        <div className="flex items-center gap-2 text-white/40 text-sm font-medium mb-2">
                                            {section.icon}
                                            {section.title}
                                        </div>
                                        <ul className="space-y-1 ml-6">
                                            {section.items.map((item) => (
                                                <li key={item}>
                                                    <button
                                                        onClick={() => setActiveSection(item)}
                                                        className={`text-sm transition-colors ${activeSection === item
                                                            ? "text-[#00D9FF]"
                                                            : "text-white/30 hover:text-white/60"
                                                            }`}
                                                    >
                                                        {item}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="label mb-4 text-[#00D9FF]">Docs</p>
                            <h1 className="heading-lg mb-4">Documentação</h1>
                            <p className="body-lg mb-12">
                                Bem-vindo à documentação da Astrivia AI. Aqui você encontra tudo para começar.
                            </p>

                            {/* Getting Started */}
                            <section className="mb-16">
                                <h2 className="heading-md mb-6 flex items-center gap-2">
                                    <Book size={24} className="text-[#00D9FF]" />
                                    Primeiros Passos
                                </h2>

                                <div className="glass-card rounded-2xl p-8">
                                    <h3 className="text-xl font-bold mb-4">Introdução ao Ecossistema</h3>
                                    <p className="text-white/50 mb-6">
                                        A Astrivia AI oferece um ecossistema integrado de agentes autônomos
                                        especializados em operações farmacêuticas. Cada produto resolve um
                                        gargalo específico, e todos se comunicam através do Vertex AI Agent Engine.
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        {["PharmaRoleplay", "Social Vigilante", "MedSafe AI"].map((product) => (
                                            <Link
                                                key={product}
                                                href={`/products#${product.toLowerCase().replace(" ", "")}`}
                                                className="glass-card rounded-xl p-4 flex items-center justify-between"
                                            >
                                                <span className="text-sm">{product}</span>
                                                <ChevronRight size={16} className="text-[#00D9FF]" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* FAQs */}
                            <section>
                                <h2 className="heading-md mb-6 flex items-center gap-2">
                                    <HelpCircle size={24} className="text-[#00D9FF]" />
                                    Perguntas Frequentes
                                </h2>

                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="glass-card rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                                className="w-full p-6 text-left flex items-center justify-between"
                                            >
                                                <span className="font-medium">{faq.question}</span>
                                                <ChevronRight
                                                    size={20}
                                                    className={`text-[#00D9FF] transition-transform ${expandedFaq === index ? "rotate-90" : ""
                                                        }`}
                                                />
                                            </button>
                                            {expandedFaq === index && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="px-6 pb-6"
                                                >
                                                    <p className="text-white/50">{faq.answer}</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
