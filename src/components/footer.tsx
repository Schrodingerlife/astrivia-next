import Link from "next/link";

const productLinks = [
    { name: "PharmaRoleplay", href: "/tools/pharmaroleplay" },
    { name: "Social Vigilante", href: "/tools/social-vigilante" },
    { name: "MedSafe AI", href: "/tools/medsafe" },
    { name: "Ver todos", href: "/products" },
];

const companyLinks = [
    { name: "Tecnologia", href: "/technology" },
    { name: "Time", href: "/team" },
    { name: "Docs", href: "/docs" },
    { name: "Status", href: "/status" },
];

const contactLinks = [
    { name: "Fale Conosco", href: "/contact" },
    { name: "nicollas.braga@astriviaai.tech", href: "mailto:nicollas.braga@astriviaai.tech", external: true },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/astriviaai/", external: true },
];

export function Footer() {
    return (
        <footer className="footer py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/astrivia-logo-fixed.png"
                            alt="Astrivia AI"
                            className="h-8 mb-4 opacity-60"
                        />
                        <p className="text-white/30 text-sm leading-relaxed">
                            Sistema de agentes autônomos para Life Sciences. Powered by Google Cloud.
                        </p>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">Produtos</h4>
                        <div className="space-y-3">
                            {productLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="footer-link block">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">Empresa</h4>
                        <div className="space-y-3">
                            {companyLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="footer-link block">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">Contato</h4>
                        <div className="space-y-3">
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

                <div className="section-divider mb-8" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/20 text-xs">
                        © 2025 Astrivia AI. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-white/20 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Todos os sistemas operacionais
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
