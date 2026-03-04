"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Bot, Stars, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AIBotPage() {
    const { status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/auth/login");
        return null;
    }
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden relative">
            <Navbar />

            {/* High-Performance Technical Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden text-white/5">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/[0.04] rounded-full blur-[180px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.03] rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="z-10 text-center max-w-4xl relative"
            >
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex p-10 rounded-[3rem] bg-purple-gradient mb-12 shadow-[0_50px_100px_-20px_rgba(168,85,247,0.4)] border border-purple-400/20 relative group"
                >
                    <div className="absolute inset-0 bg-white/10 rounded-[3rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <Bot size={80} className="text-white relative z-10" />
                </motion.div>

                <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter italic uppercase leading-tight">
                    INTELLIGENCE <br />
                    <span className="text-purple-500">OFFLINE</span>
                </h1>

                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black tracking-[0.4em] text-purple-400 uppercase italic">
                        Deployment_Phase: 01
                    </div>
                </div>

                <p className="text-xl text-gray-500 mb-20 font-black italic tracking-tight uppercase max-w-2xl mx-auto leading-relaxed">
                    The ultimate cognitive companion is being initialized. <br /> Ask doubts, get summaries, and optimize your focus core automatically.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-20">
                    <FutureFeature icon={<Stars size={20} />} title="INSTANT DOUBT SOLVING" desc="Real-time pedagogical assistance." />
                    <FutureFeature icon={<Brain size={20} />} title="FOCUS ANALYTICS" desc="Data-driven productivity insights." />
                    <FutureFeature icon={<Sparkles size={20} />} title="SMART SCHEDULING" desc="Automated operational planning." />
                    <FutureFeature icon={<Bot size={20} />} title="AI ACCOUNTABILITY" desc="Autonomous focus enforcement." />
                </div>

                <div className="mt-16">
                    <a
                        href="/lobby"
                        className="inline-flex items-center gap-4 text-xs font-black text-purple-400 hover:text-white transition-all group tracking-[0.3em] italic underline underline-offset-8 decoration-purple-500/30"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> BACK TO LOBBY
                    </a>
                </div>
            </motion.div>
        </div>
    );
}

function FutureFeature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex flex-col gap-3 p-8 rounded-[2.5rem] glass-panel border border-white/5 text-gray-500 group hover:border-purple-500/20 transition-all cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.02] blur-3xl" />
            <div className="text-purple-400 group-hover:scale-110 transition-transform mb-2">{icon}</div>
            <span className="text-sm font-black italic tracking-widest text-white group-hover:text-purple-400 transition-colors uppercase">{title}</span>
            <span className="text-[10px] font-black italic tracking-tight text-gray-700 uppercase">{desc}</span>
        </div>
    );
}
