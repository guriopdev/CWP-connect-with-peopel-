"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Book, Globe, MapPin, Hash, Sparkles, ArrowRight, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SetupProfilePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
        country: "",
        education: "",
        pronouns: "",
        image: "",
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const data = await res.json();
                    if (data.username) {
                        setFormData({
                            username: data.username || "",
                            bio: data.bio || "",
                            country: data.country || "",
                            education: data.education || "",
                            pronouns: data.pronouns || "",
                            image: data.image || "",
                        });
                        setIsEditable(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/user/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/lobby");
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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
                className="z-10 w-full max-w-2xl glass-panel rounded-[4.5rem] p-12 md:p-16 text-center border border-white/5 shadow-3xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2.5 bg-purple-gradient shadow-[0_0_30px_rgba(168,85,247,0.4)]" />

                <div className="flex items-center gap-6 mb-12 text-left">
                    <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-2xl">
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{isEditable ? "Edit" : "Setup"} <span className="text-purple-500">Profile</span></h1>
                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] italic mt-2">{isEditable ? "Update your details" : "Create your profile"}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                {!isEditable && (
                    <div className="flex gap-4 mb-16 px-4">
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-purple-gradient shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "bg-white/[0.03]"}`} />
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-purple-gradient shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "bg-white/[0.03]"}`} />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center gap-6 mb-12">
                        <div className="relative group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-32 h-32 rounded-[2.5rem] border-2 border-purple-500/20 overflow-hidden bg-white/[0.02] flex items-center justify-center shadow-3xl group-hover:border-purple-500/50 transition-all duration-500"
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-gray-800" />
                                )}
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => {
                                    const url = prompt("Enter Image URL:");
                                    if (url) setFormData({ ...formData, image: url });
                                }}
                                className="absolute -bottom-2 -right-2 p-3.5 rounded-2xl bg-purple-gradient text-white shadow-3xl border border-white/10"
                            >
                                <Camera size={18} />
                            </motion.button>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-800 italic">Profile Picture</p>
                    </div>

                    {isEditable ? (
                        <div className="space-y-10 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-4 tracking-[0.3em] italic flex items-center gap-3">
                                        <Hash size={14} className="text-purple-500" /> Username
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-8 py-5 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner placeholder:text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-4 tracking-[0.3em] italic">Pronouns</label>
                                    <input
                                        type="text"
                                        value={formData.pronouns}
                                        onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                                        className="w-full px-8 py-5 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner"
                                        placeholder="e.g. He / Him"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-4 tracking-[0.3em] italic flex items-center gap-3">
                                        <MapPin size={14} className="text-purple-500" /> Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full px-8 py-5 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner"
                                        placeholder="Location"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-4 tracking-[0.3em] italic flex items-center gap-3">
                                        <Book size={14} className="text-purple-500" /> Education
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.education}
                                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        className="w-full px-8 py-5 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner"
                                        placeholder="Field of Study"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-700 mb-4 tracking-[0.3em] italic">About Me</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-8 py-5 rounded-3xl bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner resize-none leading-relaxed"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(168,85,247,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-8 rounded-[2rem] bg-purple-gradient text-white font-black text-xl italic tracking-tighter uppercase shadow-3xl"
                            >
                                Save Changes
                            </motion.button>
                        </div>
                    ) : (
                        /* SETUP MODE Flow */
                        <div className="space-y-10 text-left">
                            {step === 1 && (
                                <motion.div
                                    initial={{ x: 30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="space-y-10"
                                >
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 mb-6 italic flex items-center gap-4">
                                            <Hash size={16} className="text-purple-500" /> Choose a Username (Required)
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-purple-500 transition-colors" size={24} />
                                            <input
                                                required
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                placeholder="Your username..."
                                                className="w-full pl-16 pr-8 py-6 rounded-[1.8rem] bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none transition-all text-xl font-black italic tracking-tight uppercase shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 mb-6 italic">Pronouns</label>
                                        <select
                                            value={formData.pronouns}
                                            onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                                            className="w-full px-8 py-6 rounded-[1.8rem] bg-white/[0.02] border border-white/5 appearance-none focus:outline-none focus:border-purple-500/40 font-black italic tracking-tight uppercase shadow-inner text-gray-500 cursor-pointer"
                                        >
                                            <option value="" className="bg-[#050505]">Select pronouns...</option>
                                            <option value="he/him" className="bg-[#050505]">He / Him</option>
                                            <option value="she/her" className="bg-[#050505]">She / Her</option>
                                            <option value="they/them" className="bg-[#050505]">They / Them</option>
                                            <option value="other" className="bg-[#050505]">Other</option>
                                        </select>
                                    </div>

                                    <div className="pt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(168,85,247,0.3)" }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!formData.username}
                                            className="w-full py-8 rounded-[2rem] bg-purple-gradient text-white font-black text-xl italic tracking-tighter uppercase shadow-3xl flex items-center justify-center gap-4 disabled:opacity-20"
                                        >
                                            Continue <ArrowRight size={24} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ x: 30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="space-y-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-6 italic flex items-center gap-4">
                                                <MapPin size={18} className="text-purple-500" /> Your Location
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                placeholder="e.g. India, USA..."
                                                className="w-full px-8 py-6 rounded-[1.8rem] bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-6 italic flex items-center gap-4">
                                                <Book size={18} className="text-purple-500" /> Field of Study
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.education}
                                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                                placeholder="Institution"
                                                className="w-full px-8 py-6 rounded-[1.8rem] bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-6 italic">About You</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="w-full px-8 py-6 rounded-[2rem] bg-white/[0.02] border border-white/5 focus:border-purple-500/40 outline-none font-black italic tracking-tight uppercase shadow-inner resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="flex gap-6 pt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-7 rounded-[1.8rem] bg-white/[0.02] border border-white/5 font-black text-sm text-gray-800 tracking-widest italic uppercase hover:text-white transition-colors"
                                        >
                                            Back
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(168,85,247,0.3)" }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-[2] py-7 rounded-[2rem] bg-purple-gradient text-white font-black text-xl italic tracking-tighter uppercase shadow-3xl"
                                        >
                                            Create Profile
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
