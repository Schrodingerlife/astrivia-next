"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </AuthProvider>
    );
}
