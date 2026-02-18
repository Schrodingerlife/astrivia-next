"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Mic,
    Globe,
    Shield,
    Users,
    FileText,
    CheckCircle,
    ArrowRight,
    Play,
} from "lucide-react";

const products = [
    {
        id: "pharmaroleplay",
        image: "/images/product-pharmaroleplay.jpeg",
        icon: <Mic size={32} />,
        title: "PharmaRoleplay",
        category: "Treinamento por Voz",
        badge: "Google Cloud TPU",
        color: "#00D9FF",
        description:
            "Treina equipes de campo em conversas complexas com um 'Médico IA' que responde naturalmente, desafia objeções e avalia performance em tempo real — para que a informação que chega ao consultório seja mais consistente e responsável.",
        patientStory:
            "Uma paciente volta ao consultório confusa e com medo de iniciar o tratamento porque 'ouviu coisas' e a consulta foi rápida. O médico precisa de uma conversa objetiva, com manejo de objeções e clareza de benefício/risco.",
        patientMessage:
            "Melhor conversa no ecossistema = paciente mais seguro para aderir ao tratamento.",
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
        tech: ["Gemini 3 Flash", "Google Cloud TPU", "WebSockets", "<200ms latência"],
        demoUrl: "/tools/pharmaroleplay",
    },
    {
        id: "vigilante",
        image: "/images/product-vigilante.jpeg",
        icon: <Globe size={32} />,
        title: "Social Vigilante",
        category: "Vigilância Pós-Mercado",
        badge: "BigQuery ML",
        color: "#A855F7",
        description:
            "Capta sinais precoces de eventos adversos em grande escala, ingerindo terabytes de dados não estruturados de redes sociais, fóruns e Reclame Aqui — gerando alertas de risco antes dos reportes oficiais.",
        patientStory:
            "O paciente sofre um efeito adverso, mas não procura ajuda por vergonha ou desconhecimento. Ele 'desabafa' num canal acessível — rede social, fórum, Reclame Aqui — e o sinal aparece antes do fluxo formal.",
        patientMessage:
            "O paciente não muda o comportamento de um dia para o outro; a indústria precisa mudar a capacidade de escutar cedo.",
        howItWorks: [
            "Ingestão contínua de dados de Twitter, Instagram, Reclame Aqui",
            "NLP em português para classificação de sentimento e extração de sintomas",
            "Matching com perfil de eventos adversos conhecidos (MedDRA)",
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
        category: "Compliance Regulatório",
        badge: "Vertex AI Search",
        color: "#10B981",
        description:
            "IA auditora treinada na RDC 96 que analisa materiais promocionais em segundos com grounding e rastreabilidade — reduzindo erro humano e risco regulatório em peças de marketing.",
        patientStory:
            "Um paciente cria expectativa irreal ('cura garantida', 'sem risco') por causa de comunicação mal calibrada, e isso vira frustração, descontinuação e risco.",
        patientMessage:
            "Linguagem segura protege o paciente de promessa e protege o médico de ruído.",
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
        demoUrl: "/tools/medsafe",
    },
    {
        id: "internmatch",
        image: "/images/product-internmatch.jpeg",
        icon: <Users size={32} />,
        title: "InternMatch",
        category: "Talent Matching",
        badge: "Vector Search",
        color: "#F59E0B",
        description:
            "Plataforma de recrutamento inteligente que conecta universitários de todos os cursos às melhores oportunidades de estágio e emprego usando IA semântica.",
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
        demoUrl: "/contact",
    },
    {
        id: "scigen",
        image: "/images/product-scigen.jpeg",
        icon: <FileText size={32} />,
        title: "SciGen",
        category: "Geração de Conteúdo",
        badge: "Gemini 3",
        color: "#EC4899",
        description:
            "Transforma estudos clínicos densos em conteúdo acessível para médicos e pacientes, com citações automáticas verificáveis e anti-alucinação.",
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
        tech: ["Gemini 3 Pro", "Anti-hallucination", "Citation Grounding"],
    },
];

export default function ProductsPage() {
    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="label mb-4 text-[#00D9FF]">Ecossistema</p>
                    <h1 className="heading-lg mb-4">
                        Nossos <span className="text-gradient-cyan">Produtos</span>
                    </h1>
                    <p className="body-lg max-w-3xl mx-auto">
                        5 ferramentas integradas em um ecossistema inteligente — cada uma resolve
                        um elo da cadeia que conecta a indústria ao paciente
                    </p>
                </motion.div>
            </section>

            {/* Products Detail */}
            {products.map((product, index) => (
                <section
                    key={product.id}
                    id={product.id}
                    className={`py-24 px-6 ${index % 2 === 0 ? "border-t border-white/[0.04]" : ""}`}
                >
                    <div className="max-w-7xl mx-auto">
                        <div
                            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
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
                                    className="rounded-2xl border border-white/[0.08] w-full"
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
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                                        style={{ background: `${product.color}12`, color: product.color }}
                                    >
                                        {product.icon}
                                    </div>
                                    <div>
                                        <p className="label" style={{ color: product.color }}>
                                            {product.category}
                                        </p>
                                        <h2 className="heading-md">{product.title}</h2>
                                    </div>
                                </div>

                                <span className="tech-badge mb-6 inline-block">{product.badge}</span>

                                <p className="text-white/50 text-lg leading-relaxed mb-6">
                                    {product.description}
                                </p>

                                {/* Patient Story */}
                                {product.patientStory && (
                                    <div className="glass-card rounded-xl p-4 mb-4 border-l-4" style={{ borderLeftColor: `${product.color}60` }}>
                                        <p className="text-sm font-medium mb-1" style={{ color: product.color }}>
                                            A história do paciente:
                                        </p>
                                        <p className="text-white/45 text-sm italic">{product.patientStory}</p>
                                    </div>
                                )}

                                {/* Patient Message */}
                                {product.patientMessage && (
                                    <div className="rounded-xl p-3 mb-6" style={{ background: `${product.color}08`, border: `1px solid ${product.color}15` }}>
                                        <p className="text-sm italic" style={{ color: `${product.color}cc` }}>
                                            {product.patientMessage}
                                        </p>
                                    </div>
                                )}

                                {/* How it works */}
                                <div className="mb-6">
                                    <p className="text-sm font-medium mb-3" style={{ color: product.color }}>
                                        Como funciona:
                                    </p>
                                    <ul className="space-y-2">
                                        {product.howItWorks.map((step, i) => (
                                            <li key={i} className="flex items-start gap-2 text-white/50 text-sm">
                                                <ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: product.color }} />
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
                                            className="glass-card rounded-lg p-3 text-center text-xs text-white/60"
                                        >
                                            <CheckCircle size={16} className="text-[#10B981] mx-auto mb-1" />
                                            {benefit}
                                        </div>
                                    ))}
                                </div>

                                {/* Tech */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {product.tech.map((t) => (
                                        <span key={t} className="tech-badge !text-xs">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Demo Button */}
                                {product.demoUrl && (
                                    <Link
                                        href={product.demoUrl}
                                        className="btn-primary inline-flex items-center gap-2"
                                    >
                                        <Play size={18} />
                                        Testar Demo
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
