'use client';

import { motion } from 'framer-motion';

interface ScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
}

export default function ScoreRing({
    score,
    size = 120,
    strokeWidth = 8,
    showLabel = true
}: ScoreRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score >= 80) return { stroke: '#22c55e', text: 'text-green-400', bg: 'from-green-500/20' };
        if (score >= 60) return { stroke: '#00D9FF', text: 'text-[#00D9FF]', bg: 'from-[#00D9FF]/20' };
        if (score >= 40) return { stroke: '#eab308', text: 'text-yellow-400', bg: 'from-yellow-500/20' };
        return { stroke: '#ef4444', text: 'text-red-400', bg: 'from-red-500/20' };
    };

    const color = getColor();

    return (
        <div className="relative inline-flex items-center justify-center">
            <div
                className={`absolute inset-0 rounded-full bg-gradient-radial ${color.bg} to-transparent blur-xl opacity-50`}
                style={{ width: size + 20, height: size + 20, marginLeft: -10, marginTop: -10 }}
            />

            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>

            {showLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`text-3xl font-bold ${color.text}`}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-white/40 mt-1">pontos</span>
                </div>
            )}
        </div>
    );
}
