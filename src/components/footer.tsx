import Link from "next/link";
import { toolsConfig, upcomingToolsConfig } from "@/lib/tools-config";
import { AstriviaSymbol } from "@/components/product-logos";

const companyLinks = [
    { name: "Tecnologia", href: "/technology" },
    { name: "Time", href: "/team" },
    { name: "Plataforma", href: "/platform" },
    { name: "Status", href: "/status" },
];

const resourceLinks = [
    { name: "Produtos", href: "/products" },
    { name: "Docs", href: "/docs" },
    { name: "Contato", href: "/contact" },
];

const contactLinks = [
    { name: "nicollas.braga@astriviaai.tech", href: "mailto:nicollas.braga@astriviaai.tech", external: true },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/astriviaai/", external: true },
];

export function Footer() {
    return (
        <footer className="footer py-14">
            <div className="site-container">
                <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <AstriviaSymbol size={32} />
                            <span className="text-[18px] font-light tracking-tight text-white/80 leading-none">
                                strivia <span className="text-[#00D9FF] font-semibold">AI</span>
                            </span>
                        </div>
                        <p className="text-white/35 text-sm leading-relaxed max-w-xs">
                            Agentes de IA para Life Sciences — segurança regulatória, rastreabilidade e velocidade de campo.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-white/90">Demos</h4>
                        <div className="space-y-2.5">
                            {toolsConfig.map((tool) => (
                                <Link key={tool.slug} href={tool.demoHref} className="footer-link block">
                                    {tool.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-white/90">Em breve</h4>
                        <div className="space-y-2.5">
                            {upcomingToolsConfig.map((tool) => (
                                <Link key={tool.slug} href={tool.href} className="footer-link block">
                                    {tool.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-white/90">Empresa</h4>
                        <div className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="footer-link block">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-white/90">Recursos</h4>
                        <div className="space-y-2.5 mb-6">
                            {resourceLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="footer-link block">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="space-y-2.5">
                            {contactLinks.map((link) =>
                                link.external ? (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                                        rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                        className="footer-link block"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link key={link.name} href={link.href} className="footer-link block">
                                        {link.name}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className="section-divider mb-6" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-white/25 text-xs">© 2026 Astrivia AI. Todos os direitos reservados.</p>
                    <span className="text-white/25 text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Todos os sistemas online
                    </span>
                </div>
            </div>
        </footer>
    );
}
