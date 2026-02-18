'use client';

import { motion } from 'framer-motion';
import {
    DollarSign,
    FlaskConical,
    Users,
    Phone,
    ChevronRight,
    Clock,
    Zap
} from 'lucide-react';

interface Cenario {
    id: string;
    nome: string;
    descricao: string;
    dificuldade: 'facil' | 'media' | 'alta';
    duracao: number;
    icone: 'price' | 'efficacy' | 'competitor' | 'cold';
}

interface ScenarioSelectorProps {
    cenarios: Cenario[];
    selecionado: string | null;
    onSelecionar: (id: string) => void;
}

const icones = {
    price: DollarSign,
    efficacy: FlaskConical,
    competitor: Users,
    cold: Phone
};

const dificuldadeConfig = {
    facil: { label: 'Fácil', color: 'text-green-400 bg-green-500/20' },
    media: { label: 'Média', color: 'text-yellow-400 bg-yellow-500/20' },
    alta: { label: 'Alta', color: 'text-red-400 bg-red-500/20' }
};

export default function ScenarioSelector({
    cenarios,
    selecionado,
    onSelecionar
}: ScenarioSelectorProps) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {cenarios.map((cenario, index) => {
                const Icone = icones[cenario.icone] || FlaskConical;
                const dificuldade = dificuldadeConfig[cenario.dificuldade];
                const isSelected = selecionado === cenario.id;

                return (
                    <motion.button
                        key={cenario.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelecionar(cenario.id)}
                        className={`p-6 rounded-xl text-left transition-all duration-300 ${isSelected
                                ? 'bg-[#00D9FF]/20 border-2 border-[#00D9FF]'
                                : 'glass-card border-2 border-transparent hover:border-white/10'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#00D9FF]/30' : 'bg-white/10'
                                }`}>
                                <Icone className={`w-6 h-6 ${isSelected ? 'text-[#00D9FF]' : 'text-white/40'}`} />
                            </div>

                            <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-[#00D9FF] translate-x-1' : 'text-white/20'
                                }`} />
                        </div>

                        <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-[#00D9FF]' : 'text-white'
                            }`}>
                            {cenario.nome}
                        </h3>

                        <p className="text-white/50 text-sm mb-4">
                            {cenario.descricao}
                        </p>

                        <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${dificuldade.color}`}>
                                <Zap className="w-3 h-3 inline mr-1" />
                                {dificuldade.label}
                            </span>
                            <span className="text-xs text-white/40 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {cenario.duracao} min
                            </span>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
