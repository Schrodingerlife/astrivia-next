"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, AlertCircle, Linkedin, Mail, MapPin, Clock } from "lucide-react";

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
            <section className="py-16 px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Entre em <span className="text-gradient-cyan">Contato</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 text-lg max-w-2xl mx-auto"
                >
                    Vamos transformar sua operação farmacêutica com IA agêntica
                </motion.p>
            </section>

            {/* Form + Info */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card rounded-3xl p-8 md:p-10"
                        >
                            {status === "success" ? (
                                <div className="text-center py-12">
                                    <CheckCircle size={64} className="text-[#10B981] mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">Mensagem Enviada!</h3>
                                    <p className="text-white/60">Retornaremos em até 24 horas úteis.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="btn-outline px-6 py-3 rounded-lg mt-6"
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
                                                <p className="text-[#EF4444] text-sm mt-1">{errors.name.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                {...register("email")}
                                                placeholder="Email Corporativo *"
                                                className="form-input"
                                            />
                                            {errors.email && (
                                                <p className="text-[#EF4444] text-sm mt-1">{errors.email.message}</p>
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
                                                <p className="text-[#EF4444] text-sm mt-1">{errors.company.message}</p>
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
                                            <option value="">Como podemos ajudar? *</option>
                                            <option value="demo">Demonstração de Produto</option>
                                            <option value="partnership">Parceria</option>
                                            <option value="investment">Investimento</option>
                                            <option value="career">Carreira</option>
                                            <option value="other">Outro</option>
                                        </select>
                                        {errors.category && (
                                            <p className="text-[#EF4444] text-sm mt-1">{errors.category.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <textarea
                                            {...register("message")}
                                            placeholder="Conte sobre seu desafio *"
                                            rows={5}
                                            className="form-input resize-none"
                                        />
                                        {errors.message && (
                                            <p className="text-[#EF4444] text-sm mt-1">{errors.message.message}</p>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            {...register("consent")}
                                            id="consent"
                                            className="mt-1"
                                        />
                                        <label htmlFor="consent" className="text-white/60 text-sm">
                                            Aceito receber comunicações da Astrivia AI sobre produtos e atualizações. *
                                        </label>
                                    </div>
                                    {errors.consent && (
                                        <p className="text-[#EF4444] text-sm">{errors.consent.message}</p>
                                    )}

                                    {status === "error" && (
                                        <div className="flex items-center gap-2 text-[#EF4444] text-sm">
                                            <AlertCircle size={16} />
                                            Erro ao enviar. Tente novamente.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full btn-primary py-4 rounded-xl text-base disabled:opacity-50"
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
                                href="mailto:astriviaai@gmail.com"
                                className="text-white/60 hover:text-[#00D9FF] transition-colors"
                            >
                                astriviaai@gmail.com
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <Linkedin size={24} className="text-[#00D9FF] mb-3" />
                            <h3 className="font-bold mb-1">LinkedIn</h3>
                            <a
                                href="https://www.linkedin.com/in/astrivia-ai-96933b3a3/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-[#00D9FF] transition-colors"
                            >
                                /in/astrivia-ai-96933b3a3
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
                            <p className="text-white/60">São Paulo, Brasil</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <Clock size={24} className="text-[#00D9FF] mb-3" />
                            <h3 className="font-bold mb-1">Horário</h3>
                            <p className="text-white/60">Segunda a Sexta, 9h-18h BRT</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
