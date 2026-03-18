import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
    isGravando: boolean;
    isFalando: boolean;
}

export default function AudioVisualizer({ isGravando, isFalando }: AudioVisualizerProps) {
    const [audioVisBars, setAudioVisBars] = useState<number[]>(Array(8).fill(4));

    useEffect(() => {
        if (!isGravando && !isFalando) {
            setAudioVisBars(Array(8).fill(4));
            return;
        }
        const interval = setInterval(() => {
            setAudioVisBars(prev => prev.map((_, i) => {
                const base = isFalando ? 12 : 8;
                const wave = Math.sin(Date.now() / 150 + i * 0.8) * 0.5 + 0.5;
                const rand = Math.random() * 0.3 + 0.7;
                return Math.round(4 + base * wave * rand);
            }));
        }, 80);
        return () => clearInterval(interval);
    }, [isGravando, isFalando]);

    return (
        <div className="flex items-end justify-center gap-1 h-8">
            {audioVisBars.map((h, i) => (
                <motion.div
                    key={i}
                    className={`w-1 rounded-full ${isGravando ? 'bg-[#00D9FF]' : isFalando ? 'bg-purple-400' : 'bg-white/15'}`}
                    animate={{ height: h }}
                    transition={{ duration: 0.08 }}
                />
            ))}
        </div>
    );
}
