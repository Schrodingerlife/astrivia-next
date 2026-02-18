"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
    PharmaRoleplayLogo,
    SocialVigilanteLogo,
    MedSafeLogo,
    InternMatchLogo,
    SciGenLogo,
} from "@/components/product-logos";

const products = [
    {
        href: "/tools/pharmaroleplay",
        icon: <PharmaRoleplayLogo size={28} />,
        title: "PharmaRoleplay",
        desc: "Treinamento por voz com IA",
        color: "#00D9FF",
    },
    {
        href: "/tools/social-vigilante",
        icon: <SocialVigilanteLogo size={28} />,
        title: "Social Vigilante",
        desc: "Vigilância pós-mercado",
        color: "#A855F7",
    },
    {
        href: "/tools/medsafe",
        icon: <MedSafeLogo size={28} />,
        title: "MedSafe AI",
        desc: "Compliance regulatório",
        color: "#10B981",
    },
    {
        href: "/tools/internmatch",
        icon: <InternMatchLogo size={28} />,
        title: "InternMatch",
        desc: "Talent matching com IA",
        color: "#F59E0B",
    },
    {
        href: "/contact",
        icon: <SciGenLogo size={28} />,
        title: "SciGen",
        desc: "Geração de conteúdo científico",
        color: "#EC4899",
        soon: true,
    },
];

const navLinks = [
    { name: "Tecnologia", href: "/technology" },
    { name: "Time", href: "/team" },
    { name: "Contato", href: "/contact" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDropdownEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDropdownOpen(true);
    };

    const handleDropdownLeave = () => {
        timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
    };

    return (
        <>
            <nav className={`navbar fixed top-0 w-full z-50 ${isScrolled ? "scrolled" : ""}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <span className="relative h-10 w-auto block">
                            <img
                                src="/images/astrivia-logo-fixed.png"
                                alt="Astrivia AI"
                                className="h-full w-auto object-contain"
                            />
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Produtos Dropdown */}
                        <div
                            ref={dropdownRef}
                            className="relative"
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/[0.04]">
                                Produtos
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Mega Dropdown */}
                            <div className={`mega-dropdown ${dropdownOpen ? "open" : ""}`}>
                                <p className="label px-4 mb-3">Ferramentas</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {products.map((product) => (
                                        <Link
                                            key={product.title}
                                            href={product.href}
                                            className="mega-dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <div className="flex-shrink-0">
                                                {product.icon}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white">{product.title}</p>
                                                    {product.soon && (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">
                                                            Em breve
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/40">{product.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                                    <Link
                                        href="/products"
                                        className="text-sm text-white/40 hover:text-white transition-colors px-4"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Ver todos os produtos →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Other Links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/[0.04]"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/platform"
                            className="text-sm font-medium text-white/60 hover:text-white transition-colors px-4 py-2"
                        >
                            Login
                        </Link>
                        <Link
                            href="/tools/social-vigilante"
                            className="btn-primary text-sm !py-2.5 !px-6"
                        >
                            Testar Grátis
                        </Link>
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
                        transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-0 right-0 w-full h-screen bg-black/98 backdrop-blur-xl z-[100] p-10 pt-24"
                    >
                        <div className="flex flex-col gap-2">
                            <p className="label mb-4">Produtos</p>
                            {products.map((product) => (
                                <Link
                                    key={product.title}
                                    href={product.href}
                                    className="flex items-center gap-4 py-3 text-white/70 hover:text-white transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="flex-shrink-0">
                                        {product.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium">{product.title}</p>
                                        <p className="text-xs text-white/30">{product.desc}</p>
                                    </div>
                                </Link>
                            ))}

                            <div className="h-px bg-white/[0.06] my-4" />

                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xl text-white/70 hover:text-white transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="h-px bg-white/[0.06] my-4" />

                            <Link
                                href="/tools/social-vigilante"
                                className="btn-primary text-center mt-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Testar Grátis
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
