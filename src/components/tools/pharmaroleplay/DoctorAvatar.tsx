import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DoctorAvatarProps {
    isFalando: boolean;
    paciencia: number;
    medicoNome: string;
}

export default function DoctorAvatar({ isFalando, paciencia, medicoNome }: DoctorAvatarProps) {
    const [mouthOpen, setMouthOpen] = useState(false);

    useEffect(() => {
        if (!isFalando) { setMouthOpen(false); return; }
        const interval = setInterval(() => setMouthOpen(prev => !prev), 160);
        return () => clearInterval(interval);
    }, [isFalando]);

    const primeironome = medicoNome.split(' - ')[0];
    const especialidade = medicoNome.split(' - ')[1] || '';

    return (
        <div className="flex flex-col items-center mb-4 pb-4 border-b border-white/10">
            <style>{`
                @keyframes docBlink {
                    0%, 88%, 100% { transform: scaleY(1); }
                    94% { transform: scaleY(0.08); }
                }
                .eye-l { animation: docBlink 3.5s infinite; transform-box: fill-box; transform-origin: center; }
                .eye-r { animation: docBlink 3.5s 0.6s infinite; transform-box: fill-box; transform-origin: center; }
            `}</style>
            <div className="relative">
                {/* Patience Thermometer Ring */}
                <svg viewBox="0 0 100 100" width="96" height="96" className="absolute -inset-1">
                    <circle cx="50" cy="50" r="46" stroke="white" strokeOpacity="0.08" strokeWidth="4" fill="none" />
                    <circle
                        cx="50" cy="50" r="46"
                        stroke={paciencia > 60 ? '#22c55e' : paciencia > 30 ? '#eab308' : '#ef4444'}
                        strokeWidth="4" fill="none"
                        strokeDasharray={`${paciencia * 2.89} 289`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                </svg>
                {/* Audio glow when doctor speaks */}
                {isFalando && (
                    <>
                        <motion.div className="absolute -inset-3 rounded-full border border-purple-500/30"
                            animate={{ scale: [1, 1.15], opacity: [0.5, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity }} />
                        <motion.div className="absolute -inset-3 rounded-full border border-purple-500/30"
                            animate={{ scale: [1, 1.15], opacity: [0.5, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
                    </>
                )}
                <svg viewBox="0 0 120 130" width="88" height="88">
                    {/* Lab coat base */}
                    <ellipse cx="60" cy="126" rx="44" ry="16" fill="#e8eeff" opacity="0.95" />
                    <rect x="30" y="105" width="60" height="24" rx="6" fill="#e8eeff" opacity="0.95" />
                    {/* Collar */}
                    <polygon points="60,105 42,130 60,120" fill="#c8d0f0" />
                    <polygon points="60,105 78,130 60,120" fill="#c8d0f0" />
                    {/* Tie/stethoscope line */}
                    <path d="M60 108 Q55 120 50 128" stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="50" cy="130" r="4" fill="none" stroke="#6366f1" strokeWidth="2" />
                    {/* Neck */}
                    <rect x="52" y="99" width="16" height="12" rx="3" fill="#f5c89a" />
                    {/* Head */}
                    <ellipse cx="60" cy="64" rx="36" ry="42" fill="#f5c89a" />
                    {/* Hair */}
                    <path d="M24 50 Q24 16 60 16 Q96 16 96 50 Q93 22 60 22 Q27 22 24 50Z" fill="#1a0f00" />
                    <rect x="24" y="44" width="72" height="8" fill="#1a0f00" />
                    {/* Ears */}
                    <ellipse cx="24" cy="66" rx="6" ry="9" fill="#f0b882" />
                    <ellipse cx="96" cy="66" rx="6" ry="9" fill="#f0b882" />
                    {/* Eyebrows */}
                    <path d="M37 50 Q46 45 55 50" stroke="#1a0f00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M65 50 Q74 45 83 50" stroke="#1a0f00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    {/* Left eye */}
                    <g className="eye-l">
                        <ellipse cx="46" cy="63" rx="8" ry="9" fill="white" />
                        <ellipse cx="46" cy="64" rx="4.5" ry="5" fill="#1a2a4a" />
                        <ellipse cx="48" cy="62" rx="1.5" ry="1.5" fill="white" />
                    </g>
                    {/* Right eye */}
                    <g className="eye-r">
                        <ellipse cx="74" cy="63" rx="8" ry="9" fill="white" />
                        <ellipse cx="74" cy="64" rx="4.5" ry="5" fill="#1a2a4a" />
                        <ellipse cx="76" cy="62" rx="1.5" ry="1.5" fill="white" />
                    </g>
                    {/* Nose */}
                    <path d="M56 78 Q60 84 64 78" stroke="#d4956a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    {/* Mouth */}
                    {mouthOpen ? (
                        <>
                            <ellipse cx="60" cy="91" rx="11" ry="7" fill="#7a2e2e" />
                            <ellipse cx="60" cy="89" rx="10" ry="3" fill="#f5c89a" />
                            <rect x="51" y="88" width="18" height="5" rx="2.5" fill="white" opacity="0.85" />
                        </>
                    ) : (
                        <path d="M50 90 Q60 97 70 90" stroke="#c06060" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    )}
                </svg>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1 text-center leading-tight">
                {isFalando ? '🗣 Falando...' : primeironome}
            </p>
            {!isFalando && (
                <p className="text-xs text-white/30 text-center">{especialidade}</p>
            )}
            {/* Patience label */}
            <div className={`mt-1 text-xs px-2 py-0.5 rounded-full ${paciencia > 60 ? 'bg-green-500/15 text-green-400'
                : paciencia > 30 ? 'bg-yellow-500/15 text-yellow-400'
                    : 'bg-red-500/15 text-red-400'
                }`}>
                {paciencia > 60 ? '😊 Receptivo' : paciencia > 30 ? '😐 Impaciente' : '😤 Irritado'}
            </div>
        </div>
    );
}
