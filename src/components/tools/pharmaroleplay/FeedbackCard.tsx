'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface FeedbackCardProps {
    tipo: 'success' | 'warning' | 'error';
    mensagem: string;
    categoria?: string;
}

export default function FeedbackCard({ tipo, mensagem, categoria }: FeedbackCardProps) {
    const config = {
        success: {
            icon: CheckCircle,
            bgClass: 'bg-green-500/10 border-l-4 border-green-500',
            iconClass: 'text-green-400',
            textClass: 'text-green-300',
            label: 'Ótimo!'
        },
        warning: {
            icon: AlertTriangle,
            bgClass: 'bg-yellow-500/10 border-l-4 border-yellow-500',
            iconClass: 'text-yellow-400',
            textClass: 'text-yellow-300',
            label: 'Atenção'
        },
        error: {
            icon: XCircle,
            bgClass: 'bg-red-500/10 border-l-4 border-red-500',
            iconClass: 'text-red-400',
            textClass: 'text-red-300',
            label: 'Evite'
        }
    };

    const { icon: Icon, bgClass, iconClass, textClass, label } = config[tipo];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`p-3 rounded-lg ${bgClass} flex items-start gap-3`}
        >
            <Icon className={`w-5 h-5 ${iconClass} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${iconClass}`}>{label}</span>
                    {categoria && (
                        <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/5">
                            {categoria}
                        </span>
                    )}
                </div>
                <p className={`text-sm ${textClass}`}>{mensagem}</p>
            </div>
        </motion.div>
    );
}
