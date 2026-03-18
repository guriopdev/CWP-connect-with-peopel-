"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function LicensePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <InteractiveBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-32">
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
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">License</h1>
                    </div>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-16">MIT License — Copyright © 2026</p>

                    <div className="glass-panel rounded-3xl p-10 border border-white/10 mb-12">
                        <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{`MIT License

Copyright (c) 2026 StudySync Labs (guriopdev)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</pre>
                    </div>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Open Source</h2>
                            <p className="font-medium">StudySync is an open-source project. You are free to use, modify, and distribute this software under the terms of the MIT License. Contributions are welcome on our <a href="https://github.com/guriopdev" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors underline">GitHub</a>.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Third-Party Services</h2>
                            <p className="font-medium">StudySync uses Jitsi Meet for video conferencing, which is licensed under the Apache License 2.0. NextAuth.js is used for authentication under the ISC License. All third-party dependencies retain their respective licenses.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
