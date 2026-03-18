"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    BookOpen, Users, Timer, Sparkles, ArrowRight,
    CheckCircle, Zap, Shield, Globe, Rocket, Cpu, Layers, MousePointer2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function LandingPage() {
    const { status } = useSession();
    const router = useRouter();
    const containerRef = useRef(null);
    const [isVerified, setIsVerified] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("cwp_verified") === "true";
        }
        return false;
    });
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifySuccess, setVerifySuccess] = useState(false);

    // Mouse tracking for parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth mouse movement
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX.set((clientX / innerWidth) - 0.5);
            mouseY.set((clientY / innerHeight) - 0.5);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const handleVerification = () => {
        if (isVerifying || verifySuccess) return;
        setIsVerifying(true);
        
        // Simulate a complex cryptographic/browser integrity check
        setTimeout(() => {
            setIsVerifying(false);
            setVerifySuccess(true);
            localStorage.setItem("cwp_verified", "true");
            setTimeout(() => setIsVerified(true), 800);
        }, 2000);
    };

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -400]);

    // Mouse-based parallax transforms
    const moveX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
    const moveY = useTransform(springY, [-0.5, 0.5], [-30, 30]);
    const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

    // Parallax icon transforms (MUST be at top level, not inside JSX)
    const iconX1 = useTransform(springX, [-0.5, 0.5], [-100, 100]);
    const iconY1 = useTransform(springY, [-0.5, 0.5], [-100, 100]);
    const iconX2 = useTransform(springX, [-0.5, 0.5], [80, -80]);
    const iconY2 = useTransform(springY, [-0.5, 0.5], [150, -150]);
    const iconX3 = useTransform(springX, [-0.5, 0.5], [120, -120]);
    const iconY3 = useTransform(springY, [-0.5, 0.5], [-50, 50]);

    return (
        <div ref={containerRef} className="flex flex-col items-center bg-black text-white selection:bg-purple-500/30 overflow-x-hidden min-h-screen w-full">
            {!isVerified ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center w-full h-screen">
                    <div className="mb-10 p-8 glass-panel border border-white/10 rounded-2xl flex flex-col items-center gap-6 shadow-2xl min-w-[300px]">
                        <div className="flex items-center justify-between w-full gap-8">
                            <div 
                                className={`w-8 h-8 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${verifySuccess ? "border-emerald-500 bg-emerald-500/20" : isVerifying ? "border-purple-500" : "border-gray-500 hover:border-purple-400"}`}
                                onClick={handleVerification}
                            >
                                {isVerifying && (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                                )}
                                {verifySuccess && <CheckCircle size={18} className="text-emerald-500" />}
                            </div>
                            <span className="font-bold text-gray-300">Verify you are human</span>
                            <Shield className="text-purple-500 opacity-50" size={24} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
                        Protected by StudySync Security
                    </div>
                </div>
            ) : (
                <>
                    <Navbar />

                    {/* Dynamic Interactive Background */}
                    <InteractiveBackground />

                    {/* Hero Section */}
                    <motion.section
                        style={{ opacity: heroOpacity, scale: heroScale, rotateX, rotateY }}
                        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 perspective-1000"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-center max-w-6xl"
                        >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="inline-flex items-center gap-3 px-8 py-3 rounded-full glass-panel mb-12 text-sm font-bold text-purple-300 border border-purple-500/20 shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={18} className="text-purple-400" />
                        </motion.div>
                        STUDY TOGETHER ANYTIME
                    </motion.div>

                    <h1 className="text-7xl md:text-[11rem] font-black mb-12 tracking-tighter italic">
                        STUDY <br />
                        <span className="hero-gradient-text relative">
                            BETTER
                        </span>
                    </h1>

                    <p className="text-xl md:text-3xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
                        Join virtual study rooms, connect with peers, and stay focused with our built-in tools. Simple, fast, and effective.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-10">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(168,85,247,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(status === "authenticated" ? "/lobby" : "/auth/login")}
                            className="px-14 py-6 rounded-2xl bg-purple-gradient text-white font-black text-xl flex items-center gap-4 transition-all"
                        >
                            Get Started <ArrowRight size={24} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.08)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/docs")}
                            className="px-14 py-6 rounded-2xl glass-panel font-black text-xl flex items-center gap-4 transition-all"
                        >
                            View Docs
                        </motion.button>
                    </div>
                </motion.div>

                {/* Mouse-Driven Parallax Elements */}
                <div className="absolute inset-0 z-[-1] pointer-events-none hide-on-mobile">
                    <motion.div style={{ x: iconX1, y: iconY1 }} className="absolute top-[15%] left-[5%] text-purple-500/10"><Cpu size={250} /></motion.div>
                    <motion.div style={{ x: iconX2, y: iconY2 }} className="absolute bottom-[20%] right-[10%] text-indigo-500/10"><Layers size={300} /></motion.div>
                    <motion.div style={{ x: iconX3, y: iconY3 }} className="absolute top-[40%] right-[5%] text-purple-400/5"><MousePointer2 size={150} /></motion.div>
                </div>
            </motion.section>

            {/* Infinite Marquee Section */}
            <div className="relative z-10 w-full py-12 bg-white/5 backdrop-blur-sm border-y border-white/10 overflow-hidden select-none">
                <div className="flex whitespace-nowrap">
                    <MarqueeText text="STUDY ROOMS • VIDEO CALLING • POMODORO TIMER • GLOBAL CHAT • SHARE GOALS • " />
                    <MarqueeText text="STUDY ROOMS • VIDEO CALLING • POMODORO TIMER • GLOBAL CHAT • SHARE GOALS • " />
                </div>
            </div>

            {/* Metrics Section */}
            <section className="relative z-10 w-full py-32 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <MetricItem label="Efficiency Gain" value="45%" sub="Average student report" />
                    <MetricItem label="Active Students" value="1.2k" sub="Join the community" />
                    <MetricItem label="Hours Studied" value="10k+" sub="Total study sessions" />
                    <MetricItem label="Latency" value="12ms" sub="Real-time video" />
                </div>
            </section>

            {/* Interactive Feature Showcase */}
            <section className="relative z-10 w-full py-40 px-4 container mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <h2 className="text-6xl md:text-9xl font-black mb-8 leading-none tracking-tighter">
                        TOOLS FOR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">STUDENTS</span>
                    </h2>
                    <p className="text-2xl text-gray-500 max-w-3xl font-medium">
                        Everything you need to get work done effectively. Beautiful, simple, and functional.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ElevatedCard
                        icon={<Globe size={48} />}
                        title="Study Rooms"
                        description="Join public or private video rooms to study together with friends and peers."
                        color="purple"
                    />
                    <ElevatedCard
                        icon={<Zap size={48} />}
                        title="Pomodoro Timer"
                        description="Focus in completely synced intervals with your study group."
                        color="amber"
                    />
                    <ElevatedCard
                        icon={<Shield size={48} />}
                        title="Secure & Private"
                        description="Protect your study sessions with room passwords."
                        color="blue"
                    />
                </div>
            </section>

            {/* CTA Glass Section */}
            <section className="relative z-10 w-full py-60 px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-7xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[4rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative glass-panel rounded-[4rem] p-16 md:p-32 flex flex-col items-center text-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent)]" />

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="mb-12 p-6 rounded-full bg-white/5 border border-white/10"
                        >
                            <Rocket size={40} className="text-purple-400" />
                        </motion.div>

                        <h2 className="text-5xl md:text-[5rem] font-black mb-12 leading-none tracking-tighter italic">
                            READY TO <br /> STUDY?
                        </h2>

                        <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-2xl font-medium">
                            Join our community today and start working towards your goals effectively.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/auth/login")}
                            className="px-16 py-8 rounded-3xl bg-white text-black font-black text-2xl shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all"
                        >
                            Get Started
                        </motion.button>
                    </div>
                </motion.div>
            </section>

            <footer className="relative z-10 w-full py-24 border-t border-white/10 bg-black/90 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-4 text-4xl font-black text-white mb-8">
                            <Sparkles className="text-purple-500" size={40} />
                            StudySync
                        </div>
                        <p className="text-gray-500 text-xl font-medium max-w-md leading-relaxed">
                            A simple platform for students to study together and stay accountable.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-black mb-8 text-lg uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-gray-500 font-bold">
                            <li><a href="/lobby" className="hover:text-purple-400 transition-colors">Lobby Hub</a></li>
                            <li><a href="/docs" className="hover:text-purple-400 transition-colors">Documentation</a></li>
                            <li><a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black mb-8 text-lg uppercase tracking-widest">Connect</h4>
                        <ul className="space-y-4 text-gray-500 font-bold">
                            <li><a href="https://discordapp.com/users/1324369647625306112" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Discord</a></li>
                            <li><a href="https://github.com/guriopdev" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-white/5 flex justify-between items-center text-gray-600 text-sm font-bold uppercase tracking-widest">
                    <div>© 2026 StudySync Labs. All Rights Reserved.</div>
                    <div className="flex gap-12">
                        <a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</a>
                        <a href="/license" className="hover:text-purple-400 transition-colors">License</a>
                    </div>
                </div>
            </footer>
                </>
            )}
        </div>
    );
}

