"use client";

import { motion } from "framer-motion";
import { Globe, Zap, Shield, ArrowLeft, BookOpen, Users, Timer, MessageSquare, Lock, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function DocsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <InteractiveBackground />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-widest mb-12 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Home
                </motion.button>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="flex items-center gap-4 mb-8">
                        <BookOpen size={40} className="text-purple-500" />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Documentation</h1>
                    </div>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-16">Everything you need to know about StudySync</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <DocCard
                        icon={<Globe size={32} />}
                        title="Study Rooms"
                        items={[
                            "Create public or password-protected rooms",
                            "Join rooms from the lobby with a single click",
                            "Each room supports real-time video via Jitsi Meet",
                            "Room admins can manage participants and settings",
                            "Invite friends directly from your friends list"
                        ]}
                    />
                    <DocCard
                        icon={<Video size={32} />}
                        title="Video Conferencing"
                        items={[
                            "Powered by Jitsi Meet — completely free",
                            "No downloads required, works in your browser",
                            "Toggle mic and camera before joining",
                            "Screen sharing and full-screen support",
                            "Secure rooms with no external invite links"
                        ]}
                    />
                    <DocCard
                        icon={<Timer size={32} />}
                        title="Pomodoro Timer"
                        items={[
                            "Built-in focus timer with customizable durations",
                            "Set custom work and break intervals",
                            "Visual countdown with progress indicator",
                            "Helps maintain productive study sessions",
                            "Accessible from the lobby sidebar"
                        ]}
                    />
                    <DocCard
                        icon={<MessageSquare size={32} />}
                        title="Messaging"
                        items={[
                            "Global chat for community conversations",
                            "Direct messages between friends",
                            "Real-time message delivery",
                            "View sender profiles by clicking names",
                            "Report inappropriate messages"
                        ]}
                    />
                    <DocCard
                        icon={<Users size={32} />}
                        title="Friends & Network"
                        items={[
                            "Send and receive friend requests",
                            "View friend profiles and study stats",
                            "Quick-message friends from the sidebar",
                            "Add friends from room participant lists",
                            "Manage your connections easily"
                        ]}
                    />
                    <DocCard
                        icon={<Lock size={32} />}
                        title="Security & Privacy"
                        items={[
                            "Google OAuth authentication",
                            "Password-protected study rooms",
                            "Connection verification on entry",
                            "Report system for users and messages",
                            "No third-party tracking or ads"
                        ]}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-3xl p-12 border border-white/10 text-center"
                >
                    <h2 className="text-3xl font-black mb-4 tracking-tighter italic">Ready to Start?</h2>
                    <p className="text-gray-400 font-medium mb-8">Join StudySync and start studying effectively with your peers.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/auth/login")}
                        className="px-12 py-5 rounded-2xl bg-purple-gradient text-white font-black text-lg transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                    >
                        Get Started
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}

function DocCard({ icon, title, items }: { icon: React.ReactNode, title: string, items: string[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all group"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/5 text-purple-400 group-hover:bg-purple-500/10 transition-all">
                    {icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400 font-medium text-sm">
                        <Shield size={12} className="text-purple-500 mt-1 flex-shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
