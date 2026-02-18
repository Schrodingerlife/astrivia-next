'use client';

import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
    isAtivo: boolean;
    nivel?: number;
    isIaFalando?: boolean;
}

export default function WaveformVisualizer({
    isAtivo,
    nivel = 0,
    isIaFalando = false
}: WaveformVisualizerProps) {
    const barCount = 12;

    const gerarAlturas = () => {
        if (!isAtivo && !isIaFalando) {
            return Array(barCount).fill(20);
        }
        return Array(barCount).fill(0).map((_, i) => {
            const baseHeight = 20;
            const maxVariation = 80 * (isAtivo ? nivel : 0.5);
            const wave = Math.sin((Date.now() / 200) + (i * 0.5)) * 0.5 + 0.5;
            return baseHeight + (maxVariation * wave);
        });
    };

    const alturas = gerarAlturas();

    return (
        <div className="relative w-full h-40 flex items-center justify-center">
            {/* Glow circle */}
            <div className={`absolute w-48 h-48 rounded-full ${isAtivo
                    ? 'bg-[#00D9FF]/10 animate-pulse'
                    : isIaFalando
                        ? 'bg-purple-500/10'
                        : 'bg-white/5'
                }`} />

            <div className={`absolute w-36 h-36 rounded-full ${isAtivo ? 'bg-[#00D9FF]/5' : isIaFalando ? 'bg-purple-500/5' : 'bg-white/5'
                }`} />

            {/* Waveform bars */}
            <div className="relative z-10 flex items-center justify-center gap-1 h-32">
                {alturas.map((altura, i) => (
                    <motion.div
                        key={i}
                        className={`w-2 rounded-full ${isAtivo
                                ? 'bg-gradient-to-t from-[#00D9FF] to-cyan-400'
                                : isIaFalando
                                    ? 'bg-gradient-to-t from-purple-500 to-purple-300'
                                    : 'bg-white/20'
                            }`}
                        initial={{ height: 20 }}
                        animate={{
                            height: isAtivo || isIaFalando ? altura : 20,
                            opacity: isAtivo || isIaFalando ? 1 : 0.4
                        }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                    />
                ))}
            </div>

            {/* Status indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-4 py-1 rounded-full text-xs font-medium ${isAtivo
                            ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30'
                            : isIaFalando
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-white/10 text-white/40'
                        }`}
                >
                    {isAtivo ? '🎙️ Você está falando' : isIaFalando ? '🩺 Médico IA' : 'Aguardando...'}
                </motion.div>
            </div>

            {/* Sound waves animation */}
            {(isAtivo || isIaFalando) && (
                <>
                    <motion.div
                        className={`absolute w-52 h-52 rounded-full border ${isAtivo ? 'border-[#00D9FF]/30' : 'border-purple-500/30'
                            }`}
                        animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.div
                        className={`absolute w-52 h-52 rounded-full border ${isAtivo ? 'border-[#00D9FF]/30' : 'border-purple-500/30'
                            }`}
                        animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                    />
                </>
            )}
        </div>
    );
}
