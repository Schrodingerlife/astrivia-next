"use client";

import ToolShowcaseHero from "@/components/tools/ToolShowcaseHero";
import SocialVigilanteApp from "@/components/tools/social-vigilante/SocialVigilanteApp";
import { ShieldAlert } from "lucide-react";

export default function SocialVigilantePage() {
    return (
        <div className="min-h-screen bg-[#050B14] pt-20 pb-12">
            <ToolShowcaseHero
                badge="Vigilância Pós-Mercado"
                title="Detecte eventos adversos antes dos reportes oficiais"
                description="Monitoramento contínuo de redes sociais, fóruns e Reclame Aqui que capta sinais precoces de farmacovigilância. Alertas em tempo real para sua equipe de segurança."
                metrics={["100% cobertura pública", "Terabytes/dia", "Alertas em tempo real"]}
                ctaHref="#social-vigilante-demo"
                ctaLabel="Testar Demo"
                imageSrc="/images/product-socialvigilante.png"
                imageAlt="Social Vigilante - dashboard de vigilância pós-mercado"
                accentColor="#A855F7"
                icon={<ShieldAlert size={18} />}
            />

            <div id="social-vigilante-demo" className="px-6">
                <div className="max-w-7xl mx-auto rounded-[24px] overflow-hidden border border-white/[0.08] shadow-[0_20px_90px_rgba(0,0,0,0.5)]">
                    <div className="h-[760px] md:h-[820px]">
                        <SocialVigilanteApp embedded />
                    </div>
                </div>
            </div>
        </div>
    );
}
