'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ChevronRight,
    Clock,
    Zap,
    User,
    Settings,
    Play
} from 'lucide-react';
import ScenarioSelector from '@/components/tools/pharmaroleplay/ScenarioSelector';

const cenarios = [
    { id: 'objecao_preco', nome: 'Objeção de Preço', descricao: 'O médico questiona o custo elevado do medicamento comparado às alternativas do mercado.', dificuldade: 'media' as const, duracao: 10, icone: 'price' as const },
    { id: 'duvida_eficacia', nome: 'Dúvida sobre Eficácia', descricao: 'Apresente dados científicos convincentes para um médico que exige evidências clínicas.', dificuldade: 'alta' as const, duracao: 15, icone: 'efficacy' as const },
    { id: 'comparacao_concorrente', nome: 'Comparação com Concorrente', descricao: 'Diferencie seu produto de um concorrente estabelecido que o médico já utiliza há anos.', dificuldade: 'alta' as const, duracao: 15, icone: 'competitor' as const },
    { id: 'contato_frio', nome: 'Primeiro Contato', descricao: 'Conquiste a atenção de um médico ocupado e resistente em apenas 5 minutos.', dificuldade: 'media' as const, duracao: 10, icone: 'cold' as const },
];

const personas = [
    { id: 'cético', nome: 'Cético Experiente', descricao: 'Médico com 20+ anos que questiona tudo', avatar: '👨‍⚕️' },
    { id: 'ocupado', nome: 'Ocupado e Direto', descricao: 'Quer informação rápida e objetiva', avatar: '🧑‍⚕️' },
    { id: 'curioso', nome: 'Curioso Acadêmico', descricao: 'Quer dados, estudos e evidências', avatar: '👩‍⚕️' },
    { id: 'resistente', nome: 'Leal ao Concorrente', descricao: 'Já usa outro produto e está satisfeito', avatar: '👨‍⚕️' },
];

export default function TrainingPage() {
    const router = useRouter();
    const [cenarioSelecionado, setCenarioSelecionado] = useState<string | null>(null);
    const [personaSelecionada, setPersonaSelecionada] = useState<string | null>(null);
    const [duracao, setDuracao] = useState(10);
    const [etapa, setEtapa] = useState<'cenario' | 'persona' | 'confirmar'>('cenario');

    const iniciarTreinamento = () => {
        const sessaoId = `session_${Date.now()}`;
        router.push(`/tools/pharmaroleplay/session/${sessaoId}?cenario=${cenarioSelecionado}`);
    };

    const cenarioInfo = cenarios.find(c => c.id === cenarioSelecionado);
    const personaInfo = personas.find(p => p.id === personaSelecionada);

    return (
        <div className="min-h-screen pt-20 py-8 px-6">
            <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <Link href="/tools/pharmaroleplay/dashboard" className="text-white/30 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Novo Treinamento</h1>
                            <p className="text-white/40">Configure sua sessão de prática</p>
                        </div>
                    </motion.div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        {[
                            { label: 'Cenário', step: 'cenario' },
                            { label: 'Persona', step: 'persona' },
                            { label: 'Confirmar', step: 'confirmar' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${etapa === s.step ? 'bg-[#00D9FF] text-white' :
                                        (s.step === 'cenario' && (etapa === 'persona' || etapa === 'confirmar')) ||
                                            (s.step === 'persona' && etapa === 'confirmar')
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/10 text-white/30'
                                    }`}>
                                    {i + 1}
                                </div>
                                <span className={`text-sm ${etapa === s.step ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
                                {i < 2 && <ChevronRight className="w-4 h-4 text-white/20 mx-2" />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Cenário */}
                    {etapa === 'cenario' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="text-2xl font-semibold text-white mb-6">Escolha um Cenário</h2>
                            <ScenarioSelector
                                cenarios={cenarios}
                                selecionado={cenarioSelecionado}
                                onSelecionar={setCenarioSelecionado}
                            />
                            <div className="flex justify-end mt-8">
                                <button
                                    onClick={() => cenarioSelecionado && setEtapa('persona')}
                                    disabled={!cenarioSelecionado}
                                    className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Próximo
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Persona */}
                    {etapa === 'persona' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="text-2xl font-semibold text-white mb-6">Escolha a Persona do Médico</h2>
                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                {personas.map((persona, index) => (
                                    <motion.button
                                        key={persona.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setPersonaSelecionada(persona.id)}
                                        className={`p-6 rounded-xl text-left transition-all duration-300 ${personaSelecionada === persona.id
                                                ? 'bg-purple-500/20 border-2 border-purple-500'
                                                : 'glass-card border-2 border-transparent hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-3xl">{persona.avatar}</span>
                                            <div>
                                                <h3 className={`font-semibold ${personaSelecionada === persona.id ? 'text-purple-300' : 'text-white'}`}>
                                                    {persona.nome}
                                                </h3>
                                                <p className="text-white/40 text-sm">{persona.descricao}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Duration */}
                            <div className="glass-card p-6 rounded-xl mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#00D9FF]" />
                                    Duração da Sessão
                                </h3>
                                <div className="flex gap-3">
                                    {[5, 10, 15, 20].map(min => (
                                        <button
                                            key={min}
                                            onClick={() => setDuracao(min)}
                                            className={`px-4 py-2 rounded-lg transition-all ${duracao === min
                                                    ? 'bg-[#00D9FF] text-white'
                                                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                                                }`}
                                        >
                                            {min} min
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setEtapa('cenario')}
                                    className="border border-white/10 text-white/50 hover:bg-white/5 px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Voltar
                                </button>
                                <button
                                    onClick={() => personaSelecionada && setEtapa('confirmar')}
                                    disabled={!personaSelecionada}
                                    className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Próximo
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Confirmar */}
                    {etapa === 'confirmar' && cenarioInfo && personaInfo && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="text-2xl font-semibold text-white mb-6">Confirmar Treinamento</h2>

                            <div className="glass-card p-8 rounded-xl mb-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03]">
                                        <Settings className="w-6 h-6 text-[#00D9FF]" />
                                        <div>
                                            <p className="text-white/40 text-sm">Cenário</p>
                                            <p className="text-white font-medium">{cenarioInfo.nome}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03]">
                                        <User className="w-6 h-6 text-purple-400" />
                                        <div>
                                            <p className="text-white/40 text-sm">Persona do Médico</p>
                                            <p className="text-white font-medium">{personaInfo.avatar} {personaInfo.nome}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03]">
                                        <Clock className="w-6 h-6 text-green-400" />
                                        <div>
                                            <p className="text-white/40 text-sm">Duração</p>
                                            <p className="text-white font-medium">{duracao} minutos</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03]">
                                        <Zap className="w-6 h-6 text-yellow-400" />
                                        <div>
                                            <p className="text-white/40 text-sm">Dificuldade</p>
                                            <p className="text-white font-medium capitalize">{cenarioInfo.dificuldade}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setEtapa('persona')}
                                    className="border border-white/10 text-white/50 hover:bg-white/5 px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Voltar
                                </button>
                                <button
                                    onClick={iniciarTreinamento}
                                    className="btn-primary px-8 py-3.5 rounded-xl text-lg inline-flex items-center gap-2"
                                >
                                    <Play className="w-5 h-5" />
                                    Iniciar Treinamento
                                </button>
                            </div>
                        </motion.div>
                    )}
            </div>
        </div>
    );
}
