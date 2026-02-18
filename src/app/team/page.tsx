"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LinkedinIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TeamMember {
    id?: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    experience: string[];
    quote: string;
    linkedin: string;
}

const defaultTeam: TeamMember[] = [
    {
        name: "Nícollas Braga",
        role: "CEO & Founder",
        image: "/images/team-nicollas.jpg",
        bio: "Fundador da Astrivia AI. Profissional de Farmácia com experiência em PMO, Novos Negócios e Pós-Registro. Lidera a visão estratégica e desenvolvimento de soluções de IA para Life Sciences.",
        experience: ["Founder", "PMO", "Novos Negócios", "Pós-Registro"],
        quote: "A inovação em saúde precisa de velocidade sem comprometer segurança.",
        linkedin: "https://www.linkedin.com/in/nicollas-healthtech/",
    },
    {
        name: "André Guilherme",
        role: "CTO & Co-Founder",
        image: "/images/team-andre.jpg",
        bio: "Profissional de Farmácia com experiência em Estratégia B2B e Desenvolvimento de Produto. Responsável pela arquitetura técnica e desenvolvimento de produtos de IA.",
        experience: ["Estratégia B2B", "Desenvolvimento de Produto", "Tech Lead", "AI Engineering"],
        quote: "Dados e estratégia caminham juntos na indústria farmacêutica.",
        linkedin: "https://www.linkedin.com/in/andretobiasmendes/",
    },
    {
        name: "Gabriel Katakura",
        role: "COO & Co-Founder",
        image: "/images/team/gabriel.jpg?v=2",
        bio: "Profissional de Farmácia com experiência em Qualidade MedTech e Validação Regulatória. Responsável por operações, compliance e validação de produtos.",
        experience: ["Qualidade", "Validação Regulatória", "Compliance", "Operações"],
        quote: "Compliance não é obstáculo, é vantagem competitiva.",
        linkedin: "https://www.linkedin.com/in/gkatakura/",
    },
];

const values = [
    {
        title: "Inovação Científica",
        description: "Aplicamos as últimas descobertas em IA agêntica para resolver problemas reais",
    },
    {
        title: "Rigor Regulatório",
        description: "Zero compromisso com compliance. Nossa IA é auditável e rastreável",
    },
    {
        title: "Velocidade de Execução",
        description: "Entregamos valor em semanas, não anos. Iteração rápida com feedback contínuo",
    },
    {
        title: "Impacto Real",
        description: "Medimos sucesso pelo impacto nos negócios de nossos clientes",
    },
];

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "team"));
                if (!querySnapshot.empty) {
                    const teamData: TeamMember[] = [];
                    querySnapshot.forEach((doc) => {
                        teamData.push({ id: doc.id, ...doc.data() } as TeamMember);
                    });
                    setTeam(teamData);
                }
            } catch (error) {
                console.error("Error loading team from Firestore:", error);
            }
            setLoading(false);
        };
        loadTeam();
    }, []);

    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="label mb-4">Liderança</p>
                    <h1 className="heading-lg mb-4">
                        Nosso <span className="text-gradient-cyan">Time</span>
                    </h1>
                    <p className="body-lg max-w-2xl mx-auto">
                        Profissionais de Farmácia-USP com experiência em Big Pharma
                    </p>
                </motion.div>
            </section>

            {/* Team Members */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00D9FF]" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card rounded-2xl p-8 text-center group"
                                >
                                    <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-[#00D9FF] text-sm font-medium mb-4">{member.role}</p>

                                    <p className="text-white/50 text-sm leading-relaxed mb-4">{member.bio}</p>

                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {member.experience.map((exp) => (
                                            <span
                                                key={exp}
                                                className="tech-badge !text-[10px] !py-1 !px-2"
                                            >
                                                {exp}
                                            </span>
                                        ))}
                                    </div>

                                    <blockquote className="text-white/30 text-sm italic mb-4">
                                        &ldquo;{member.quote}&rdquo;
                                    </blockquote>

                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-xs"
                                    >
                                        <LinkedinIcon size={14} /> LinkedIn ↗
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6 border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="label mb-4 text-[#A855F7]">Valores</p>
                        <h2 className="heading-lg">Nossos Valores</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="glass-card rounded-xl p-6 text-center"
                            >
                                <h3 className="font-semibold mb-3">{value.title}</h3>
                                <p className="text-white/40 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <p className="label mb-4 text-[#10B981]">Parceiros</p>
                        <h2 className="heading-lg mb-4">Parceiros & Tecnologia</h2>
                        <p className="body-lg max-w-xl mx-auto">
                            Construído sobre a infraestrutura de classe mundial do Google Cloud
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center items-center gap-6">
                        {["Google Cloud", "Vertex AI", "USP", "Google for Startups"].map((partner) => (
                            <motion.div
                                key={partner}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="glass-card rounded-xl px-8 py-4 cursor-pointer"
                            >
                                <span className="text-white/40 font-medium text-sm">{partner}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
