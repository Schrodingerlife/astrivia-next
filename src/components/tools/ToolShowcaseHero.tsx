"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ToolShowcaseHeroProps {
    badge: string;
    title: string;
    description: string;
    metrics: string[];
    ctaHref: string;
    ctaLabel?: string;
    imageSrc: string;
    imageAlt: string;
    accentColor: string;
    icon: ReactNode;
    imageFirst?: boolean;
}

export default function ToolShowcaseHero({
    badge,
    title,
    description,
    metrics,
    ctaHref,
    ctaLabel = "Testar Demo",
    imageSrc,
    imageAlt,
    accentColor,
    icon,
    imageFirst = false,
}: ToolShowcaseHeroProps) {
    const imageOrderClass = imageFirst ? "lg:order-1" : "lg:order-2";
    const textOrderClass = imageFirst ? "lg:order-2" : "lg:order-1";

    return (
        <section className="relative py-14 md:py-20 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#090914] to-[#0A1628]" />
            <div className="absolute inset-0 bg-grid-pattern opacity-25" />
            <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className={`${imageOrderClass}`}
                >
                    <div className="relative rounded-[26px] overflow-hidden border border-white/[0.08] shadow-[0_22px_80px_rgba(0,0,0,0.45)]">
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ boxShadow: `inset 0 0 40px ${accentColor}22` }}
                        />
                        <div className="relative aspect-[16/10]">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className={`${textOrderClass}`}
                >
                    <div
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] border mb-6"
                        style={{
                            color: accentColor,
                            background: `${accentColor}14`,
                            borderColor: `${accentColor}33`,
                        }}
                    >
                        <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${accentColor}26` }}
                        >
                            {icon}
                        </span>
                        {badge}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-5">{title}</h1>

                    <p className="text-xl text-white/55 max-w-2xl leading-relaxed mb-7">{description}</p>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {metrics.map((metric) => (
                            <span
                                key={metric}
                                className="px-5 py-2.5 rounded-full text-[1.05rem] bg-white/[0.03] border border-white/[0.08] text-white/72"
                            >
                                {metric}
                            </span>
                        ))}
                    </div>

                    <Link href={ctaHref} className="inline-flex items-center gap-2 text-white text-lg font-semibold hover:gap-3 transition-all">
                        {ctaLabel}
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
