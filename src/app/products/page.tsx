"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
    Mic,
    Globe,
    Shield,
    Wand2,
    Users,
    FileText,
    CheckCircle,
    ArrowRight,
    ExternalLink,
} from "lucide-react";

const products = [
    {
        id: "pharmaroleplay",
        image: "/images/product-pharmaroleplay.jpeg",
        icon: <Mic size={32} />,
        title: "PharmaRoleplay",
        category: "High-Compute Training",
        badge: "Google Cloud TPU",
        description:
            "Simulador de vendas farmacêuticas por voz com IA em tempo real. Representantes treinam com um 'Médico IA' que responde naturalmente, desafia objeções e avalia a performance.",
        problem:
            "Treinamentos presenciais são caros, infrequentes e não escalam. Novos representantes levam meses para atingir proficiência.",
        howItWorks: [
            "Representante inicia sessão de roleplay por voz",
            "IA assume papel de médico com diferentes perfis (cético, ocupado, técnico)",
            "Feedback em tempo real sobre tom, argumentação e compliance",
            "Relatório detalhado com pontos de melhoria e playbacks",
        ],
        benefits: [
            "Redução de 50% no tempo de ramp-up",
            "Treinamento 24/7 sem custos de facilitador",
            "Padronização de mensagem em todo o time",
        ],
        tech: ["Gemini 1.5 Pro", "Google Cloud TPU", "WebSockets", "<200ms latência"],
        demoUrl: "https://pharmaroleplay-frontend-gzsqkmnyna-uc.a.run.app",
    },
    {
        id: "vigilante",
        image: "/images/product-vigilante.jpeg",
        icon: <Globe size={32} />,
        title: "Social Vigilante",
        category: "Pharmacovigilance",
        badge: "BigQuery ML",
        description:
            "Farmacovigilância proativa em escala de terabytes. Monitoramos redes sociais, fóruns e Reclame Aqui para detectar sinais de eventos adversos antes dos reportes oficiais.",
        problem:
            "Eventos adversos são reportados com dias ou semanas de atraso. Detecção manual não escala para o volume de menções online.",
        howItWorks: [
            "Ingestão contínua de dados de Twitter, Instagram, Reclame Aqui",
            "NLP em português para classificação de sentimento e extração de sintomas",
            "Matching com perfil de eventos adversos conhecidos",
            "Alertas automáticos para equipe de farmacovigilância",
        ],
        benefits: [
            "Detecção antecipada de sinais de segurança",
            "Cobertura de 100% das menções públicas",
            "Relatórios prontos para ANVISA",
        ],
        tech: ["BigQuery ML", "Vertex AI NLP", "Pub/Sub", "Terabytes/dia"],
        demoUrl: "/tools/social-vigilante",
    },
    {
        id: "medsafe",
        image: "/images/product-medsafe.jpeg",
        icon: <Shield size={32} />,
        title: "MedSafe AI",
        category: "Regulatory Compliance",
        badge: "Vertex AI Search",
        description:
            "Auditoria de materiais promocionais com zero alucinação. IA treinada na íntegra da RDC 96 que identifica violações e sugere correções em segundos.",
        problem:
            "Revisão regulatória manual leva dias ou semanas. Erros chegam ao material final causando recalls e multas.",
        howItWorks: [
            "Upload de material promocional (PDF, imagem, vídeo)",
            "Análise linha por linha contra base de legislação",
            "Identificação de claims não suportados ou proibidos",
            "Sugestões de redação conforme com 100% rastreabilidade",
        ],
        benefits: [
            "Redução de 90% no tempo de revisão",
            "Zero falsos positivos com grounding",
            "Auditoria completa para inspetores",
        ],
        tech: ["Vertex AI Search", "Grounded Generation", "RAG", "100% compliance"],
        demoUrl: "https://medsafe-backend-759156439718.us-central1.run.app/",
    },
    {
        id: "internmatch",
        image: "/images/product-internmatch.jpeg",
        icon: <Users size={32} />,
        title: "InternMatch",
        category: "Talent Matching",
        badge: "Vector Search",
        description:
            "Plataforma de recrutamento inteligente para universitários de todos os cursos. Conectamos estudantes às melhores oportunidades de estágio e emprego usando IA semântica.",
        problem:
            "Currículos são filtrados por keywords, perdendo candidatos qualificados. Estudantes de qualquer área têm dificuldade em encontrar vagas compatíveis com seu perfil.",
        howItWorks: [
            "Embeddings de vagas e currículos em espaço semântico",
            "Matching por similaridade considerando experiências e habilidades",
            "Score de compatibilidade com explicação personalizada",
            "Conexão direta entre estudantes e empresas",
        ],
        benefits: [
            "80% menos tempo em triagem",
            "Oportunidades para todos os cursos",
            "Matching inteligente sem bias",
        ],
        tech: ["Vertex AI Embeddings", "Vector Search", "Semantic Matching"],
        demoUrl: "https://intermatch-5051b.web.app/",
    },
    {
        id: "scigen",
        image: "/images/product-scigen.jpeg",
        icon: <FileText size={32} />,
        title: "SciGen",
        category: "Content Generation",
        badge: "Gemini Pro",
        description:
            "Transformação de estudos clínicos densos em conteúdo acessível. Gere materiais para médicos e pacientes com citações automáticas e verificação anti-alucinação.",
        problem:
            "Médicos não têm tempo de ler estudos completos. Pacientes não entendem linguagem técnica. Criação de conteúdo é lenta e cara.",
        howItWorks: [
            "Upload de estudo clínico ou paper científico",
            "Extração de principais findings e evidências",
            "Geração de sumário executivo para médicos",
            "Versão simplificada para pacientes com citações [1][2][3]",
        ],
        benefits: [
            "Conteúdo em horas, não semanas",
            "100% baseado em evidências",
            "Citações rastreáveis para verificação",
        ],
        tech: ["Gemini Pro", "Anti-hallucination", "Citation Grounding"],
    },
];

