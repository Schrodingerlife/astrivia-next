"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { toolsConfig, upcomingToolsConfig } from "@/lib/tools-config";

export default function ProductsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <section className="py-14 px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="label mb-4 text-[#00D9FF]">Ecossistema</p>
                    <h1 className="heading-lg mb-4">
                        Ferramentas <span className="text-gradient-cyan">Astrivia AI</span>
                    </h1>
                    <p className="body-lg max-w-3xl mx-auto">
                        Cada solução foi desenhada para um estágio da operação em Life Sciences,
                        com a mesma linguagem visual e experiência de produto.
                    </p>
                </motion.div>
            </section>

            <section className="px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {toolsConfig.map((tool, idx) => (
                            <motion.article
                                key={tool.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="glass-card rounded-2xl p-4"
                            >
                                <Link href={tool.landingHref} className="block">
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08]">
                                        <Image
                                            src={tool.heroImage}
                                            alt={tool.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <p className="label mb-2" style={{ color: tool.accent }}>
                                            {tool.categoryLabel}
                                        </p>
                                        <h2 className="text-2xl font-semibold text-white mb-2">{tool.name}</h2>
                                        <p className="text-sm text-white/55 line-clamp-2">{tool.description}</p>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {tool.chips.map((chip) => (
                                            <span key={chip} className="tech-badge !text-[11px] !py-1.5">
                                                {chip}
                                            </span>
                                        ))}
                                    </div>
                                </Link>

                                <div className="mt-5 flex items-center justify-between gap-2">
                                    <Link
                                        href={tool.landingHref}
                                        className="inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-white"
                                    >
                                        Ver Landing
                                        <ArrowRight size={15} />
                                    </Link>

                                    <Link
                                        href={tool.demoHref}
                                        className="btn-outline !px-4 !py-2.5 !text-xs inline-flex items-center gap-1.5"
                                    >
                                        <PlayCircle size={14} />
                                        Iniciar Demo
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <p className="label mb-3 text-white/50">Em breve</p>
                        <h2 className="heading-md">Próximos Produtos</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        {upcomingToolsConfig.map((tool) => (
                            <article key={tool.slug} className="glass-card rounded-2xl p-4">
                                <Link href={tool.href} className="flex items-center gap-4">
                                    <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-white/[0.08] shrink-0">
                                        <Image src={tool.heroImage} alt={tool.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1">{tool.name}</h3>
                                        <p className="text-sm text-white/50 mb-2">{tool.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {tool.chips.map((chip) => (
                                                <span key={chip} className="tech-badge !text-[11px] !py-1.5">{chip}</span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
