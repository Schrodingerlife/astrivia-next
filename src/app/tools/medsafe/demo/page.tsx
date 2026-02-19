"use client";

import MedSafeApp from "@/components/tools/medsafe/MedSafeApp";

export default function MedSafeDemoPage() {
    return (
        <div className="min-h-screen pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto rounded-[24px] overflow-hidden border border-white/[0.08] shadow-[0_20px_90px_rgba(0,0,0,0.55)]">
                <MedSafeApp />
            </div>
        </div>
    );
}