export default function ProductsPage() {
    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-16 px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Nossos <span className="text-gradient-cyan">Produtos</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 text-lg max-w-2xl mx-auto"
                >
                    6 ferramentas integradas em um ecossistema inteligente para transformar
                    operações farmacêuticas
                </motion.p>
            </section>

            {/* Products Detail */}
            {products.map((product, index) => (
                <section
                    key={product.id}
                    id={product.id}
                    className={`py-24 px-6 ${index % 2 === 0 ? "bg-[#0D1B2A]" : ""}`}
                >
                    <div className="max-w-7xl mx-auto">
                        <div
                            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Image */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={index % 2 === 1 ? "lg:order-2" : ""}
                            >
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    width={600}
                                    height={400}
                                    className="rounded-3xl shadow-2xl w-full"
                                />
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={index % 2 === 1 ? "lg:order-1" : ""}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF]">
                                        {product.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-wider">
                                            {product.category}
                                        </p>
                                        <h2 className="text-3xl font-bold">{product.title}</h2>
                                    </div>
                                </div>

                                <span className="tech-badge mb-6 inline-block">{product.badge}</span>

                                <p className="text-white/70 text-lg leading-relaxed mb-6">
                                    {product.description}
                                </p>

                                {/* Problem */}
                                <div className="glass-card rounded-xl p-4 mb-6">
                                    <p className="text-sm text-[#F59E0B] font-medium mb-1">
                                        Problema que resolve:
                                    </p>
                                    <p className="text-white/60 text-sm">{product.problem}</p>
                                </div>

                                {/* How it works */}
                                <div className="mb-6">
                                    <p className="text-sm text-[#00D9FF] font-medium mb-3">
                                        Como funciona:
                                    </p>
                                    <ul className="space-y-2">
                                        {product.howItWorks.map((step, i) => (
                                            <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                                                <ArrowRight size={14} className="text-[#00D9FF] mt-1 flex-shrink-0" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Benefits */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                                    {product.benefits.map((benefit, i) => (
                                        <div
                                            key={i}
                                            className="glass rounded-lg p-3 text-center text-xs text-white/70"
                                        >
                                            <CheckCircle size={16} className="text-[#10B981] mx-auto mb-1" />
                                            {benefit}
                                        </div>
                                    ))}
                                </div>

                                {/* Tech */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {product.tech.map((t) => (
                                        <span key={t} className="tech-badge text-xs">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Demo Button */}
                                {product.demoUrl && (
                                    <a
                                        href={product.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2"
                                    >
                                        <ExternalLink size={18} />
                                        Acessar Demo
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
