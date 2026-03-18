"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Sparkles, Globe } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 relative overflow-hidden">
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
                className="z-10 w-full max-w-lg glass-panel rounded-[4.5rem] p-16 md:p-24 text-center border border-white/5 shadow-3xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2.5 bg-purple-gradient shadow-[0_0_30px_rgba(168,85,247,0.4)]" />

                <div className="flex justify-center mb-12">
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="p-6 rounded-[2rem] bg-purple-gradient text-white shadow-2xl shadow-purple-500/30 border border-purple-400/20"
                    >
                        <Sparkles size={48} />
                    </motion.div>
                </div>

                <h1 className="text-5xl font-black mb-4 italic tracking-tighter uppercase leading-none">Welcome <span className="text-purple-500">Back</span></h1>
                <p className="text-[11px] text-gray-700 font-black mb-16 uppercase tracking-[0.4em] italic">Sign in to continue</p>

                <div className="space-y-6 mb-16">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(168,85,247,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => signIn("google", { callbackUrl: "/lobby" })}
                        className="w-full py-6 px-8 rounded-[1.8rem] bg-white/[0.01] border border-white/5 flex items-center justify-center gap-6 text-sm font-black italic tracking-[0.2em] transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group"
                    >
                        <img src="https://authjs.dev/img/providers/google.svg" className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all" alt="Google" />
                        Continue with Google
                    </motion.button>
                </div>

                <p className="text-[10px] text-gray-700 font-black italic tracking-widest uppercase leading-loose border-t border-white/5 pt-12">
                    You're one click away from <br /> joining <span className="text-purple-500">StudySync</span>
                </p>

                <div className="mt-12 flex items-center justify-center gap-3 text-gray-800 font-black text-[9px] tracking-[0.3em] uppercase italic">
                    <Globe size={14} className="text-purple-500/40" /> StudySync v2.0
                </div>
            </motion.div>
        </div>
    );
}
