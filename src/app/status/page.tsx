"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Clock, Mail } from "lucide-react";
import { useState } from "react";

type ServiceStatus = "operational" | "degraded" | "outage";

const services: { name: string; status: ServiceStatus; latency: string }[] = [
    { name: "PharmaRoleplay API", status: "operational", latency: "180ms" },
    { name: "Social Vigilante Processing", status: "operational", latency: "2.3s" },
    { name: "MedSafe AI Analysis", status: "operational", latency: "450ms" },
    { name: "InternMatch Matching", status: "operational", latency: "120ms" },
    { name: "SciGen Content", status: "operational", latency: "1.8s" },
];

const uptimeData = Array.from({ length: 90 }, () => ({
    status: Math.random() > 0.02 ? "operational" : "degraded",
    percentage: (99 + Math.random()).toFixed(2),
}));

const statusConfig = {
    operational: { icon: <CheckCircle size={20} />, color: "text-[#10B981]", bg: "bg-[#10B981]" },
    degraded: { icon: <AlertTriangle size={20} />, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]" },
    outage: { icon: <XCircle size={20} />, color: "text-[#EF4444]", bg: "bg-[#EF4444]" },
};

export default function StatusPage() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const allOperational = services.every((s) => s.status === "operational");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
    };

    return (
        <div className="min-h-screen pt-24">
            {/* Hero Status */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <p className="label mb-4 text-[#10B981]">Status</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl mb-8 ${allOperational ? "bg-[#10B981]/10 border border-[#10B981]/30" : "bg-[#F59E0B]/10 border border-[#F59E0B]/30"
                            }`}
                    >
                        {allOperational ? (
                            <>
                                <CheckCircle size={32} className="text-[#10B981]" />
                                <span className="text-2xl font-bold text-[#10B981]">Todos os Sistemas Operacionais</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={32} className="text-[#F59E0B]" />
                                <span className="text-2xl font-bold text-[#F59E0B]">Alguns Sistemas Degradados</span>
                            </>
                        )}
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/40 text-sm"
                    >
                        Última atualização: {new Date().toLocaleString("pt-BR")}
                    </motion.p>
                </div>
            </section>

            {/* Services */}
            <section className="py-12 px-6 border-t border-white/[0.04]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="heading-md mb-8">Serviços</h2>

                    <div className="space-y-4">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-card rounded-xl p-6 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={statusConfig[service.status].color}>
                                        {statusConfig[service.status].icon}
                                    </span>
                                    <span className="font-medium">{service.name}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-white/30 text-sm flex items-center gap-1">
                                        <Clock size={14} /> {service.latency}
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${statusConfig[service.status].color}`}
                                    >
                                        {service.status === "operational" ? "Operacional" :
                                            service.status === "degraded" ? "Degradado" : "Fora do Ar"}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Uptime History */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="heading-md">Uptime — 90 Dias</h2>
                        <span className="text-[#10B981] font-bold text-xl">99.9%</span>
                    </div>

                    <div className="flex gap-1">
                        {uptimeData.map((day, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-8 rounded-sm ${day.status === "operational" ? "bg-[#10B981]" : "bg-[#F59E0B]"
                                    } opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                                title={`Dia ${90 - index}: ${day.percentage}% uptime`}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between text-white/30 text-sm mt-2">
                        <span>90 dias atrás</span>
                        <span>Hoje</span>
                    </div>
                </div>
            </section>

            {/* Subscribe */}
            <section className="py-16 px-6 border-t border-white/[0.04]">
                <div className="max-w-xl mx-auto text-center">
                    <Mail size={48} className="text-[#00D9FF] mx-auto mb-4" />
                    <h2 className="heading-md mb-2">Assinar Atualizações</h2>
                    <p className="text-white/40 mb-8">
                        Receba notificações quando o status dos sistemas mudar
                    </p>

                    {subscribed ? (
                        <div className="glass-card rounded-xl p-6">
                            <CheckCircle size={32} className="text-[#10B981] mx-auto mb-2" />
                            <p className="text-[#10B981] font-medium">Inscrito com sucesso!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu email"
                                required
                                className="form-input flex-1"
                            />
                            <button type="submit" className="btn-primary">
                                Assinar
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}
