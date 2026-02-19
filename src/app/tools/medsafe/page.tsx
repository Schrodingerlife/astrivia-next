"use client";

import MedSafeApp from "@/components/tools/medsafe/MedSafeApp";
import ToolShowcaseHero from "@/components/tools/ToolShowcaseHero";
import { ShieldCheck } from "lucide-react";

export default function MedSafePage() {
    return (
        <div className="min-h-screen pt-20 pb-10">
            <ToolShowcaseHero
                badge="Compliance Regulatório"
                title="Audite materiais promocionais em segundos"
                description="IA auditora treinada na RDC 96 que analisa peças de marketing linha por linha, identifica claims não suportados e sugere correções — tudo com 100% de rastreabilidade."
                metrics={["90% menos tempo de revisão", "Zero falsos positivos", "Auditoria completa"]}
                ctaHref="#medsafe-demo"
                ctaLabel="Testar Demo"
                imageSrc="/images/product-medsafe.png"
                imageAlt="MedSafe AI - painel de auditoria regulatória"
                accentColor="#10B981"
                icon={<ShieldCheck size={18} />}
                imageFirst
            />

            <section id="medsafe-demo" className="px-6">
                <div className="max-w-7xl mx-auto">
                    <MedSafeApp />
                </div>
            </section>
        </div>
    );
}
