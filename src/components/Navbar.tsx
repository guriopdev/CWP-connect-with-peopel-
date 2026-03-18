"use client";

import { useSession, signOut } from "next-auth/react";
import { Sparkles, Users, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Lobby", href: "/lobby" },
        { name: "Friends", href: "/friends" },
        { name: "To-Do", href: "/todo" },
        { name: "Pomodoro", href: "/pomodoro" },
        { name: "AI Bot", href: "/ai-bot" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-8 left-1/2 z-[100] w-[90%] md:w-max px-8 py-4 glass-panel rounded-[2rem] flex items-center justify-between gap-12 group transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)] border-white/5"
            >
                <a href="/" className="flex items-center gap-3 text-2xl font-black text-white cursor-pointer shrink-0 group/logo">
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <Sparkles size={28} className="text-purple-500" />
                    </motion.div>
                    <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-500/50">StudySync</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center flex-row gap-8 font-bold text-sm tracking-widest uppercase">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="relative text-gray-400 hover:text-white transition-colors py-2 group/link"
                        >
                            {link.name}
                            <motion.span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover/link:w-full" />
                        </a>
                    ))}

                    <div className="flex items-center gap-6 ml-4 pl-8 border-l border-white/10">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <a href="/auth/setup-profile" className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-purple-500 transition-all flex items-center justify-center bg-white/5 ring-0 hover:ring-4 ring-purple-500/20" title="Profile">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <Users size={20} className="text-gray-400" />
                                    )}
                                </a>
                                <button
                                    onClick={() => signOut()}
                                    className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-black hover:bg-red-500/10 hover:border-red-500/20 transition-all text-[10px] tracking-widest"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <a href="/auth/login" className="px-8 py-3 rounded-xl bg-purple-gradient text-white font-black hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest shadow-[0_10px_20px_-5px_rgba(168,85,247,0.4)]">
                                LOGIN / SYNC
                            </a>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center lg:hidden"
                    >
                        <div className="flex flex-col items-center gap-12">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-4xl font-black text-white hover:text-purple-500 transition-colors italic tracking-tighter"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            {!session && (
                                <a
                                    href="/auth/login"
                                    className="px-12 py-6 rounded-2xl bg-purple-gradient text-white font-black text-2xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

