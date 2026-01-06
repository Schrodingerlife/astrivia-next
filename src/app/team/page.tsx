"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Loader2 } from "lucide-react";
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

// Dados padrão caso Firestore esteja vazio ou offline
const defaultTeam: TeamMember[] = [
    {
        name: "Nícollas Braga",
        role: "CEO & Founder",
        image: "/images/team-nicollas.jpg",
        bio: "Liderança em Marketing de Doenças Raras em Big Pharma. Farmácia-USP. Especialista em estratégias de go-to-market para medicamentos de alto custo e baixa prevalência.",
        experience: ["Big Pharma", "Doenças Raras", "Marketing", "Farmácia-USP"],
        quote: "A inovação em saúde precisa de velocidade sem comprometer segurança.",
        linkedin: "https://www.linkedin.com/in/nicollas-souza-788987256/",
    },
    {
        name: "André Guilherme",
        role: "CSO",
        image: "/images/team-andre.jpg",
        bio: "Ex-Marketing Sanofi. Estratégia B2B e Finanças. Farmácia-USP. Experiência em construção de modelos de negócio e precificação para mercado farmacêutico.",
        experience: ["Sanofi", "B2B Strategy", "Finanças", "Farmácia-USP"],
        quote: "Dados e estratégia caminham juntos na indústria farmacêutica.",
        linkedin: "https://www.linkedin.com/in/andretobiasmendes/",
    },
    {
        name: "Gabriel Katakura",
        role: "CCO",
        image: "/images/team/gabriel.jpg",
        bio: "Qualidade na Boston Scientific. Validação Regulatória. Farmácia-USP. Background em garantia de qualidade e compliance para dispositivos médicos.",
        experience: ["Boston Scientific", "Qualidade", "Regulatório", "Farmácia-USP"],
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
                // Usa dados padrão em caso de erro
            }
            setLoading(false);
        };
        loadTeam();
    }, []);

    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-16 px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Nosso <span className="text-gradient-cyan">Time</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 text-lg max-w-2xl mx-auto"
                >
                    Nascidos na USP, Forjados na Indústria Farmacêutica
                </motion.p>
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
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card rounded-3xl p-8 text-center group"
                                >
                                    <div className="relative w-[160px] h-[160px] mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#00D9FF]/20 group-hover:border-[#00D9FF]/50 transition-colors">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-[#00D9FF] text-sm font-medium mb-4">{member.role}</p>

                                    <p className="text-white/60 text-sm leading-relaxed mb-4">{member.bio}</p>

                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {member.experience.map((exp) => (
                                            <span
                                                key={exp}
                                                className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50"
                                            >
                                                {exp}
                                            </span>
                                        ))}
                                    </div>

                                    <blockquote className="text-white/40 text-sm italic mb-4">
                                        {`"${member.quote}"`}
                                    </blockquote>

                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-white/40 hover:text-[#00D9FF] transition-colors text-sm"
                                    >
                                        <Linkedin size={16} /> LinkedIn
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6 bg-[#0D1B2A]">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        Nossos Valores
                    </motion.h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-xl p-6 text-center"
                            >
                                <h3 className="text-lg font-bold text-[#00D9FF] mb-3">{value.title}</h3>
                                <p className="text-white/50 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold mb-4"
                    >
                        Parceiros & Tecnologia
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-white/60 mb-12"
                    >
                        Construído sobre a infraestrutura de classe mundial do Google Cloud
                    </motion.p>

                    <div className="flex flex-wrap justify-center items-center gap-12">
                        {["Google Cloud", "Vertex AI", "USP", "Google for Startups"].map((partner) => (
                            <motion.div
                                key={partner}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="glass rounded-xl px-8 py-4 partner-logo cursor-pointer"
                            >
                                <span className="text-white/50 font-medium">{partner}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
