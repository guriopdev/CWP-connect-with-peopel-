"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Play, Pause, RotateCcw,
    Coffee, Brain, Settings2, Bell
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PomodoroPage() {
    const { status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/auth/login");
        return null;
    }
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break' | 'custom'>('focus');
    const [customMinutes, setCustomMinutes] = useState(60);

    const totalSeconds = mode === 'focus' ? 25 * 60 : mode === 'break' ? 5 * 60 : customMinutes * 60;
    const currentSeconds = minutes * 60 + seconds;
    const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    setIsActive(false);
                    // Alert logic could go here
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') setMinutes(25);
        else if (mode === 'break') setMinutes(5);
        else setMinutes(customMinutes);
        setSeconds(0);
    };

    const switchMode = (newMode: 'focus' | 'break' | 'custom') => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'focus') setMinutes(25);
        else if (newMode === 'break') setMinutes(5);
        else setMinutes(customMinutes);
        setSeconds(0);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 1;
        setCustomMinutes(val);
        if (mode === 'custom' && !isActive) {
            setMinutes(val);
            setSeconds(0);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pt-52 pb-32 px-6 overflow-hidden relative">
            <Navbar />

            {/* High-Performance Technical Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden text-white/5">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/[0.04] rounded-full blur-[180px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.03] rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="z-10 w-full max-w-2xl glass-panel rounded-[3.5rem] p-10 md:p-14 text-center border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-gradient shadow-[0_0_30px_rgba(168,85,247,0.4)]" />

                <header className="mb-10 w-full">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-2xl">
                            <Brain size={24} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Pomodoro <span className="text-purple-500">Timer</span></h1>
                    </div>
                </header>

                {/* Tactical Mode Switcher */}
                <div className="flex p-2 bg-white/[0.02] border border-white/5 rounded-[2rem] mb-10 w-full max-w-md relative group">
                    <div className="absolute -inset-1 bg-purple-500/5 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <button
                        onClick={() => switchMode('focus')}
                        className={`relative flex-1 py-5 rounded-[1.8rem] font-black text-sm tracking-[0.3em] transition-all gap-3 flex items-center justify-center italic ${mode === 'focus' ? "bg-purple-gradient text-white shadow-xl shadow-purple-500/20" : "text-gray-600 hover:text-white"}`}
                    >
                        <Brain size={20} /> FOCUS
                    </button>
                    <button
                        onClick={() => switchMode('break')}
                        className={`relative flex-1 py-3 rounded-[1.5rem] font-black text-xs tracking-widest transition-all gap-2 flex items-center justify-center italic ${mode === 'break' ? "bg-purple-gradient text-white shadow-xl shadow-purple-500/20" : "text-gray-600 hover:text-white"}`}
                    >
                        <Coffee size={14} /> BREAK
                    </button>
                    <button
                        onClick={() => switchMode('custom')}
                        className={`relative flex-1 py-3 rounded-[1.5rem] font-black text-xs tracking-widest transition-all gap-2 flex items-center justify-center italic ${mode === 'custom' ? "bg-purple-gradient text-white shadow-xl shadow-purple-500/20" : "text-gray-600 hover:text-white"}`}
                    >
                        <Settings2 size={14} /> CUSTOM
                    </button>
                </div>

                {mode === 'custom' && (
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">MINUTES:</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="120"
                            value={customMinutes}
                            onChange={handleCustomChange}
                            disabled={isActive}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-24 text-center text-white font-black text-lg focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                        />
                    </div>
                )}

                {/* Circular Operational Progress */}
                <div className="relative w-[260px] h-[260px] mx-auto mb-14">
                    <div className="absolute inset-0 rounded-full bg-purple-500/[0.02] blur-2xl" />
                    <svg className="w-full h-full -rotate-90 relative z-10">
                        <circle
                            cx="130"
                            cy="130"
                            r="115"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/[0.02]"
                        />
                        <motion.circle
                            cx="130"
                            cy="130"
                            r="115"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="722.5"
                            animate={{ strokeDashoffset: 722.5 - (722.5 * progress) / 100 }}
                            transition={{ duration: 1, ease: "linear" }}
                            strokeLinecap="round"
                            className="text-purple-500 group-hover:text-purple-400 transition-colors drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <motion.span
                            key={`${minutes}-${seconds}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-6xl font-black tracking-tighter italic"
                        >
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </motion.span>
                        <span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase mt-2 italic">
                            {mode === 'focus' ? "Focus Time" : mode === 'break' ? "Break Time" : "Custom Time"}
                        </span>
                    </div>

                    {/* Decorative Technical Ring */}
                    <div className="absolute inset-[-10%] border border-dashed border-white/[0.03] rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
                </div>

                {/* Operational Controls */}
                <div className="flex items-center justify-center gap-6">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={resetTimer}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-600 hover:text-white transition-all shadow-inner"
                    >
                        <RotateCcw size={24} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(168,85,247,0.4)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTimer}
                        className="w-20 h-20 rounded-[2rem] bg-purple-gradient text-white flex items-center justify-center shadow-3xl hover:border border-purple-400/20"
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-600 hover:text-white transition-all shadow-inner"
                    >
                        <Bell size={24} />
                    </motion.button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-[9px] font-black text-gray-700 tracking-[0.25em] uppercase italic">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    Timer Active
                </div>
            </motion.div>
        </div>
    );
}
