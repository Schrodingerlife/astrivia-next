"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Play,
  Mic,
  Globe,
  Shield,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Award,
} from "lucide-react";
import {
  PharmaRoleplayLogo,
  SocialVigilanteLogo,
  MedSafeLogo,
  InternMatchLogo,
  SciGenLogo,
  HeroBackgroundSVG,
} from "@/components/product-logos";
import {
  ConvergeFlowSVG,
  OrbitalEcosystemSVG,
  InfraGridSVG,
} from "@/components/home/SectionBackgrounds";

/* ============== PRODUCT ILLUSTRATIONS (Image-based) ============== */
function PharmaRoleplayVisual() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-[#00D9FF]/10 group">
      <Image
        src="/images/product-pharmaroleplay.png"
        alt="PharmaRoleplay - Simulador de treinamento por voz com IA"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}

function SocialVigilanteVisual() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-[#A855F7]/10 group">
      <Image
        src="/images/product-socialvigilante.png"
        alt="Social Vigilante - Dashboard de vigilância pós-mercado"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}

function MedSafeVisual() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-[#10B981]/10 group">
      <Image
        src="/images/product-medsafe.png"
        alt="MedSafe AI - Auditoria de compliance regulatório"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}

/* ============== DATA ============== */
const mainProducts = [
  {
    id: "pharmaroleplay",
    icon: <PharmaRoleplayLogo size={40} />,
    title: "PharmaRoleplay",
    headline: "Treine seu time para a conversa que muda a adesão do paciente",
    description: "Antes de um paciente decidir aderir ao tratamento, existe uma conversa no consultório. O PharmaRoleplay treina representantes para que essa conversa seja clara, objetiva e responsável — com feedback de IA em tempo real sobre tom, manejo de objeções e argumentação clínica.",
    badge: "Google Cloud TPU",
    category: "Treinamento por Voz",
    demoUrl: "/tools/pharmaroleplay/demo",
    color: "#00D9FF",
    visual: <PharmaRoleplayVisual />,
    metrics: ["Ramp-up 50% mais rápido", "<200ms latência", "24/7 disponível"],
  },
  {
    id: "vigilante",
    icon: <SocialVigilanteLogo size={40} />,
    title: "Social Vigilante",
    headline: "Escute o paciente antes do reporte formal",
    description: "O paciente não desabafa nos canais oficiais — ele vai ao Twitter, ao Reclame Aqui, ao fórum de pacientes. O Social Vigilante captura esses sinais em tempo real, antes que virem notificações formais, transformando pós-mercado reativo em vigilância preditiva.",
    badge: "BigQuery ML",
    category: "Vigilância Pós-Mercado",
    demoUrl: "/tools/social-vigilante/demo",
    color: "#A855F7",
    visual: <SocialVigilanteVisual />,
    metrics: ["100% cobertura pública", "Terabytes/dia", "Alertas em tempo real"],
  },
  {
    id: "medsafe",
    icon: <MedSafeLogo size={40} />,
    title: "MedSafe AI",
    headline: "Proteja o paciente da promessa errada — e sua empresa do risco regulatório",
    description: "Uma promessa exagerada cria expectativa irreal, que vira frustração, descontinuação e risco. O MedSafe AI audita seus materiais contra a RDC 96 linha por linha, com grounding em norma e rastreabilidade total — para que a linguagem que chega ao paciente seja segura e auditável.",
    badge: "Vertex AI",
    category: "Compliance Regulatório",
    demoUrl: "/tools/medsafe/demo",
    color: "#10B981",
    visual: <MedSafeVisual />,
    metrics: ["90% menos tempo de revisão", "Zero falsos positivos", "Auditoria completa"],
  },
];

const comingSoonProducts = [
  {
    id: "internmatch",
    icon: <InternMatchLogo size={40} />,
    title: "InternMatch",
    description: "Conecta universitários às melhores oportunidades de estágio usando matching semântico com IA.",
    badge: "Vector Search",
    category: "Talent Matching",
    color: "#F59E0B",
  },
  {
    id: "scigen",
    icon: <SciGenLogo size={40} />,
    title: "SciGen",
    description: "Transforma estudos clínicos em conteúdo acessível com citações verificáveis e anti-alucinação.",
    badge: "Gemini 3",
    category: "Geração de Conteúdo",
    color: "#EC4899",
  },
];

