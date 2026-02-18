"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Mic,
    Brain,
    BarChart3,
    Award,
    ChevronRight,
    Play,
    Sparkles,
    History,
    GraduationCap
} from 'lucide-react';

export default function PharmaRoleplayPage() {
    return (
        <div className="min-h-screen pt-20">
                {/* Hero Section */}
                <section className="relative py-20 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/5 via-transparent to-purple-500/5" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                    <div className="container mx-auto max-w-6xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] text-sm">
                                    <Sparkles className="w-4 h-4" />
                                    Powered by Google Cloud TPU & Gemini
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                                <span className="text-white">Treine vendas com</span>
                                <br />
                                <span className="bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">Médicos IA</span>
                            </h1>

                            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-8">
                                Simulador de conversas por voz que treina representantes farmacêuticos
                                com feedback em tempo real sobre tom, argumentação e eficácia.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/tools/pharmaroleplay/training">
                                    <button className="btn-primary px-8 py-3.5 rounded-xl text-lg inline-flex items-center gap-2">
                                        <Play className="w-5 h-5" />
                                        Iniciar Treinamento
                                    </button>
                                </Link>
                                <Link href="/tools/pharmaroleplay/dashboard">
                                    <button className="border border-white/10 text-white hover:bg-white/5 px-8 py-3.5 rounded-xl text-lg inline-flex items-center gap-2 transition-colors">
                                        <BarChart3 className="w-5 h-5" />
                                        Ver Dashboard
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Demo Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-16"
                        >
                            <div className="glass-card p-8 max-w-4xl mx-auto rounded-xl">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-xl">
                                        <div className="flex items-end gap-1 h-20 mb-4">
                                            {[...Array(8)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2 rounded-full bg-gradient-to-t from-[#00D9FF] to-purple-500"
                                                    animate={{ height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-white/40 text-sm">Fale naturalmente com o médico IA</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-purple-500/20 rounded-lg p-4 mr-8">
                                            <p className="text-xs text-purple-300 mb-1">Dr. IA - Cardiologista</p>
                                            <p className="text-white text-sm">
                                                &quot;Interessante, mas por que eu deveria trocar o que já funciona?&quot;
                                            </p>
                                        </div>
                                        <div className="bg-[#00D9FF]/20 rounded-lg p-4 ml-8">
                                            <p className="text-xs text-[#00D9FF] mb-1">Você</p>
                                            <p className="text-white text-sm">
                                                &quot;Excelente pergunta, Dr. Os dados do estudo PIONEER mostram...&quot;
                                            </p>
                                        </div>
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                            <p className="text-green-400 text-sm">
                                                ✅ Ótimo uso de referência científica!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

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
