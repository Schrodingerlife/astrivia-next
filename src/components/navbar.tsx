"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { toolsConfig, upcomingToolsConfig } from "@/lib/tools-config";
import { AstriviaSymbol } from "@/components/product-logos";

const navLinks = [
    { name: "Tecnologia", href: "/technology" },
    { name: "Time", href: "/team" },
    { name: "Contato", href: "/contact" },
];

const quickLinks = [
    { name: "Ver todos os produtos", href: "/products" },
    { name: "Como funciona", href: "/platform" },
    { name: "Docs", href: "/docs" },
    { name: "Contato", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const productsMenuId = useId();
    const mobileToolsId = useId();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileToolsOpen, setMobileToolsOpen] = useState(true);
    const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);

    const navRef = useRef<HTMLElement>(null);
    const firstDesktopItemRef = useRef<HTMLAnchorElement>(null);
    const openTimerRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const clearHoverTimers = () => {
        if (openTimerRef.current) clearTimeout(openTimerRef.current);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setDesktopProductsOpen(false);
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setDesktopProductsOpen(false);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        const onMouseDown = (event: MouseEvent) => {
            if (!navRef.current) return;
            if (!navRef.current.contains(event.target as Node)) setDesktopProductsOpen(false);
        };
        window.addEventListener("mousedown", onMouseDown);
        return () => window.removeEventListener("mousedown", onMouseDown);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    const openDesktopProducts = () => {
        clearHoverTimers();
        openTimerRef.current = setTimeout(() => setDesktopProductsOpen(true), 90);
    };

    const closeDesktopProducts = () => {
        clearHoverTimers();
        closeTimerRef.current = setTimeout(() => setDesktopProductsOpen(false), 180);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileToolsOpen(true);
    };

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
    const isProductsActive = pathname.startsWith("/tools") || pathname.startsWith("/products");

    return (
        <>
            <nav ref={navRef} className={`navbar fixed top-0 w-full z-50 ${isScrolled ? "scrolled" : ""}`}>
                <div className="site-container h-[76px] flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <AstriviaSymbol size={36} />
                        <span className="text-xl font-light leading-none tracking-[-0.01em] text-white">
                            strivia <span className="text-[#00D9FF] font-semibold">AI</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        <div className="relative" onMouseEnter={openDesktopProducts} onMouseLeave={closeDesktopProducts}>
                            <button
                                type="button"
                                aria-expanded={desktopProductsOpen}
                                aria-haspopup="menu"
                                aria-controls={productsMenuId}
                                aria-label="Abrir menu de ferramentas"
                                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-white/[0.04] ${
                                    isProductsActive || desktopProductsOpen ? "text-white" : "text-white/60 hover:text-white"
                                }`}
                                onClick={() => setDesktopProductsOpen((prev) => !prev)}
                                onFocus={openDesktopProducts}
                                onKeyDown={(event) => {
                                    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        setDesktopProductsOpen(true);
                                        setTimeout(() => firstDesktopItemRef.current?.focus(), 10);
                                    }
                                }}
                            >
                                Ferramentas
                                <ChevronDown size={14} className={`transition-transform ${desktopProductsOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {desktopProductsOpen && (
                                    <motion.div
                                        id={productsMenuId}
                                        role="menu"
                                        aria-label="Ferramentas e demos disponíveis"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.2 }}
                                        className="mega-dropdown open"
                                    >
                                        <div className="grid grid-cols-[minmax(0,2fr)_minmax(250px,1fr)] gap-4">
                                            <section>
                                                <p className="label mb-3 text-white/50">Demos disponíveis</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {toolsConfig.map((tool, idx) => (
                                                        <article key={tool.slug} className="mega-product-card">
                                                            <Link
                                                                ref={idx === 0 ? firstDesktopItemRef : undefined}
                                                                href={tool.landingHref}
                                                                role="menuitem"
                                                                className="block"
                                                                onClick={() => setDesktopProductsOpen(false)}
                                                            >
                                                                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/[0.08]">
                                                                    <Image src={tool.heroImage} alt={tool.name} fill sizes="(max-width: 1280px) 280px, 320px" className="object-cover transition-transform duration-500 hover:scale-[1.03]" />
                                                                </div>
                                                                <p className="mt-3 text-sm font-semibold text-white">{tool.name}</p>
                                                                <p className="mt-1 text-xs text-white/45 truncate">{tool.description}</p>
                                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                                    {tool.chips.map((chip) => (
                                                                        <span key={chip} className="menu-chip">{chip}</span>
                                                                    ))}
                                                                </div>
                                                            </Link>
                                                            <Link href={tool.demoHref} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/75 hover:text-white transition-colors" onClick={() => setDesktopProductsOpen(false)}>
                                                                Iniciar Demo <ChevronRight size={14} />
                                                            </Link>
                                                        </article>
                                                    ))}
                                                </div>
                                            </section>

                                            <div className="space-y-3">
                                                <section className="menu-side-panel">
                                                    <p className="label mb-2 text-white/50">Em breve</p>
                                                    <div className="space-y-2">
                                                        {upcomingToolsConfig.map((tool) => (
                                                            <Link key={tool.slug} href={tool.href} className="menu-soon-item" onClick={() => setDesktopProductsOpen(false)}>
                                                                <span className="text-sm font-medium text-white/90">{tool.name}</span>
                                                                <span className="text-xs text-white/45">{tool.description}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </section>
                                                <section className="menu-side-panel">
                                                    <p className="label mb-2 text-white/50">Links rápidos</p>
                                                    <div className="space-y-1">
                                                        {quickLinks.map((link) => (
                                                            <Link key={link.href} href={link.href} className="menu-quick-link" onClick={() => setDesktopProductsOpen(false)}>
                                                                {link.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={`px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-white/[0.04] ${isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"}`}>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <Link href="/platform" className={`text-sm font-medium transition-colors px-4 py-2 ${isActive("/platform") ? "text-white" : "text-white/60 hover:text-white"}`}>
                            Login
                        </Link>
                        <Link href="/tools/social-vigilante/demo" className="btn-primary text-sm !py-2.5 !px-6">Testar Grátis</Link>
                    </div>

                    <button type="button" aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileMenuOpen} className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen((prev) => !prev)}>
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.button aria-label="Fechar menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mobile-overlay open" onClick={closeMobileMenu} />
                        <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed top-0 right-0 h-screen w-[92vw] max-w-[430px] bg-[#070D17] border-l border-white/10 z-[101] flex flex-col" aria-label="Menu mobile">
                            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                                <span className="text-sm font-semibold text-white/90">Menu</span>
                                <button type="button" aria-label="Fechar menu" className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-colors" onClick={closeMobileMenu}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 py-5">
                                <button type="button" className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-left" aria-expanded={mobileToolsOpen} aria-controls={mobileToolsId} onClick={() => setMobileToolsOpen((prev) => !prev)}>
                                    <span className="text-sm font-medium text-white">Demos disponíveis</span>
                                    <ChevronDown size={16} className={`text-white/60 transition-transform ${mobileToolsOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {mobileToolsOpen && (
                                        <motion.div id={mobileToolsId} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="mt-3 space-y-3 overflow-hidden">
                                            {toolsConfig.map((tool) => (
                                                <article key={tool.slug} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                                                    <Link href={tool.landingHref} className="block" onClick={closeMobileMenu}>
                                                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
                                                            <Image src={tool.heroImage} alt={tool.name} fill sizes="360px" className="object-cover" />
                                                        </div>
                                                        <p className="mt-3 text-sm font-semibold text-white">{tool.name}</p>
                                                        <p className="mt-1 text-xs text-white/45 truncate">{tool.description}</p>
                                                    </Link>
                                                    <Link href={tool.demoHref} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/75 hover:text-white transition-colors" onClick={closeMobileMenu}>Iniciar Demo <ChevronRight size={14} /></Link>
                                                </article>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="h-px bg-white/[0.08] my-5" />
                                <div className="space-y-1">
                                    {navLinks.map((link) => (
                                        <Link key={link.name} href={link.href} className={`block px-3 py-2 rounded-lg text-base transition-colors ${isActive(link.href) ? "text-white bg-white/[0.06]" : "text-white/70 hover:text-white hover:bg-white/[0.04]"}`} onClick={closeMobileMenu}>
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="h-px bg-white/[0.08] my-5" />
                                <div className="space-y-1">
                                    {quickLinks.map((link) => (
                                        <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors" onClick={closeMobileMenu}>
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 p-5 bg-[#070D17]">
                                <Link href="/tools/social-vigilante/demo" className="btn-primary w-full justify-center" onClick={closeMobileMenu}>
                                    Testar Grátis
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
