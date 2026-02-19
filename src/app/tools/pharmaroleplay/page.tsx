"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import ToolShowcaseHero from '@/components/tools/ToolShowcaseHero';
import {
    Mic,
    Brain,
    BarChart3,
    Award,
    ChevronRight,
    Play,
    History,
    GraduationCap,
    Headset
} from 'lucide-react';

export default function PharmaRoleplayPage() {
    return (
        <div className="min-h-screen pt-20">
                <ToolShowcaseHero
                    badge="Treinamento por Voz"
                    title="Treine vendas por voz com um Médico IA"
                    description="Simulador de conversas que treina representantes farmacêuticos com feedback em tempo real sobre tom, argumentação e eficácia. Como um sparring partner que nunca cansa."
                    metrics={["Ramp-up 50% mais rápido", "<200ms latência", "24/7 disponível"]}
                    ctaHref="/tools/pharmaroleplay/training"
                    ctaLabel="Testar Demo"
                    imageSrc="/images/product-pharmaroleplay.png"
                    imageAlt="PharmaRoleplay - treinamento por voz com médico IA"
                    accentColor="#00D9FF"
                    icon={<Headset size={18} />}
                    imageFirst
                />

                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-white mb-4">Como funciona</h2>
                            <p className="text-white/40 max-w-xl mx-auto">
                                Treinamento imersivo com IA que simula cenários reais de vendas farmacêuticas
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Mic, title: 'Conversação por Voz', description: 'Fale naturalmente em português com um médico IA que responde em tempo real.', color: '#00D9FF' },
                                { icon: Brain, title: 'Feedback Inteligente', description: 'Receba análise instantânea de tom, argumentação e gestão de objeções.', color: '#A855F7' },
                                { icon: Award, title: 'Certificação', description: 'Complete cenários com score acima de 80 e receba certificados de competência.', color: '#00D9FF' },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-6 rounded-xl group"
                                >
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${feature.color}20` }}>
                                        <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                    <p className="text-white/45">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Scenarios Section */}
                <section className="py-20 px-6 bg-white/[0.02]">
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-white mb-4">Cenários de Treinamento</h2>
                            <p className="text-white/40 max-w-xl mx-auto">
                                Pratique situações reais que representantes enfrentam no dia a dia
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Objeção de Preço', description: 'O médico questiona o custo elevado comparado às alternativas.', difficulty: 'Média', duration: '10 min' },
                                { title: 'Dúvida sobre Eficácia', description: 'Convença com dados científicos e estudos clínicos.', difficulty: 'Alta', duration: '15 min' },
                                { title: 'Comparação com Concorrente', description: 'Diferencie seu produto da concorrência estabelecida.', difficulty: 'Alta', duration: '15 min' },
                                { title: 'Primeiro Contato', description: 'Conquiste atenção de um médico ocupado e resistente.', difficulty: 'Média', duration: '10 min' },
                            ].map((scenario, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card rounded-xl p-6 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{scenario.title}</h3>
                                        <p className="text-white/40 text-sm mb-3">{scenario.description}</p>
                                        <div className="flex gap-3">
                                            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                                                {scenario.difficulty}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-[#00D9FF]/20 text-[#00D9FF]">
                                                {scenario.duration}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-[#00D9FF] group-hover:translate-x-1 transition-all" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/tools/pharmaroleplay/training">
                                <button className="btn-primary px-8 py-3.5 rounded-xl inline-flex items-center gap-2">
                                    Ver Todos os Cenários
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Quick Navigation */}
                <section className="py-16 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/tools/pharmaroleplay/dashboard" className="glass-card p-6 rounded-xl text-center hover:border-[#00D9FF]/30 transition-all group">
                                <BarChart3 className="w-8 h-8 text-[#00D9FF] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-white mb-1">Dashboard</h3>
                                <p className="text-sm text-white/40">Veja suas estatísticas</p>
                            </Link>
                            <Link href="/tools/pharmaroleplay/history" className="glass-card p-6 rounded-xl text-center hover:border-purple-500/30 transition-all group">
                                <History className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-white mb-1">Histórico</h3>
                                <p className="text-sm text-white/40">Sessões anteriores</p>
                            </Link>
                            <Link href="/tools/pharmaroleplay/training" className="glass-card p-6 rounded-xl text-center hover:border-green-500/30 transition-all group">
                                <GraduationCap className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-white mb-1">Treinamento</h3>
                                <p className="text-sm text-white/40">Iniciar nova sessão</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="glass-card text-center p-12 rounded-xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/10 to-purple-500/10" />
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Pronto para treinar como um profissional?
                                </h2>
                                <p className="text-white/40 mb-8 max-w-xl mx-auto">
                                    Abandone PDFs de 100 páginas. Aprenda com conversas reais.
                                </p>
                                <Link href="/tools/pharmaroleplay/training">
                                    <button className="btn-primary px-8 py-3.5 rounded-xl text-lg inline-flex items-center gap-2">
                                        <Mic className="w-5 h-5" />
                                        Começar Agora - Gratuito
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
    );
}
