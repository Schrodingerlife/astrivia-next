"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/AuthContext";

export function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </AuthProvider>
    );
}
