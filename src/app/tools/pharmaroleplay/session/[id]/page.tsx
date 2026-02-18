'use client';

import { Navbar } from "@/components/navbar";
import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import VoiceInterfaceLocal from '@/components/tools/pharmaroleplay/VoiceInterfaceLocal';
import ReportCard from '@/components/tools/pharmaroleplay/ReportCard';

const cenarioNomes: Record<string, string> = {
    'objecao_preco': 'Objeção de Preço',
    'duvida_eficacia': 'Dúvida sobre Eficácia',
    'comparacao_concorrente': 'Comparação com Concorrente',
    'contato_frio': 'Primeiro Contato'
};

export default function SessionPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const sessaoId = params.id as string;
    const cenario = searchParams.get('cenario') || 'objecao_preco';
    const cenarioNome = cenarioNomes[cenario] || 'Cenário Desconhecido';

    const [relatorio, setRelatorio] = useState<any>(null);
    const [etapa, setEtapa] = useState<'treinamento' | 'relatorio'>('treinamento');

    const handleEncerrar = (relatorioFinal: any) => {
        setRelatorio(relatorioFinal);
        setEtapa('relatorio');
    };

    if (etapa === 'relatorio' && relatorio) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen pt-20 py-12 px-6">
                    <ReportCard relatorio={relatorio} sessaoId={sessaoId} />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-20 p-6" style={{ height: '100vh' }}>
                <VoiceInterfaceLocal
                    sessaoId={sessaoId}
                    cenario={cenario}
                    cenarioNome={cenarioNome}
                    onEncerrar={handleEncerrar}
                />
            </div>
        </>
    );
}
