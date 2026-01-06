"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className={`navbar fixed top-0 w-full z-50 ${isScrolled ? "scrolled" : ""}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <span className="relative h-12 w-auto block">
                            <img
                                src="/images/astrivia-logo-fixed.png"
                                alt="Astrivia AI"
                                className="h-full w-auto object-contain"
                            />
                        </span>
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

                    <Link
                        href="/contact"
                        className="hidden lg:flex btn-primary px-6 py-2.5 rounded-lg text-sm"
                    >
                        Get Started
                    </Link>

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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
