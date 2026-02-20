"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { MouseGlow } from "@/components/home/MouseGlow";

export function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <MouseGlow />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </AuthProvider>
    );
}
