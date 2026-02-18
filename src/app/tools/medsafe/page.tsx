"use client";

import MedSafeApp from "@/components/tools/medsafe/MedSafeApp";
import { Shield } from "lucide-react";

export default function MedSafePage() {
    return (
        <div className="min-h-screen pt-20 pb-8">
                {/* Header */}
                <section className="px-6 mb-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF]">
                                <Shield size={18} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold">MedSafe AI</h1>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                        Live
                                    </span>
                                </div>
                                <p className="text-white/40 text-xs">Powered by Vertex AI Search & Gemini 3</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Native App */}
                <MedSafeApp />
            </div>
    );
}
