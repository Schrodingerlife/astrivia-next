"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    company: z.string().min(2, "Empresa deve ter pelo menos 2 caracteres"),
    role: z.string().optional(),
    category: z.string().min(1, "Selecione uma opção"),
    message: z.string().min(20, "Mensagem deve ter pelo menos 20 caracteres"),
    consent: z.boolean().refine((val) => val === true, "Você deve aceitar receber comunicações"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setStatus("loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus("success");
                reset();
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="label mb-4 text-[#00D9FF]">Contato</p>
                    <h1 className="heading-lg mb-4">
                        Solicitar <span className="text-gradient-cyan">Acesso</span>
                    </h1>
                    <p className="body-lg max-w-2xl mx-auto">
                        Contrate nossa plataforma SaaS ou solicite uma demonstração dos produtos
                    </p>
                </motion.div>
            </section>

            {/* Form + Info */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card rounded-2xl p-8 md:p-10"
                        >
                            {status === "success" ? (
                                <div className="text-center py-12">
                                    <CheckCircle size={64} className="text-[#10B981] mx-auto mb-4" />
                                    <h3 className="heading-md mb-2">Mensagem Enviada!</h3>
                                    <p className="text-white/50">Retornaremos em até 24 horas úteis.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="btn-outline mt-6"
                                    >
                                        Enviar outra mensagem
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <input
                                                {...register("name")}
                                                placeholder="Nome *"
                                                className="form-input"
                                            />
                                            {errors.name && (
                                                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                {...register("email")}
                                                placeholder="Email Corporativo *"
                                                className="form-input"
                                            />
                                            {errors.email && (
                                                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <input
                                                {...register("company")}
                                                placeholder="Empresa *"
                                                className="form-input"
                                            />
                                            {errors.company && (
                                                <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                {...register("role")}
                                                placeholder="Cargo (opcional)"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <select {...register("category")} className="form-input">
                                            <option value="">Qual plano deseja contratar? *</option>
                                            <option value="demo">Solicitar Demo Gratuito</option>
                                            <option value="pilot">Iniciar Projeto Piloto</option>
                                            <option value="subscription">Contratar Assinatura</option>
                                            <option value="enterprise">Plano Enterprise</option>
                                            <option value="other">Outra Solicitação</option>
                                        </select>
                                        {errors.category && (
                                            <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <textarea
                                            {...register("message")}
                                            placeholder="Quais produtos deseja contratar? *"
                                            rows={5}
                                            className="form-input resize-none"
                                        />
                                        {errors.message && (
                                            <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            {...register("consent")}
                                            id="consent"
                                            className="mt-1"
                                        />
                                        <label htmlFor="consent" className="text-white/50 text-sm">
                                            Aceito receber comunicações da Astrivia AI sobre produtos e atualizações. *
                                        </label>
                                    </div>
                                    {errors.consent && (
                                        <p className="text-red-400 text-sm">{errors.consent.message}</p>
                                    )}

                                    {status === "error" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle size={16} />
                                            Erro ao enviar. Tente novamente.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full btn-primary py-4 justify-center disabled:opacity-50"
                                    >
                                        {status === "loading" ? (
                                            "Enviando..."
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Send size={18} /> Enviar Mensagem
                                            </span>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <Mail size={24} className="text-[#00D9FF] mb-3" />
                            <h3 className="font-bold mb-1">Email</h3>
                            <a
                                href="mailto:nicollas.braga@astriviaai.tech"
                                className="text-white/50 hover:text-[#00D9FF] transition-colors text-sm"
                            >
                                nicollas.braga@astriviaai.tech
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <svg className="w-6 h-6 text-[#00D9FF] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                            <h3 className="font-bold mb-1">LinkedIn</h3>
                            <a
                                href="https://www.linkedin.com/company/astriviaai/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/50 hover:text-[#00D9FF] transition-colors text-sm"
                            >
                                /company/astriviaai
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <MapPin size={24} className="text-[#00D9FF] mb-3" />
                            <h3 className="font-bold mb-1">Localização</h3>
                            <p className="text-white/50 text-sm">São Paulo, Brasil</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <Clock size={24} className="text-[#00D9FF] mb-3" />
                            <h3 className="font-bold mb-1">Horário</h3>
                            <p className="text-white/50 text-sm">Segunda a Sexta, 9h-18h BRT</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
