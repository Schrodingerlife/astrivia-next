"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Technology", href: "/technology" },
    { name: "Team", href: "/team" },
    { name: "Docs", href: "/docs" },
    { name: "Status", href: "/status" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className={`navbar fixed top-0 w-full z-50 ${isScrolled ? "scrolled" : ""}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-gradient-cyan">Astrivia</span>
                        <span className="text-white/80"> AI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/60 hover:text-[#00D9FF] transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D9FF] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {user && (
                            <span className="text-white/40 text-sm truncate max-w-[150px]">
                                {user.email}
                            </span>
                        )}
                        <Link
                            href="/contact"
                            className="btn-primary px-6 py-2.5 rounded-lg text-sm"
                        >
                            Get Started
                        </Link>
                        {user && (
                            <button
                                onClick={logout}
                                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                                title="Sair"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <div
                        className={`hamburger lg:hidden ${mobileMenuOpen ? "open" : ""}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${mobileMenuOpen ? "open" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 w-[80%] max-w-[300px] h-screen bg-[#0A1628]/98 backdrop-blur-xl z-[100] p-8 pt-20"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xl text-white/80 hover:text-[#00D9FF] transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                className="btn-primary px-6 py-3 rounded-lg text-center mt-4"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                            {user && (
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors"
                                >
                                    <LogOut size={18} /> Sair
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
