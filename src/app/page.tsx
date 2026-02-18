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
  Zap,
  BarChart3,
  Lock,
  Cpu,
  MessageSquare,
  Search,
  AlertTriangle,
  CheckCircle,
  Award,
} from "lucide-react";

/* ============== PRODUCT ILLUSTRATIONS (CSS-Based) ============== */
function PharmaRoleplayVisual() {
  return (
    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#00D9FF]/5 to-transparent border border-[#00D9FF]/10">
      {/* Chat bubbles */}
      <div className="absolute top-4 left-4 right-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-full bg-[#00D9FF]/20 flex items-center justify-center flex-shrink-0">
            <Mic size={12} className="text-[#00D9FF]" />
          </div>
          <div className="bg-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2 max-w-[75%]">
            <p className="text-[10px] text-white/50">Dr. Silva — Cardiologista</p>
            <p className="text-xs text-white/70">&quot;Quais são os efeitos adversos mais comuns?&quot;</p>
          </div>
        </div>
        <div className="flex items-start gap-2 justify-end">
          <div className="bg-[#00D9FF]/10 rounded-xl rounded-tr-sm px-3 py-2 max-w-[75%]">
            <p className="text-[10px] text-[#00D9FF]/60">Representante IA</p>
            <p className="text-xs text-white/70">&quot;Os dados clínicos mostram que...&quot;</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1 bg-[#00D9FF]/40 rounded-full animate-pulse" style={{ height: `${8 + Math.random() * 12}px`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <span className="text-[10px] text-[#00D9FF]/40">Ouvindo...</span>
        </div>
      </div>
      {/* Score */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
        <Award size={10} className="text-[#00D9FF]" />
        <span className="text-[10px] font-medium text-[#00D9FF]">Score: 87%</span>
      </div>
    </div>
  );
}

function SocialVigilanteVisual() {
  return (
    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#A855F7]/5 to-transparent border border-[#A855F7]/10">
      {/* Social posts feed */}
      <div className="absolute inset-3 space-y-2">
        {[
          { platform: "🐦", risk: "critical", text: "Relato de náusea persistente com..." },
          { platform: "📢", risk: "high", text: "Lote com alteração organoléptica..." },
          { platform: "👽", risk: "medium", text: "Hepatotoxicidade mencionada em..." },
        ].map((post, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-2.5 py-1.5 border border-white/[0.04]">
            <span className="text-xs">{post.platform}</span>
            <p className="text-[10px] text-white/50 flex-1 truncate">{post.text}</p>
            <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${post.risk === "critical" ? "bg-red-500/15 text-red-400" :
              post.risk === "high" ? "bg-orange-500/15 text-orange-400" :
                "bg-yellow-500/15 text-yellow-400"
              }`}>{post.risk}</span>
          </div>
        ))}
        {/* Activity indicator */}
        <div className="flex items-end gap-px h-8 mt-1 px-1">
          {[35, 60, 25, 80, 45, 70, 30, 55, 75, 40, 65, 50].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#A855F7]/15 to-[#A855F7]/50 rounded-t-sm" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      {/* Live badge */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        <span className="text-[10px] font-medium text-white/50">4 fontes ativas</span>
      </div>
    </div>
  );
}

function MedSafeVisual() {
  return (
    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#10B981]/5 to-transparent border border-[#10B981]/10">
      {/* Document analysis */}
      <div className="absolute inset-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 flex-1 bg-[#10B981]/30 rounded-full overflow-hidden">
            <div className="h-full w-[78%] bg-[#10B981] rounded-full" />
          </div>
          <span className="text-[10px] text-[#10B981]">78%</span>
        </div>
        <div className="space-y-1.5">
          {[
            { label: "RDC 96 — Art. 3", status: "pass" },
            { label: "Indicação aprovada", status: "pass" },
            { label: "Claim sem referência", status: "fail" },
            { label: "Fonte bibliográfica", status: "pass" },
            { label: "Linguagem promocional", status: "warn" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/[0.03] rounded-md px-2 py-1">
              {item.status === "pass" ? <CheckCircle size={10} className="text-[#10B981] flex-shrink-0" /> :
                item.status === "fail" ? <AlertTriangle size={10} className="text-red-400 flex-shrink-0" /> :
                  <AlertTriangle size={10} className="text-yellow-400 flex-shrink-0" />}
              <span className="text-[10px] text-white/50">{item.label}</span>
              <span className={`text-[8px] ml-auto font-medium ${item.status === "pass" ? "text-[#10B981]" : item.status === "fail" ? "text-red-400" : "text-yellow-400"
                }`}>{item.status === "pass" ? "OK" : item.status === "fail" ? "VIOLAÇÃO" : "ATENÇÃO"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InternMatchVisual() {
  return (
    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#F59E0B]/5 to-transparent border border-[#F59E0B]/10">
      <div className="absolute inset-3 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Search size={12} className="text-[#F59E0B]/50" />
          <div className="flex-1 h-6 bg-white/[0.04] rounded-md flex items-center px-2">
            <span className="text-[10px] text-white/30">Farmácia · São Paulo · Estágio</span>
          </div>
        </div>
        {[
          { name: "Vaga — Lab Análisis Clínicas", match: "94%" },
          { name: "Vaga — CRA Pharma Int.", match: "89%" },
          { name: "Vaga — Regulatory Affairs Jr.", match: "82%" },
        ].map((v, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-2.5 py-2 border border-white/[0.04]">
            <div className="w-6 h-6 rounded-md bg-[#F59E0B]/10 flex items-center justify-center">
              <Users size={10} className="text-[#F59E0B]" />
            </div>
            <span className="text-[10px] text-white/60 flex-1">{v.name}</span>
            <span className="text-[10px] font-bold text-[#F59E0B]">{v.match}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SciGenVisual() {
  return (
    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#EC4899]/5 to-transparent border border-[#EC4899]/10">
      <div className="absolute inset-3">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={12} className="text-[#EC4899]/50" />
          <span className="text-[10px] text-white/40">Gerando conteúdo científico...</span>
        </div>
        <div className="space-y-1">
          {["Resumo do Estudo Clínico", "", "Pacientes com DM2 tratados com", "o composto X apresentaram...", "", "[1] Smith et al., NEJM 2024", "[2] Chen et al., Lancet 2024"].map((line, i) => (
            <div key={i} className={`h-${line ? '2.5' : '1'} rounded-sm ${line.startsWith("[") ? "bg-[#EC4899]/15 w-3/4" :
              line === "" ? "bg-transparent" :
                i === 0 ? "bg-white/10 w-2/3" :
                  "bg-white/[0.04] w-full"
              }`}>
              {line && <span className="text-[9px] text-white/40 px-1 leading-none">{line}</span>}
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
          <CheckCircle size={8} className="text-[#EC4899]" />
          <span className="text-[8px] text-[#EC4899]">Anti-hallucination ON</span>
        </div>
      </div>
    </div>
  );
}

/* ============== DATA ============== */
const products = [
  {
    id: "pharmaroleplay",
    icon: <Mic size={24} />,
    title: "PharmaRoleplay",
    description: "Treina equipes de campo em conversas com um Médico IA que responde naturalmente, desafia objeções e avalia performance em tempo real.",
    badge: "Google Cloud TPU",
    category: "Treinamento por Voz",
    demoUrl: "/tools/pharmaroleplay",
    status: "live" as const,
    color: "#00D9FF",
    visual: <PharmaRoleplayVisual />,
  },
  {
    id: "vigilante",
    icon: <Globe size={24} />,
    title: "Social Vigilante",
    description: "Capta sinais precoces de eventos adversos em redes sociais, fóruns e Reclame Aqui — gerando alertas de risco antes dos reportes oficiais.",
    badge: "BigQuery ML",
    category: "Vigilância Pós-Mercado",
    demoUrl: "/tools/social-vigilante",
    status: "live" as const,
    color: "#A855F7",
    visual: <SocialVigilanteVisual />,
  },
  {
    id: "medsafe",
    icon: <Shield size={24} />,
    title: "MedSafe AI",
    description: "IA auditora treinada na RDC 96 que analisa materiais promocionais em segundos — reduzindo erro humano e risco regulatório.",
    badge: "Vertex AI",
    category: "Compliance Regulatório",
    demoUrl: "/tools/medsafe",
    status: "live" as const,
    color: "#10B981",
    visual: <MedSafeVisual />,
  },
  {
    id: "internmatch",
    icon: <Users size={24} />,
    title: "InternMatch",
    description: "Conecta universitários de todos os cursos às melhores oportunidades de estágio usando matching semântico com IA.",
    badge: "Vector Search",
    category: "Talent Matching",
    status: "soon" as const,
    color: "#F59E0B",
    visual: <InternMatchVisual />,
  },
  {
    id: "scigen",
    icon: <FileText size={24} />,
    title: "SciGen",
    description: "Transforma estudos clínicos em conteúdo acessível para médicos e pacientes, com citações verificáveis e anti-alucinação.",
    badge: "Gemini 3",
    category: "Geração de Conteúdo",
    status: "soon" as const,
    color: "#EC4899",
    visual: <SciGenVisual />,
  },
];

const impactStats = [
  { value: "90", suffix: "%", label: "Redução no Tempo de Revisão", desc: "Materiais revisados em segundos, não semanas" },
  { value: "50", suffix: "%", label: "Ramp-up Mais Rápido", desc: "Representantes preparados em metade do tempo" },
  { value: "100", suffix: "%", label: "Cobertura de Menções", desc: "Vigilância contínua em redes sociais públicas" },
];

const features = [
  { icon: <Zap size={20} />, title: "Velocidade", desc: "Resposta em tempo real com latência de milissegundos" },
  { icon: <Lock size={20} />, title: "Compliance", desc: "Análise automática contra normas regulatórias" },
  { icon: <BarChart3 size={20} />, title: "Analytics", desc: "Dashboards e métricas de performance em tempo real" },
  { icon: <Cpu size={20} />, title: "Google Cloud", desc: "Infraestrutura 100% Google Cloud com TPU v5e" },
  { icon: <MessageSquare size={20} />, title: "Voz Natural", desc: "Conversação por voz com TTS e STT de alta qualidade" },
  { icon: <Search size={20} />, title: "Monitoramento", desc: "Rastreamento de sinais em milhões de fontes" },
];

/* ============== PAGE ============== */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ShowcaseSection />
      <ProductsSection />
      <StatsSection />
      <FeaturesGrid />
      <StepsSection />
      <TeamSection />
      <CTASection />
    </div>
  );
}

/* ============== HERO ============== */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#00D9FF]/[0.04] to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-white/50">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Powered by Google Cloud &amp; Gemini
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="heading-xl mb-8"
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
          className="body-lg max-w-2xl mx-auto mb-10"
        >
          Sistema de agentes autônomos para Life Sciences.
          Treine times, audite compliance, monitore reações adversas — tudo com IA
          que raciocina, age e aprende.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/tools/social-vigilante" className="btn-primary">
            Testar Demo Grátis <ArrowRight size={18} />
          </Link>
          <Link href="/products" className="btn-outline">
            Ver Produtos
          </Link>
        </motion.div>

        {/* Product preview thumbnails */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex justify-center gap-6 flex-wrap"
        >
          {products.slice(0, 3).map((p) => (
            <Link key={p.id} href={p.demoUrl || "#"} className="group">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] transition-all">
                <div style={{ color: p.color }}>{p.icon}</div>
                <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">{p.title}</span>
                <ArrowRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 scroll-indicator"
        >
          <div className="w-6 h-10 rounded-full border border-white/15 flex justify-center pt-2 mx-auto">
            <div className="w-1 h-2.5 bg-white/30 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============== SHOWCASE (tech badges) ============== */
function ShowcaseSection() {
  return (
    <section className="py-16 px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-white/25 text-sm mb-8 tracking-wide uppercase">
          Infraestrutura Enterprise
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "Vertex AI", "Cloud Run", "BigQuery ML", "TPU v5e",
            "Gemini 3", "LangChain", "ReAct Framework", "Imagen 3"
          ].map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== PRODUCTS WITH VISUALS ============== */
function ProductsSection() {
  return (
    <section id="products" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="label mb-4 text-[#00D9FF]">Nossos Produtos</p>
          <h2 className="heading-lg mb-4">
            Cada ferramenta resolve um elo<br className="hidden md:block" /> da cadeia até o paciente
          </h2>
          <p className="body-lg max-w-xl mx-auto">
            Teste direto no navegador — 3 demos disponíveis agora
          </p>
        </motion.div>

        {/* Product Cards with visuals — 3+2 layout */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {products.slice(3).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: typeof products[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="glass-card overflow-hidden group"
    >
      {/* Visual illustration */}
      <div className="p-4 pb-0">
        {product.visual}
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${product.color}12`, color: product.color }}
          >
            {product.icon}
          </div>
          {product.status === "live" ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          ) : (
            <span className="text-xs text-white/25">Em breve</span>
          )}
        </div>

        <p className="label mb-1.5" style={{ color: product.color }}>{product.category}</p>
        <h3 className="heading-md text-lg mb-2">{product.title}</h3>
        <p className="text-white/40 text-sm leading-relaxed mb-5">{product.description}</p>

        <div className="flex items-center gap-3">
          {product.demoUrl ? (
            <Link
              href={product.demoUrl}
              className="text-sm font-medium text-white flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
            >
              Testar Demo <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="text-sm text-white/25">Em breve</span>
          )}
          <span className="tech-badge !text-[10px] !py-1 !px-2">{product.badge}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ============== STATS ============== */
function StatsSection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="label mb-4 text-[#A855F7]">Impacto</p>
          <h2 className="heading-lg">Resultados mensuráveis</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <p className="stat-number">
        {count}<span className="text-white/30">{stat.suffix}</span>
      </p>
      <p className="text-white font-medium mt-3">{stat.label}</p>
      <p className="text-white/35 text-sm mt-1">{stat.desc}</p>
    </motion.div>
  );
}

/* ============== FEATURES GRID ============== */
function FeaturesGrid() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-black p-8 hover:bg-white/[0.02] transition-colors"
            >
              <div className="text-white/30 mb-4">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-white/40">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== STEPS (01, 02, 03) ============== */
function StepsSection() {
  const steps = [
    { num: "01", title: "Escolha sua ferramenta", desc: "PharmaRoleplay, Social Vigilante ou MedSafe — cada uma resolve um problema diferente na cadeia." },
    { num: "02", title: "Teste direto no navegador", desc: "Sem instalação, sem conta. Acesse a demo e veja o resultado em tempo real." },
    { num: "03", title: "Integre ao seu workflow", desc: "APIs prontas, infraestrutura Google Cloud, e suporte para deploy na sua organização." },
  ];

  return (
    <section className="py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="label mb-4 text-[#10B981]">Como funciona</p>
          <h2 className="heading-lg">É fácil começar</h2>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 items-start"
            >
              <span className="step-number flex-shrink-0 w-20">{step.num}</span>
              <div className="pt-2">
                <h3 className="heading-md mb-3">{step.title}</h3>
                <p className="text-white/40 max-w-lg">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/tools/social-vigilante" className="btn-primary">
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
    <section className="py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="label mb-4">Liderança</p>
          <h2 className="heading-lg mb-4">
            Profissionais de Farmácia-USP com<br className="hidden md:block" /> experiência em Big Pharma
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-[#00D9FF] text-sm font-medium mb-1">{member.role}</p>
              <p className="text-white/35 text-sm mb-3">{member.desc}</p>
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
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-lg mb-6"
        >
          Construa uma cadeia mais segura para o paciente
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="body-lg mb-10"
        >
          Fale com nossos especialistas e descubra como agentes de IA auditáveis
          podem transformar suas operações em Life Sciences.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/contact" className="btn-primary">
            Agendar Demonstração <ArrowRight size={18} />
          </Link>
          <Link href="/tools/social-vigilante" className="btn-outline">
            <Play size={16} /> Testar Demo Grátis
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

