"use client";

import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
            <div className="relative">
                <div className="absolute inset-0 blur-xl bg-[#00D9FF]/20 rounded-full" />
                <Loader2 size={40} className="text-[#00D9FF] animate-spin relative z-10" />
            </div>
            <p className="text-white/50 text-sm font-medium animate-pulse">
                Carregando Astrivia AI...
            </p>
        </div>
    );
}
