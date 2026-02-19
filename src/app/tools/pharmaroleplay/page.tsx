"use client";

import { motion } from "framer-motion";
import { Headset, Mic, CheckCircle2 } from "lucide-react";
import ToolHero from "@/components/tools/ToolHero";
import { getToolConfig } from "@/lib/tools-config";

export default function PharmaRoleplayPage() {
    const tool = getToolConfig("pharmaroleplay");

    return (
        <div className="min-h-screen pt-20 pb-14">
            <ToolHero
                badge={tool.categoryLabel}
                title={tool.headline}
                description={tool.description}
                chips={tool.chips}
                ctaHref={tool.demoHref}
                ctaLabel="Testar Demo"
                imageSrc={tool.heroImage}
                imageAlt="PharmaRoleplay - treinamento por voz"
                accentColor={tool.accent}
                icon={<Headset size={18} />}
                imageFirst
            />

            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="label mb-4" style={{ color: tool.accent }}>Como funciona</p>
                        <h2 className="heading-lg mb-4">Fluxo de Treinamento</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {tool.howItWorks.map((step, idx) => (
                            <motion.article
                                key={step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="glass-card rounded-2xl p-6"
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${tool.accent}1f` }}
                                >
                                    <Mic size={18} style={{ color: tool.accent }} />
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">{step}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <p className="label mb-3" style={{ color: tool.accent }}>Benefícios</p>
                        <h2 className="heading-md">Por que usar o {tool.name}</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {tool.benefits.map((benefit, idx) => (
                            <motion.div
                                key={benefit}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="glass-card rounded-xl p-5"
                            >
                                <CheckCircle2 size={18} className="mb-3" style={{ color: tool.accent }} />
                                <p className="text-sm text-white/75">{benefit}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
