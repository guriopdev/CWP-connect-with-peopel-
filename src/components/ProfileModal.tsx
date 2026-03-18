import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, MapPin, BookOpen, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileModal({ user, isOpen, onClose, onMessage }: { user: any, isOpen: boolean, onClose: () => void, onMessage?: () => void }) {
    const router = useRouter();

    if (!isOpen || !user) return null;

    const handleMessage = () => {
        onClose();
        if (onMessage) {
            onMessage();
        } else {
            router.push(`/lobby?chatMode=dm&chatUser=${user.id}`);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="z-10 w-full max-w-sm glass-panel rounded-[2.5rem] p-6 sm:p-8 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-gradient shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>

                    <div className="flex flex-col items-center mt-4">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-purple-gradient flex items-center justify-center text-4xl font-black italic flex-shrink-0 mb-4 border-2 border-white/5 shadow-2xl overflow-hidden">
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name?.[0] || <User size={40} />
                            )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-center">{user.name || "User"}</h2>
                        <p className="text-sm font-bold text-purple-400 mb-6 tracking-widest uppercase">
                            {user.username ? `@${user.username}` : ""}
                        </p>

                        <div className="w-full space-y-4 mb-8 text-left">
                            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Bio</p>
                                <p className="text-sm text-gray-300 italic">{user.bio || "No bio provided."}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                                    <MapPin size={16} className="text-emerald-500" />
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Location</p>
                                        <p className="text-[11px] font-bold truncate">{user.country || "Unknown"}</p>
                                    </div>
                                </div>
                                <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                                    <BookOpen size={16} className="text-blue-500" />
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Education</p>
                                        <p className="text-[11px] font-bold truncate">{user.education || "Unknown"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleMessage}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-purple-gradient text-white font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
                        >
                            <MessageSquare size={16} /> Send Message
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
