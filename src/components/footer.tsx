import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

const productLinks = [
    { name: "PharmaRoleplay", href: "/products#pharmaroleplay" },
    { name: "Social Vigilante", href: "/products#vigilante" },
    { name: "MedSafe AI", href: "/products#medsafe" },
    { name: "InternMatch", href: "/products#internmatch" },
    { name: "SciGen", href: "/products#scigen" },
];

const companyLinks = [
    { name: "Team", href: "/team" },
    { name: "Technology", href: "/technology" },
    { name: "Documentation", href: "/docs" },
    { name: "Status", href: "/status" },
    { name: "Contact", href: "/contact" },
];

export function Footer() {
    return (
        <footer className="py-16 px-6 border-t border-white/5 bg-[#0A1628]">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Logo & Description */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center mb-4 group">
                            <Image
                                src="/images/astrivia-logo-fixed.png"
                                alt="Astrivia AI"
                                width={150}
                                height={40}
                                className="h-10 w-auto object-contain opacity-90"
                            />
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Intelligence that Cures Inefficiency
                        </p>
                        <p className="text-white/30 text-xs mt-6">
                            © 2025 Astrivia AI. All rights reserved.
                        </p>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Products</h4>
                        <ul className="space-y-2">
                            {productLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/50 hover:text-[#00D9FF] text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/50 hover:text-[#00D9FF] text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & Social */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            <a
                                href="https://www.linkedin.com/company/astriviaai/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-[#00D9FF] transition-colors"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="mailto:nicollas.braga@astriviaai.tech"
                                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-[#00D9FF] transition-colors"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-white/40 hover:text-white/60 text-sm transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-white/40 hover:text-white/60 text-sm transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/30 text-sm">
                        Built with dedication by Astrivia Team | Powered by{" "}
                        <span className="text-[#00D9FF]">Google Cloud</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
