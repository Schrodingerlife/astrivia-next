"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const techStack = [
    { name: "Vertex AI Agent Engine", description: "Orquestração de agentes autônomos" },
    { name: "ReAct Framework", description: "Reasoning + Action + Observation cycle" },
    { name: "LangChain", description: "Composição de pipelines de LLM" },
    { name: "Cloud Run", description: "Deploy serverless escalável" },
    { name: "Cloud Build", description: "CI/CD para agentes" },
    { name: "BigQuery ML", description: "Machine learning em escala de terabytes" },
    { name: "TPU v5e", description: "Inferência de alta performance" },
    { name: "Imagen 3", description: "Geração e edição de imagens" },
    { name: "Gemini Pro", description: "LLM multimodal de última geração" },
];

const tabs = [
    {
        name: "ReAct Framework",
        content: (
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-gradient-cyan">
                    Reasoning → Action → Observation
                </h3>
                <p className="text-white/70 max-w-2xl mx-auto">
                    Nossos agentes seguem o ciclo ReAct do Google DeepMind: raciocinam sobre o problema,
                    executam uma ação, observam o resultado e iteram até a solução. Isso permite
                    comportamento adaptativo e resolução de problemas complexos.
                </p>
                <div className="flex justify-center gap-8 mt-8">
                    {["Raciocínio", "Ação", "Observação"].map((step, i) => (
                        <div key={step} className="text-center">
                            <div className="w-16 h-16 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl font-bold text-[#00D9FF]">{i + 1}</span>
                            </div>
                            <p className="text-white/80 font-medium">{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        name: "AgentOps Pipeline",
        content: (
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-gradient-cyan">
                    Code → Build → Test → Deploy
                </h3>
                <p className="text-white/70 max-w-2xl mx-auto">
                    Pipeline CI/CD completo para agentes. Cada mudança passa por validação de trajetórias,
                    testes de integração e deploy automático no Cloud Run. Rollback instantâneo se necessário.
                </p>
                <div className="grid grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
                    {[
                        { name: "Code", desc: "ReAct + LangChain" },
                        { name: "Build", desc: "Cloud Build" },
                        { name: "Test", desc: "Trajectory Validation" },
                        { name: "Deploy", desc: "Cloud Run" },
                    ].map((stage) => (
                        <div key={stage.name} className="glass rounded-xl p-4 text-center">
                            <p className="text-[#00D9FF] font-bold">{stage.name}</p>
                            <p className="text-white/50 text-xs mt-1">{stage.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        name: "Tech Stack",
        content: (
            <div>
                <h3 className="text-2xl font-bold mb-6 text-center text-gradient-cyan">
                    Powered by Google Cloud
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    {techStack.map((tech) => (
                        <div key={tech.name} className="glass rounded-xl p-4 text-center group hover:border-[#00D9FF]/40 transition-colors">
                            <p className="text-white font-medium text-sm">{tech.name}</p>
                            <p className="text-white/40 text-xs mt-1">{tech.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
];

export default function TechnologyPage() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-16 px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Arquitetura <span className="text-gradient-cyan">Técnica</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 text-lg max-w-2xl mx-auto"
                >
                    Powered by Google Cloud & Vertex AI Agent Engine
                </motion.p>
            </section>

            {/* AgentOps Diagram */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src="/images/architecture-agentops.jpeg"
                            alt="AgentOps Pipeline"
                            width={1400}
                            height={600}
                            className="w-full rounded-3xl shadow-2xl"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Tabs */}
            <section className="py-16 px-6 bg-[#0D1B2A]">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab.name}
                                className={`tab-button ${activeTab === i ? "active" : ""}`}
                                onClick={() => setActiveTab(i)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-8"
                    >
                        {tabs[activeTab].content}
                    </motion.div>
                </div>
            </section>

            {/* Security & Compliance */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        Segurança & Compliance
                    </motion.h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Zero Hallucination",
                                desc: "Grounding em fontes verificáveis",
                            },
                            {
                                title: "Auditoria Completa",
                                desc: "Log de todas as decisões de agentes",
                            },
                            {
                                title: "RDC 96 Compliance",
                                desc: "Treinamento na legislação ANVISA",
                            },
                            {
                                title: "LGPD Compliant",
                                desc: "Dados processados no Brasil",
                            },
                        ].map((item) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass-card rounded-xl p-6 text-center"
                            >
                                <h3 className="text-lg font-bold text-[#10B981] mb-2">{item.title}</h3>
                                <p className="text-white/50 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Performance */}
            <section className="py-24 px-6 bg-[#0D1B2A]">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        Performance Metrics
                    </motion.h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { value: "<200ms", label: "Latência PharmaRoleplay" },
                            { value: "TB/dia", label: "Dados processados" },
                            { value: "99.9%", label: "Uptime garantido" },
                            { value: "100%", label: "Rastreabilidade" },
                        ].map((stat) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="glass-card rounded-xl p-6 text-center"
                            >
                                <p className="text-3xl font-bold neon-number mb-2">{stat.value}</p>
                                <p className="text-white/50 text-sm">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