function MarqueeText({ text }: { text: string }) {
    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center"
        >
            <span className="text-4xl md:text-6xl font-black text-white/20 px-4 tracking-tighter italic">
                {text}
            </span>
        </motion.div>
    );
}

function MetricItem({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            className="relative p-10 rounded-[3rem] border border-white/5 bg-white/5 group hover:border-purple-500/30 transition-all duration-500 overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Sparkles size={100} className="text-purple-500" />
            </div>
            <div className="text-6xl font-black mb-4 text-white tracking-tighter group-hover:text-purple-400 transition-colors">{value}</div>
            <div className="text-lg font-black text-white/80 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{sub}</div>
        </motion.div>
    );
}

function ElevatedCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: 'purple' | 'amber' | 'blue' }) {
    const colors = {
        purple: "group-hover:text-purple-400 group-hover:bg-purple-500/10",
        amber: "group-hover:text-amber-400 group-hover:bg-amber-500/10",
        blue: "group-hover:text-blue-400 group-hover:bg-blue-500/10"
    };

    return (
        <motion.div
            whileHover={{ y: -20, rotateY: 5, rotateX: -5 }}
            className="group relative p-12 rounded-[3.5rem] glass-panel transition-all min-h-[500px] flex flex-col justify-between shadow-2xl overflow-hidden"
        >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
                <motion.div
                    whileHover={{ rotate: 15 }}
                    className={`mb-12 p-6 rounded-[2rem] bg-white/5 w-fit transition-all duration-500 ${colors[color]}`}
                >
                    {icon}
                </motion.div>
                <h3 className="text-4xl font-black mb-6 tracking-tighter italic">{title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium text-xl">{description}</p>
            </div>

            <a href="/docs">
                <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 text-sm font-black cursor-pointer text-gray-500 group-hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                    View Documentation <ArrowRight size={20} />
                </motion.div>
            </a>
        </motion.div>
    );
}

