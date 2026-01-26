"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ChevronRight,
  Play,
  Mic,
  Globe,
  Shield,
  Wand2,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";

// ============== PRODUCTS DATA ==============
const products = [
  {
    id: "pharmaroleplay",
    image: "/images/product-pharmaroleplay.jpeg",
    icon: <Mic size={24} />,
    title: "PharmaRoleplay",
    description:
      "Treinamento de vendas com IA por voz em tempo real. Representantes treinam com 'Médico IA' e recebem feedback instantâneo sobre tom, argumentação e conformidade.",
    badge: "Google Cloud TPU",
    category: "High-Compute Training",
  },
  {
    id: "vigilante",
    image: "/images/product-vigilante.jpeg",
    icon: <Globe size={24} />,
    title: "Social Vigilante",
    description:
      "Farmacovigilância em escala de terabytes. Monitoramos redes sociais para detectar sinais de eventos adversos antes dos reportes oficiais chegarem à ANVISA.",
    badge: "BigQuery ML",
    category: "Pharmacovigilance",
  },
  {
    id: "medsafe",
    image: "/images/product-medsafe.jpeg",
    icon: <Shield size={24} />,
    title: "MedSafe AI",
    description:
      "Conformidade com zero alucinação. IA auditora treinada na RDC 96 que reduz semanas de revisão regulatória para segundos, com 100% rastreabilidade.",
    badge: "Vertex AI Search",
    category: "Regulatory Compliance",
  },
  {
    id: "internmatch",
    image: "/images/product-internmatch.jpeg",
    icon: <Users size={24} />,
    title: "InternMatch",
    description:
      "Plataforma de recrutamento inteligente para universitários de todos os cursos. Conectamos estudantes às melhores oportunidades de estágio e emprego.",
    badge: "Vector Search",
    category: "Talent Matching",
  },
  {
    id: "scigen",
    image: "/images/product-scigen.jpeg",
    icon: <FileText size={24} />,
    title: "SciGen",
    description:
      "Transformação de estudos clínicos densos em conteúdo acessível para médicos e pacientes. Anti-alucinação com citações automáticas verificáveis.",
    badge: "Gemini Pro",
    category: "Content Generation",
  },
];

// ============== STATS DATA ==============
const stats = [
  { value: "1.5", prefix: "US$", suffix: " Tri", label: "Mercado Farmacêutico Global" },
  { value: "60", suffix: "% Faster", label: "Aceleração Time-to-Market" },
  { value: "20", prefix: "US$", suffix: " Bi+", label: "Investimento LatAm Marketing" },
];

