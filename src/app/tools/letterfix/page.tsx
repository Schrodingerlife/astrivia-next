"use client";

import LetterFixApp from "@/components/tools/letterfix/LetterFixApp";
import { Wand2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LetterFixPage() {
    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Hero Section */}
            <section className="px-6 mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-semibold text-[#00D9FF] mb-6 border border-[#00D9FF]/20">
                    <Wand2 size={14} />
                    <span>Powered by Imagen 3 & Vertex AI</span>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                >
                    Letter<span className="text-gradient-cyan">Fix</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
                >
                    Edição generativa pixel-perfect em materiais finalizados.
                    Modifique textos em embalagens preservando 100% do layout original.
                </motion.p>
            </section>

            {/* Tool App */}
            <section className="px-6">
                <LetterFixApp />
            </section>
        </div>
    );
}
