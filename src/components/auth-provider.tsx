"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Loader2, Shield } from "lucide-react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async () => {
        await signInWithPopup(auth, googleProvider);
    };

    const logout = async () => {
        await signOut(auth);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#00D9FF]" />
            </div>
        );
    }

    // Not authenticated - show login
    if (!user) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-6">
                <div className="glass-card rounded-3xl p-12 text-center max-w-md">
                    <Shield className="w-20 h-20 text-[#00D9FF] mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-2">Astrivia AI</h1>
                    <p className="text-white/60 mb-8">
                        Acesso restrito. Faça login com sua conta Google para continuar.
                    </p>
                    <button
                        onClick={login}
                        className="btn-primary w-full py-4 rounded-xl text-lg"
                    >
                        <span className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Entrar com Google
                        </span>
                    </button>
                    <p className="text-white/30 text-sm mt-6">
                        Powered by Vertex AI Agent Engine
                    </p>
                </div>
            </div>
        );
    }

    // Authenticated - render children
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
