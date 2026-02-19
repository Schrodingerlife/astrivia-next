"use client";

import SocialVigilanteApp from "@/components/tools/social-vigilante/SocialVigilanteApp";

export default function SocialVigilanteDemoPage() {
    return (
        <div className="min-h-screen pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto rounded-[24px] overflow-hidden border border-white/[0.08] shadow-[0_20px_90px_rgba(0,0,0,0.5)]">
                <div className="h-[760px] md:h-[820px]">
                    <SocialVigilanteApp embedded />
                </div>
            </div>
        </div>
    );
}
