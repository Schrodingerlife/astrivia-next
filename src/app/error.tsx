"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Boundary caught:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center border border-red-500/20 bg-red-500/5">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={32} />
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-3">
                    Oops! Algo deu errado.
                </h1>
                
                <p className="text-white/60 mb-8 text-sm leading-relaxed">
                    Não conseguimos carregar esta página de forma adequada. Isso pode ter acontecido devido a uma falha temporária na API ou na sua conexão.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="btn-primary w-full justify-center gap-2"
                    >
                        <RotateCcw size={16} />
                        Tentar Novamente
                    </button>
                    
                    <Link
                        href="/"
                        className="px-6 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        Voltar para a Página Inicial
                    </Link>
                </div>
            </div>
        </div>
    );
}