const impactStats = [
  { value: "90", suffix: "%", label: "Menos tempo de revisão" },
  { value: "50", suffix: "%", label: "Ramp-up mais rápido" },
  { value: "100", suffix: "%", label: "Cobertura de menções" },
  { value: "5", suffix: "", label: "Produtos no ecossistema" },
];

/* ============== PAGE ============== */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ManifestoSection />
      <TrustedBySection />
      <ProductShowcase />
      <ComingSoonSection />
      <StatsSection />
      <StepsSection />
      <TeamSection />
      <CTASection />
    </div>
  );
}

/* ============== HERO ============== */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 px-6 overflow-hidden">
      {/* Rich background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050510] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      {/* Pharma-themed hero background image */}
      <div className="absolute inset-0 opacity-[0.12]">
        <Image
          src="/images/hero-pharma-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <HeroBackgroundSVG />
      {/* Ecosystem convergence — full-width, all streams toward patient center */}
      <ConvergeFlowSVG className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" />
      {/* Orbital ecosystem — left side */}
      <OrbitalEcosystemSVG className="absolute left-[-120px] top-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-15 pointer-events-none" />
      {/* Orbital ecosystem — right side */}
      <OrbitalEcosystemSVG className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-[380px] h-[380px] opacity-12 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[900px] gradient-orb gradient-orb-cyan" />
      <div className="absolute top-[20%] right-0 w-[600px] h-[600px] gradient-orb gradient-orb-purple" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] gradient-orb gradient-orb-green opacity-20" />
      {/* Subtle radial spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,217,255,0.06),transparent_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm text-white/40 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Powered by Google Cloud &amp; Gemini
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="heading-xl mb-10"
        >
          A cadeia que conecta
          <br />
          <span className="text-gradient-cyan rotating-text-container">
            <span className="rotating-text-inner">
              <span>treinamento</span>
              <span>compliance</span>
              <span>vigilância</span>
              <span>inovação</span>
            </span>
          </span>
          <br />
          ao paciente
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          A plataforma de agentes de IA para Life Sciences.
          Velocidade de campo com segurança regulatória — rastreável, auditável, escalável.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/tools/social-vigilante/demo" className="btn-primary text-base px-8 py-4">
            Testar Demo Grátis <ArrowRight size={18} />
          </Link>
          <Link href="/contact" className="btn-outline text-base px-8 py-4">
            Agendar Demonstração
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 scroll-indicator"
        >
          <div className="w-6 h-10 rounded-full border border-white/10 flex justify-center pt-2 mx-auto">
            <div className="w-1 h-2.5 bg-white/20 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============== TRUSTED BY (Social Proof) ============== */
function TrustedBySection() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Glow divider at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/20 to-transparent" />
      <div className="absolute inset-0 bg-section-elevated" />
      {/* Infrastructure grid — Google Cloud / Vertex AI backbone */}
      <InfraGridSVG className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <p className="text-center text-white/25 text-xs mb-10 tracking-[0.2em] uppercase">
          Construído sobre
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
          {[
            "Google Cloud",
            "Vertex AI",
            "Google for Startups",
            "USP",
          ].map((partner) => (
            <span key={partner} className="text-white/25 text-lg font-medium hover:text-white/50 transition-colors cursor-default">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== PRODUCT SHOWCASE (Shopify-style full-width sections) ============== */
function ProductShowcase() {
  return (
    <section className="relative pt-20 pb-10 overflow-hidden">
      {/* Background mesh gradient for depth */}
      <div className="absolute inset-0 bg-mesh-gradient" />
      {/* Tools ecosystem — orbital on right, converge on left */}
      <OrbitalEcosystemSVG className="absolute right-[-80px] top-[10%] w-[420px] h-[420px] opacity-18 pointer-events-none" />
      <ConvergeFlowSVG className="absolute left-[-60px] bottom-[10%] w-[460px] h-[400px] opacity-22 pointer-events-none" />
      {/* Mid-section orbital */}
      <OrbitalEcosystemSVG className="absolute left-[5%] top-[45%] w-[280px] h-[280px] opacity-12 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] gradient-orb gradient-orb-cyan opacity-20" />
      <div className="absolute bottom-[30%] left-0 w-[400px] h-[400px] gradient-orb gradient-orb-purple opacity-15" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="label mb-4 text-[#00D9FF]">Produtos</p>
          <h2 className="heading-lg mb-6">
            Cada ferramenta resolve um elo<br className="hidden md:block" /> da cadeia até o paciente
          </h2>
          <p className="text-lg text-white/45 max-w-xl mx-auto">
            3 demos disponíveis agora. Teste direto no navegador.
          </p>
        </motion.div>
      </div>

      {/* Full-width alternating product sections */}
      {mainProducts.map((product, index) => (
        <div key={product.id} className="relative py-16 md:py-24">
          {/* Per-section colored glow */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-[0.06]"
            style={{
              background: product.color,
              [index % 2 === 0 ? 'left' : 'right']: '-10%',
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${index % 2 === 1 ? "" : ""
              }`}>
              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={index % 2 === 1 ? "lg:order-2" : ""}
              >
                {product.visual}
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={index % 2 === 1 ? "lg:order-1" : ""}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-shrink-0">
                    {product.icon}
                  </div>
                  <span className="label" style={{ color: product.color }}>{product.category}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  {product.headline}
                </h3>

                <p className="text-lg text-white/50 leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {product.metrics.map((m) => (
                    <span key={m} className="text-sm px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50">
                      {m}
                    </span>
                  ))}
                </div>

                <Link
                  href={product.demoUrl}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all group"
                >
                  Testar Demo
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ============== COMING SOON ============== */
function ComingSoonSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      {/* Expanding ecosystem — more tools joining the orbit */}
      <OrbitalEcosystemSVG className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-25 pointer-events-none" />
      <InfraGridSVG className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] gradient-orb gradient-orb-amber opacity-20" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="label mb-8 text-center"
        >
          Em breve
        </motion.p>
        <div className="grid md:grid-cols-2 gap-6">
          {comingSoonProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-8 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  {product.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-xs text-white/30">{product.category}</p>
                </div>
              </div>
              <p className="text-white/45 text-sm leading-relaxed">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== STATS ============== */
function StatsSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1117] via-[#0d0f14] to-[#0a0a0a]" />
      {/* Infrastructure grid — Google backbone visual */}
      <InfraGridSVG className="absolute inset-0 w-full h-full pointer-events-none opacity-100" />
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,217,255,0.05),transparent_70%)]" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {impactStats.map((stat, i) => (
            <AnimatedStat key={i} stat={stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({ stat, delay }: { stat: typeof impactStats[number]; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const end = parseInt(stat.value);
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <p className="stat-number text-5xl md:text-6xl">
        {count}<span className="text-white/20">{stat.suffix}</span>
      </p>
      <p className="text-white/35 text-sm mt-3">{stat.label}</p>
    </motion.div>
  );
}

/* ============== STEPS ============== */
function StepsSection() {
  const steps = [
    { num: "01", title: "Escolha o elo que quer resolver", desc: "PharmaRoleplay, Social Vigilante ou MedSafe — cada agente atua em um ponto crítico da jornada do paciente." },
    { num: "02", title: "Teste direto no navegador", desc: "Sem instalação, sem conta. Acesse a demo e veja o agente em ação com seus próprios dados em tempo real." },
    { num: "03", title: "Implante no seu workflow", desc: "APIs documentadas, infraestrutura Google Cloud, e suporte para integração com seus sistemas e processos existentes." },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient" />
      <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] gradient-orb gradient-orb-green opacity-15" />
      {/* Ecosystem convergence — streams flowing toward patient */}
      <ConvergeFlowSVG className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[520px] h-[440px] opacity-35 pointer-events-none" />
      {/* Orbital ecosystem — left side, smaller */}
      <OrbitalEcosystemSVG className="absolute left-[-80px] top-1/2 -translate-y-1/2 w-[320px] h-[320px] opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="label mb-4 text-[#10B981]">Como funciona</p>
          <h2 className="heading-lg">É simples começar</h2>
        </motion.div>

        <div className="space-y-20">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 md:gap-12 items-start"
            >
              <span className="step-number flex-shrink-0 w-20">{step.num}</span>
              <div className="pt-2">
                <h3 className="text-2xl md:text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>{step.title}</h3>
                <p className="text-white/45 text-lg max-w-lg leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link href="/tools/social-vigilante/demo" className="btn-primary text-base px-8 py-4">
            Comece agora <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ============== TEAM ============== */
function TeamSection() {
  const team = [
    {
      name: "Nícollas Braga",
      role: "CEO & Founder",
      desc: "PMO · Novos Negócios · Pós-Registro",
      image: "/images/team-nicollas.jpg",
      linkedin: "https://www.linkedin.com/in/nicollas-healthtech/",
    },
    {
      name: "André Guilherme",
      role: "CTO & Co-Founder",
      desc: "Estratégia B2B · Desenvolvimento de Produto",
      image: "/images/team-andre.jpg",
      linkedin: "https://www.linkedin.com/in/andretobiasmendes/",
    },
    {
      name: "Gabriel Katakura",
      role: "COO & Co-Founder",
      desc: "Qualidade · Validação Regulatória",
      image: "/images/team/gabriel.jpg?v=2",
      linkedin: "https://www.linkedin.com/in/gkatakura/",
    },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      <div className="absolute top-[20%] right-0 w-[400px] h-[400px] gradient-orb gradient-orb-cyan opacity-10" />
      {/* Orbital ecosystem — founders surrounded by the ecosystem they built */}
      <OrbitalEcosystemSVG className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[380px] h-[380px] opacity-30 pointer-events-none" />
      <OrbitalEcosystemSVG className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-18 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="label mb-4">Liderança</p>
          <h2 className="heading-lg">
            Da operação ao regulatório —<br className="hidden md:block" /> founders que viveram cada elo da cadeia
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border border-white/[0.08] group-hover:border-[#00D9FF]/30 transition-colors">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-[#00D9FF] text-sm font-medium mb-1">{member.role}</p>
              <p className="text-white/40 text-sm mb-3">{member.desc}</p>
              <Link
                href={member.linkedin}
                target="_blank"
                className="text-xs text-white/25 hover:text-white/60 transition-colors"
              >
                LinkedIn ↗
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== CTA ============== */
function CTASection() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0e18] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      {/* The full ecosystem convergence — everything flowing toward the patient */}
      <ConvergeFlowSVG className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" />
      {/* Central glow intensified */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(0,217,255,0.08),transparent_60%)]" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] gradient-orb gradient-orb-purple opacity-20" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] gradient-orb gradient-orb-cyan opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-lg mb-8"
        >
          A infraestrutura invisível que faz<br className="hidden md:block" /> a história do paciente chegar ao desfecho certo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-white/45 mb-12 leading-relaxed"
        >
          Time bem treinado. Linguagem segura. Vigilância ativa.
          Com rastreabilidade em cada etapa — porque quando a estrutura falha, quem paga é o paciente.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/contact" className="btn-primary text-base px-8 py-4">
            Agendar Demonstração <ArrowRight size={18} />
          </Link>
          <Link href="/tools/social-vigilante/demo" className="btn-outline text-base px-8 py-4">
            <Play size={16} /> Testar Demo Grátis
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ============== MANIFESTO ============== */
function ManifestoSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#0A1628]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0D1B2A] to-[#0A1628]" />
      {/* Ecosystem convergence — everything flowing toward the patient */}
      <ConvergeFlowSVG className="absolute right-0 top-0 w-[360px] h-[320px] opacity-12 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-[#00D9FF] text-sm font-semibold uppercase tracking-widest mb-4">
            Por que existimos
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            Cada paciente tem uma história
          </h2>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="relative bg-white/[0.03] backdrop-blur-sm rounded-2xl p-8 md:p-12 border-l-4 border-[#00D9FF]"
        >
          <p className="text-white/80 text-lg md:text-2xl leading-relaxed italic font-light">
            &ldquo;Alguém precisa explicar bem. Alguém precisa comunicar sem exageros.
            Alguém precisa treinar o time para lidar com dúvidas. E alguém precisa
            escutar sinais de risco no mundo real.&rdquo;
          </p>
          <p className="text-white/50 text-base md:text-lg mt-8 not-italic">
            A Astrivia constrói essa cadeia para ser rápida, segura e auditável — porque
            eficiência em Life Sciences não é economia: <span className="text-white font-medium">é cuidado.</span>
          </p>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-4 mt-10"
        >
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 text-center hover:bg-white/[0.05] transition-colors">
            <Mic size={24} className="text-[#00D9FF] mx-auto mb-3" />
            <p className="text-white/70 text-sm">Campo treinado para conversas difíceis</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 text-center hover:bg-white/[0.05] transition-colors">
            <Shield size={24} className="text-[#10B981] mx-auto mb-3" />
            <p className="text-white/70 text-sm">Marketing que comunica com segurança</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 text-center hover:bg-white/[0.05] transition-colors">
            <Globe size={24} className="text-[#A855F7] mx-auto mb-3" />
            <p className="text-white/70 text-sm">Pós-mercado que escuta sinais antes</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
