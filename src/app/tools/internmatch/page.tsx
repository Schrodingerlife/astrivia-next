"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    Search,
    Sparkles,
    FileText,
    Target,
    ArrowRight,
    Building2,
    GraduationCap,
    TrendingUp,
    ChevronRight,
} from 'lucide-react';

export default function InternMatchPage() {
    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium border border-[#F59E0B]/20 mb-6">
                            <Users size={16} />
                            Vector Search · Matching Semântico
                        </span>
                        <h1 className="heading-xl mt-6 mb-6">
                            Conecte talentos às melhores<br className="hidden md:block" />
                            <span className="text-[#F59E0B]"> oportunidades</span>
                        </h1>
                        <p className="body-lg max-w-2xl mx-auto mb-8">
                            Matching inteligente entre universitários e vagas de estágio usando IA semântica.
                            Análise de currículo, perfil e competências em tempo real.
                        </p>
                    </motion.div>

                    {/* Demo Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-3xl p-8 max-w-3xl mx-auto"
                    >
                        <div className="space-y-4">
                            {/* Search bar */}
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                                <Search size={18} className="text-white/30" />
                                <span className="text-white/40 text-sm">Buscar vagas em Farmácia, São Paulo...</span>
                                <Sparkles size={16} className="ml-auto text-[#F59E0B]" />
                            </div>

                            {/* Sample matches */}
                            {[
                                { company: "Roche", role: "Estágio em Assuntos Regulatórios", match: 94, tags: ["GMP", "ANVISA", "Inglês"] },
                                { company: "Pfizer", role: "Estágio em Qualidade", match: 87, tags: ["Controle de Qualidade", "HPLC", "Excel"] },
                                { company: "EMS", role: "Estágio em Marketing Pharma", match: 82, tags: ["Marketing", "Digital", "Farma"] },
                            ].map((job, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.15 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#F59E0B]/30 transition-colors cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                                        <Building2 size={18} className="text-[#F59E0B]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{job.role}</p>
                                        <p className="text-xs text-white/40">{job.company}</p>
                                    </div>
                                    <div className="flex gap-1.5 hidden md:flex">
                                        {job.tags.map(t => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{t}</span>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-[#F59E0B]">{job.match}%</p>
                                        <p className="text-[10px] text-white/30">match</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 border-t border-white/[0.04]">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="heading-lg mb-4">Como funciona</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <FileText size={24} />, title: "Upload do CV", desc: "Envie seu currículo e a IA extrai automaticamente suas competências, experiências e formação." },
                            { icon: <Target size={24} />, title: "Matching Semântico", desc: "Algoritmo de Vector Search compara seu perfil com milhares de vagas em tempo real." },
                            { icon: <TrendingUp size={24} />, title: "Ranking Inteligente", desc: "Receba vagas ordenadas por % de match com feedback sobre como melhorar seu perfil." },
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card rounded-2xl p-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] mb-4">
                                    {feat.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                                <p className="text-white/60 text-sm">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 border-t border-white/[0.04]">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium mb-6">
                            <GraduationCap size={14} />
                            Em desenvolvimento
                        </span>
                        <h2 className="heading-lg mb-4">
                            Em breve disponível
                        </h2>
                        <p className="body-lg mb-8">
                            Estamos finalizando as integrações com universidades e empresas parceiras.
                            Deixe seu contato para ser avisado quando lançarmos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact" className="btn-primary">
                                Quero ser avisado <ArrowRight size={16} />
                            </Link>
                            <Link href="/products" className="btn-outline">
                                Ver outros produtos <ChevronRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
