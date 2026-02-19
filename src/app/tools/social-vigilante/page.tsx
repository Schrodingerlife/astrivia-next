"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, Radar } from "lucide-react";
import ToolHero from "@/components/tools/ToolHero";
import { getToolConfig } from "@/lib/tools-config";

export default function SocialVigilantePage() {
    const tool = getToolConfig("social-vigilante");

    return (
        <div className="min-h-screen bg-[#050B14] pt-20 pb-14">
            <ToolHero
                badge={tool.categoryLabel}
                title={tool.headline}
                description={tool.description}
                chips={tool.chips}
                ctaHref={tool.demoHref}
                ctaLabel="Iniciar Demo"
                imageSrc={tool.heroImage}
                imageAlt="Social Vigilante - monitoramento pós-mercado"
                accentColor={tool.accent}
                icon={<ShieldAlert size={18} />}
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
                        <h2 className="heading-lg mb-4">Pipeline de Vigilância</h2>
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
                                    <Radar size={18} style={{ color: tool.accent }} />
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
                        <h2 className="heading-md">Impacto para Farmacovigilância</h2>
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