// ============== HOME PAGE ==============
export default function HomePage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroBgY = useTransform(scrollY, [0, 600], [0, 200]);

  return (
    <div className="min-h-screen">
      {/* ============== HERO SECTION ============== */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Parallax Background */}
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background.jpeg"
            alt="Astrivia AI Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/50 via-transparent to-[#0A1628]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm">
                <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse" />
                <span className="text-white/80">SaaS Platform</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/80">Powered by Vertex AI</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]"
            >
              O Primeiro{" "}
              <span className="text-gradient-cyan">Sistema Operacional</span> de Agentes
              Autônomos para Life Sciences
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed"
            >
              Plataforma SaaS que transforma atrito regulatório em autonomia inteligente.
              Agentes de IA que raciocinam, agem e aprendem continuamente.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/platform"
                className="btn-primary px-8 py-4 rounded-xl text-base flex items-center gap-2"
              >
                Acessar Plataforma <ChevronRight size={20} />
              </Link>
              <Link
                href="/platform"
                className="btn-outline px-8 py-4 rounded-xl flex items-center gap-2 text-base"
              >
                <Play size={20} /> Testar Demo Grátis
              </Link>
            </motion.div>
          </div>

          {/* Right: Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[#00D9FF]/10 blur-[100px] rounded-full" />
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[550px] aspect-square"
            >
              <Image
                src="/assets/agent-system-hero.jpg"
                alt="Astrivia AI Agent System"
                fill
                className="object-contain rounded-3xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 scroll-indicator">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#00D9FF] rounded-full" />
          </div>
        </div>
      </section>

      {/* ============== IMPACT SECTION ============== */}
      <section className="py-32 px-6 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Impacto Mensurável"
            subtitle="Nossa plataforma entrega resultados concretos para operações de Life Sciences"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <p className="text-4xl font-bold neon-number">60%</p>
              <p className="text-white/60 mt-2">Redução no Time-to-Market</p>
              <p className="text-white/40 text-sm mt-4">Aprovações regulatórias mais rápidas com IA</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <p className="text-4xl font-bold neon-number">85%</p>
              <p className="text-white/60 mt-2">Automação de Compliance</p>
              <p className="text-white/40 text-sm mt-4">Revisões regulatórias automatizadas</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <p className="text-4xl font-bold neon-number">40%</p>
              <p className="text-white/60 mt-2">Redução de Custos</p>
              <p className="text-white/40 text-sm mt-4">Economia operacional com agentes IA</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== PRODUCTS SECTION ============== */}
      <section id="products" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Nossos Produtos SaaS"
            subtitle="6 ferramentas de IA disponíveis por assinatura para operações farmacêuticas"
          />

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============== ARCHITECTURE SECTION ============== */}
      <section className="py-32 px-6 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Arquitetura Técnica"
            subtitle="Powered by Google Cloud & Vertex AI"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Image
              src="/images/architecture-agentops.jpeg"
              alt="AgentOps Pipeline"
              width={1400}
              height={600}
              className="w-full rounded-3xl shadow-2xl"
            />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {[
              "Vertex AI Agent Engine",
              "ReAct Framework",
              "LangChain",
              "Cloud Run",
              "Cloud Build",
              "BigQuery ML",
              "TPU v5e",
              "Imagen 3",
            ].map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============== IMPACT SECTION ============== */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/impact-background.jpeg"
            alt=""
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/80 to-[#0A1628]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            title="Impacto Global"
            subtitle="Números que justificam a transformação"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {stats.map((stat, index) => (
              <ImpactCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA SECTION ============== */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#0D1B2A] to-[#1a1040]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Pronto para Transformar sua Operação?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/60 text-lg mb-8"
          >
            Fale com nossos especialistas e descubra como a IA agêntica pode acelerar seu negócio
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/contact"
              className="btn-primary px-10 py-4 rounded-xl text-lg inline-block"
            >
              Agendar Demonstração
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ============== COMPONENTS ==============

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <h2 className="section-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/60 max-w-2xl mx-auto text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      id={product.id}
      className="glass-card rounded-3xl overflow-hidden group"
    >
      <div className="h-[240px] overflow-hidden relative">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] flex-shrink-0">
            {product.icon}
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="text-xl font-bold">{product.title}</h3>
          </div>
        </div>
        <span className="tech-badge text-xs mb-4 inline-block">{product.badge}</span>
        <p className="text-white/60 leading-relaxed text-sm mt-2">{product.description}</p>
        <Link
          href={`/products#${product.id}`}
          className="btn-outline px-5 py-2.5 rounded-lg text-sm mt-6 inline-flex items-center gap-2"
        >
          Learn More <ExternalLink size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

function ImpactCard({ stat }: { stat: typeof stats[0] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const end = parseFloat(stat.value);
      const duration = 1500; // Slightly faster
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = end * easeOut;

        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-10 text-center"
    >
      <div className="text-5xl md:text-6xl font-bold neon-number mb-4">
        {stat.prefix}
        {count.toFixed(stat.value.includes(".") ? 1 : 0)}
        {stat.suffix}
      </div>
      <p className="text-white/60 text-lg">{stat.label}</p>
    </motion.div>
  );
}
