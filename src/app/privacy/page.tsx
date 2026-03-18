"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function PrivacyPage() {
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
                        <Shield size={40} className="text-purple-500" />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Privacy Policy</h1>
                    </div>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-16">Last updated: March 2026</p>

                    <div className="space-y-12 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">1. Information We Collect</h2>
                            <p className="font-medium">When you create an account on StudySync, we collect your name, email address, and profile information provided through your Google account. We also collect usage data such as room participation, messages sent, and study session durations to improve our platform.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">2. How We Use Your Information</h2>
                            <p className="font-medium">Your information is used to provide and maintain the StudySync service, including authenticating your identity, enabling social features like friend requests and messaging, and personalizing your experience. We do not sell your personal data to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">3. Data Storage & Security</h2>
                            <p className="font-medium">All data is stored securely using industry-standard encryption. Our database is hosted on secure cloud infrastructure with automated backups. Video calls are processed through Jitsi Meet servers and are not recorded or stored by StudySync.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">4. Cookies & Tracking</h2>
                            <p className="font-medium">We use essential cookies for authentication and session management. We do not use third-party tracking cookies or advertising trackers. Your browsing activity on StudySync is not shared with advertisers.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">5. Your Rights</h2>
                            <p className="font-medium">You have the right to access, modify, or delete your personal data at any time. You can update your profile information through the Settings page or contact us to request complete data deletion.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">6. Contact Us</h2>
                            <p className="font-medium">If you have any questions about this Privacy Policy, please reach out through our Discord or GitHub linked in the footer of our website.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
