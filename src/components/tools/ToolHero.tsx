"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ToolHeroProps {
    badge: string;
    title: string;
    description: string;
    chips: string[];
    ctaHref: string;
    ctaLabel?: string;
    imageSrc: string;
    imageAlt: string;
    accentColor: string;
    icon: ReactNode;
    imageFirst?: boolean;
}

export default function ToolHero({
    badge,
    title,
    description,
    chips,
    ctaHref,
    ctaLabel = "Iniciar Demo",
    imageSrc,
    imageAlt,
    accentColor,
    icon,
    imageFirst = false,
}: ToolHeroProps) {
    const imageOrderClass = imageFirst ? "lg:order-1" : "lg:order-2";
    const textOrderClass = imageFirst ? "lg:order-2" : "lg:order-1";

    return (
        <section className="relative py-14 md:py-20 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#071332] via-[#060B1D] to-[#050B16]" />
            <div className="absolute inset-0 bg-grid-pattern opacity-25" />

            <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={imageOrderClass}
                >
                    <div className="relative rounded-[28px] overflow-hidden border border-white/[0.08] shadow-[0_24px_84px_rgba(0,0,0,0.5)]">
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ boxShadow: `inset 0 0 44px ${accentColor}2e` }}
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
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.06 }}
                    className={textOrderClass}
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

                    <h1 className="text-4xl md:text-6xl font-bold leading-[1.02] text-white mb-5">{title}</h1>

                    <p className="text-2xl md:text-[1.9rem] text-white/56 max-w-2xl leading-[1.35] mb-8">{description}</p>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {chips.map((chip) => (
                            <span
                                key={chip}
                                className="px-5 py-2.5 rounded-full text-[1.05rem] bg-white/[0.03] border border-white/[0.08] text-white/75"
                            >
                                {chip}
                            </span>
                        ))}
                    </div>

                    <Link
                        href={ctaHref}
                        className="inline-flex items-center gap-2 text-white text-[2rem] font-semibold hover:gap-3 transition-all"
                    >
                        {ctaLabel}
                        <ArrowRight size={22} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
