"use client";

import { Navbar } from "@/components/navbar";
import SocialVigilanteApp from "@/components/tools/social-vigilante/SocialVigilanteApp";

export default function SocialVigilantePage() {
    return (
        <div className="min-h-screen bg-[#050B14]">
            <Navbar />
            <div className="pt-20 h-screen">
                <SocialVigilanteApp />
            </div>
        </div>
    );
}
