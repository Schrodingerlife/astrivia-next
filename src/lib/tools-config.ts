export type ToolSlug = "pharmaroleplay" | "social-vigilante" | "medsafe";

export interface ToolConfig {
    slug: ToolSlug;
    name: string;
    categoryLabel: string;
    headline: string;
    description: string;
    chips: [string, string, string];
    heroImage: string;
    accent: string;
    theme?: "cyan" | "violet" | "emerald";
    howItWorks: string[];
    benefits: string[];
    landingHref: string;
    demoHref: string;
}

export interface UpcomingToolConfig {
    slug: string;
    name: string;
    description: string;
    chips: [string, string];
    heroImage: string;
    href: string;
}

export const toolsConfig: ToolConfig[] = [
    {
        slug: "pharmaroleplay",
        name: "PharmaRoleplay",
        categoryLabel: "TREINAMENTO POR VOZ",
        headline: "Treine vendas por voz com um Médico IA",
        description:
            "Simulador de conversas que treina representantes farmacêuticos com feedback em tempo real sobre tom, argumentação e eficácia. Como um sparring partner que nunca cansa.",
        chips: ["Ramp-up 50% mais rápido", "<200ms latência", "24/7 disponível"],
        heroImage: "/images/product-pharmaroleplay.png",
        accent: "#00D9FF",
        theme: "cyan",
        howItWorks: [
            "Escolha um cenário real de visita médica e inicie o treino.",
            "Converse por voz com o Médico IA e lide com objeções dinâmicas.",
            "Receba score e feedback acionável para evolução contínua.",
        ],
        benefits: [
            "Onboarding mais rápido para equipes de campo.",
            "Padronização da mensagem científica e comercial.",
            "Treinamento imersivo sem dependência de agenda humana.",
        ],
        landingHref: "/tools/pharmaroleplay",
        demoHref: "/tools/pharmaroleplay/demo",
    },
    {
        slug: "social-vigilante",
        name: "Social Vigilante",
        categoryLabel: "VIGILÂNCIA PÓS-MERCADO",
        headline: "Detecte eventos adversos antes dos reportes oficiais",
        description:
            "Monitoramento contínuo de redes sociais, fóruns e Reclame Aqui que capta sinais precoces de farmacovigilância. Alertas em tempo real para sua equipe de segurança.",
        chips: ["100% cobertura pública", "Terabytes/dia", "Alertas em tempo real"],
        heroImage: "/images/product-socialvigilante.png",
        accent: "#A855F7",
        theme: "violet",
        howItWorks: [
            "Defina o medicamento ou termo de monitoramento em segundos.",
            "A IA classifica sentimento, risco e possíveis eventos adversos automaticamente.",
            "A equipe recebe alertas priorizados com contexto e confiança técnica.",
        ],
        benefits: [
            "Detecção antecipada de sinais críticos de segurança.",
            "Menos tempo manual para consolidar menções e evidências.",
            "Visibilidade contínua para decisão de farmacovigilância.",
        ],
        landingHref: "/tools/social-vigilante",
        demoHref: "/tools/social-vigilante/demo",
    },
    {
        slug: "medsafe",
        name: "MedSafe",
        categoryLabel: "COMPLIANCE REGULATÓRIO",
        headline: "Audite materiais promocionais em segundos",
        description:
            "IA auditora treinada na RDC 96 que analisa peças de marketing linha por linha, identifica claims não suportados e sugere correções — tudo com 100% de rastreabilidade.",
        chips: ["90% menos tempo de revisão", "Zero falsos positivos", "Auditoria completa"],
        heroImage: "/images/product-medsafe.png",
        accent: "#10B981",
        theme: "emerald",
        howItWorks: [
            "Cole ou envie o material promocional para análise automatizada.",
            "O sistema aponta violações com artigo da RDC, trecho e sugestão.",
            "Gere relatório de compliance para revisão jurídica e regulatória.",
        ],
        benefits: [
            "Redução drástica de retrabalho em fluxos de aprovação.",
            "Menor risco de claim inadequado ou sem suporte.",
            "Rastreabilidade clara para auditoria e governança.",
        ],
        landingHref: "/tools/medsafe",
        demoHref: "/tools/medsafe/demo",
    },
];

export const upcomingToolsConfig: UpcomingToolConfig[] = [
    {
        slug: "internmatch",
        name: "InternMatch",
        description: "Talent matching com IA semântica",
        chips: ["Em breve", "Vector Search"],
        heroImage: "/images/product-internmatch.jpeg",
        href: "/tools/internmatch",
    },
    {
        slug: "scigen",
        name: "SciGen",
        description: "Geração de conteúdo científico com grounding",
        chips: ["Em breve", "Gemini 3"],
        heroImage: "/images/product-scigen.jpeg",
        href: "/contact",
    },
];

export const toolsConfigBySlug: Record<ToolSlug, ToolConfig> = toolsConfig.reduce(
    (acc, tool) => {
        acc[tool.slug] = tool;
        return acc;
    },
    {} as Record<ToolSlug, ToolConfig>
);

export function getToolConfig(slug: ToolSlug): ToolConfig {
    return toolsConfigBySlug[slug];
}
