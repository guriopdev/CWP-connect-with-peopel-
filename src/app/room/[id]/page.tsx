"use client";

import { useState, useRef, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, MicOff, Video, VideoOff,
    PhoneOff, Monitor, MessageCircle,
    Users, Shield, Maximize2,
    Send, MoreVertical, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isParticipantsListOpen, setIsParticipantsListOpen] = useState(false);

    // Media Stream Handling
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [mediaError, setMediaError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        async function setupMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setMediaError(null);
            } catch (err: any) {
                console.error("Error accessing media devices:", err);
                setMediaError(err.message || "Camera/Mic access denied. Please check permissions.");
            }
        }
        setupMedia();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (localStream && videoRef.current) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream, hasEntered, isVideoOff]);

    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff;
            });
        }
    }, [isMuted, isVideoOff, localStream]);

    const [activeParticipants, setActiveParticipants] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const COLORS = ["bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-cyan-500", "bg-pink-500"];

    // Fetch current user session
    useEffect(() => {
        fetch("/api/user/profile").then(res => res.json()).then(data => {
            if (data?.id) setCurrentUserId(data.id);
        }).catch(() => {});
    }, []);

    // Join room when user enters, heartbeat every 10s, leave on unmount
    useEffect(() => {
        if (!hasEntered || !currentUserId) return;

        // Join
        fetch("/api/rooms/participants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId: id, action: "join" }),
        });

        // Heartbeat every 10 seconds
        const heartbeatInterval = setInterval(() => {
            fetch("/api/rooms/participants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: id, action: "heartbeat" }),
            });
        }, 10000);

        // Poll participants every 5 seconds
        const fetchParticipants = async () => {
            try {
                const res = await fetch(`/api/rooms/participants?roomId=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.map((p: any, i: number) => ({
                        id: p.user.id,
                        name: p.user.name || "User",
                        username: p.user.username ? `@${p.user.username}` : "",
                        isMe: p.user.id === currentUserId,
                        isSpeaking: false,
                        color: COLORS[i % COLORS.length],
                        isFriend: false,
                        requestSent: false,
                        bio: p.user.bio || "",
                        country: p.user.country || "",
                        education: p.user.education || "",
                        image: p.user.image || null,
                    }));
                    setActiveParticipants(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch participants:", err);
            }
        };

        fetchParticipants();
        const pollInterval = setInterval(fetchParticipants, 5000);

        // Leave on unmount
        return () => {
            clearInterval(heartbeatInterval);
            clearInterval(pollInterval);
            fetch("/api/rooms/participants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: id, action: "leave" }),
            });
        };
    }, [hasEntered, currentUserId, id]);

    const sendFriendRequest = (participantId: string) => {
        setActiveParticipants(prev => prev.map(p =>
            p.id === participantId ? { ...p, requestSent: true } : p
        ));
    };

    if (!hasEntered) {
        return (
            <div className="h-screen bg-black text-white flex items-center justify-center p-8 relative overflow-hidden">
                {/* High-Performance Technical Background */}
                <InteractiveBackground />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="z-10 w-full max-w-2xl glass-panel rounded-[4.5rem] p-16 md:p-24 text-center border border-white/5 shadow-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2.5 bg-purple-gradient shadow-[0_0_30px_rgba(168,85,247,0.4)]" />

                    <div className="w-80 h-60 bg-black rounded-[2.5rem] mx-auto mb-12 overflow-hidden border border-white/10 relative group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
                        {!isVideoOff ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover -scale-x-100 transition-opacity duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
                                <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                    <VideoOff size={48} className="text-gray-800" />
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-6 left-6 flex gap-2 items-center px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10">
                            <div className={`w-2.5 h-2.5 rounded-full ${!isMuted ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isMuted ? 'Muted' : 'Mic_Active'}</span>
                        </div>
                    </div>

                    <h1 className="text-5xl font-black mb-4 italic tracking-tighter uppercase leading-none">Join <span className="text-purple-500">Room</span></h1>
                    <p className="text-sm font-black text-gray-700 mb-16 uppercase tracking-[0.4em] italic">Room ID: {id}</p>

                    <div className="flex items-center justify-center gap-12 mb-20">
                        <div className="flex flex-col items-center gap-5">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMuted(!isMuted)}
                                className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center transition-all border-2 ${!isMuted ? 'bg-purple-gradient border-purple-400/20 text-white shadow-2xl shadow-purple-500/20' : 'bg-white/[0.02] border-white/5 text-gray-700 hover:text-white'}`}
                            >
                                {isMuted ? <MicOff size={32} /> : <Mic size={32} />}
                            </motion.button>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 italic">{isMuted ? "Disabled" : "Active"}</span>
                        </div>

                        <div className="flex flex-col items-center gap-5">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center transition-all border-2 ${!isVideoOff ? 'bg-purple-gradient border-purple-400/20 text-white shadow-2xl shadow-purple-500/20' : 'bg-white/[0.02] border-white/5 text-gray-700 hover:text-white'}`}
                            >
                                {isVideoOff ? <VideoOff size={32} /> : <Video size={32} />}
                            </motion.button>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 italic">{isVideoOff ? "Disabled" : "Active"}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(168,85,247,0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setHasEntered(true)}
                            className="w-full py-8 rounded-[2rem] bg-purple-gradient text-white font-black text-2xl italic tracking-tighter uppercase shadow-3xl"
                        >
                            Enter Room
                        </motion.button>
                        <button
                            onClick={() => router.push('/lobby')}
                            className="w-full py-5 rounded-[1.5rem] bg-white/[0.02] text-gray-700 font-black text-[11px] uppercase tracking-[0.4em] hover:text-white hover:bg-white/[0.05] transition-all italic underline underline-offset-8 decoration-purple-500/30"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative">
            {/* Technical Background (Subtle for focus) */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <InteractiveBackground />
            </div>

            {/* Room Header */}
            <header className="h-24 px-10 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between z-[60] relative">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-6">
                        <Link href="/lobby" className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 hover:scale-110 transition-transform group">
                            <Shield className="text-purple-500 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" size={24} />
                        </Link>
                        <div>
                            <h1 className="font-black text-xl italic uppercase tracking-tighter">Room_<span className="text-purple-500">{id.slice(0, 8).toUpperCase()}</span></h1>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" /> Live
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsParticipantsListOpen(!isParticipantsListOpen)}
                            className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-widest hover:border-purple-500/40 transition-all italic"
                        >
                            <Users size={16} className="text-purple-500/60" /> {activeParticipants.length} Connected
                        </button>

                        <AnimatePresence>
                            {isParticipantsListOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    className="absolute top-16 left-0 w-80 glass-panel border border-white/10 rounded-[2.5rem] p-8 shadow-3xl z-[70] bg-black/90 backdrop-blur-[40px]"
                                >
                                    <h3 className="text-[10px] italic uppercase font-black tracking-[0.3em] text-gray-700 mb-8 border-b border-white/5 pb-4">Participants</h3>
                                    <div className="space-y-5">
                                        {activeParticipants.map(p => (
                                            <div key={p.id} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl ${p.color} border border-white/10 flex items-center justify-center text-xs font-black italic`}>
                                                        {p.name[0]}
                                                    </div>
                                                    <span className="text-xs font-black italic uppercase tracking-tight">{p.name} {p.isMe && "<YOU>"}</span>
                                                </div>
                                                {!p.isMe && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => sendFriendRequest(p.id)}
                                                        disabled={p.requestSent}
                                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${p.requestSent ? "bg-white/5 text-gray-700" : p.isFriend ? "bg-white/10 text-purple-400" : "bg-purple-gradient text-white shadow-lg"
                                                            }`}
                                                    >
                                                        {p.requestSent ? "PENDING" : p.isFriend ? "FRIENDS" : "ADD FRIEND"}
                                                    </motion.button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black text-gray-600 tracking-[0.2em] italic uppercase">
                        Encryption_Level: <span className="text-purple-500">AES-256</span>
                    </div>
                </div>
            </header>

            {mediaError && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="bg-red-500/10 border-b border-red-500/30 px-10 py-3 flex items-center justify-between z-[55] backdrop-blur-md"
                >
                    <p className="text-[10px] font-black text-red-400 flex items-center gap-3 uppercase tracking-[0.2em] italic">
                        <Shield size={16} className="text-red-500 animate-pulse" /> {mediaError.toUpperCase()}
                    </p>
                    <button onClick={() => window.location.reload()} className="text-[9px] font-black uppercase tracking-[0.3em] italic bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors shadow-2xl">
                        Retry Camera
                    </button>
                </motion.div>
            )}

            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Video Grid Matrix */}
                <main className="flex-1 p-8 relative overflow-y-auto custom-scrollbar">
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
                        {activeParticipants.map((p) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`relative rounded-[3rem] overflow-hidden border-2 transition-all duration-700 group ${p.isSpeaking ? "border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.15)]" : "border-white/5"
                                    } bg-white/[0.01]`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {p.isMe ? (
                                        <div className="w-full h-full relative">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className={`w-full h-full object-cover transition-all duration-1000 ${isVideoOff ? 'opacity-0 scale-110' : 'opacity-100 scale-100'} -scale-x-100`}
                                            />
                                            {isVideoOff && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black">
                                                    <div className={`w-32 h-32 rounded-[2.5rem] ${p.color} flex items-center justify-center text-5xl font-black italic shadow-3xl border-4 border-white/10 group-hover:scale-110 transition-transform duration-700`}>
                                                        {p.name[0]}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white/[0.01]">
                                            <div className={`w-32 h-32 rounded-[2.5rem] ${p.color} flex items-center justify-center text-5xl font-black italic shadow-3xl border-4 border-white/10 group-hover:scale-110 transition-transform duration-700`}>
                                                {p.name[0]}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Participant Label Overlay */}
                                <div className="absolute bottom-8 left-8 flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-3xl z-10">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic text-white/90">{p.name} {p.isMe && "(YOU)"}</span>
                                    {p.isSpeaking && (
                                        <div className="flex gap-1 items-end h-4 pb-1">
                                            <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                            <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                        </div>
                                    )}
                                </div>

                                {/* Tactical Decorative Corners */}
                                <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-600 hover:text-white cursor-pointer transition-colors">
                                        <MoreVertical size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>

                {/* Tactical Chat Sidebar */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.aside
                            initial={{ x: 500, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 500, opacity: 0 }}
                            className="w-[450px] border-l border-white/10 bg-black/40 backdrop-blur-3xl flex flex-col z-40 shadow-[-50px_0_100px_-20px_rgba(0,0,0,0.5)]"
                        >
                            <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                <h2 className="font-black italic uppercase tracking-[0.4em] text-[11px] flex items-center gap-4 text-white">
                                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <MessageCircle size={18} className="text-purple-500" />
                                    </div>
                                    Chat
                                </h2>
                                <button onClick={() => setIsChatOpen(false)} className="p-3 text-gray-700 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10"><Maximize2 size={14} /></button>
                            </div>

                            <div className="flex-1 p-10 flex flex-col items-center justify-center text-center opacity-30 custom-scrollbar">
                                <MessageCircle size={40} className="mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">No messages yet. Say hello!</p>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-white/[0.01]">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-purple-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                    <input
                                        type="text"
                                        placeholder="TYPE A MESSAGE..."
                                        className="relative w-full pl-6 pr-16 py-6 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-500/40 outline-none transition-all text-sm font-black italic uppercase tracking-tight placeholder:text-gray-800"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 rounded-xl bg-purple-gradient text-white shadow-2xl"
                                    >
                                        <Send size={18} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            {/* Tactical Footer Controls */}
            <footer className="h-32 px-12 border-t border-white/5 bg-black/60 backdrop-blur-[50px] z-[60] relative">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <ControlBtn
                            active={!isMuted}
                            onClick={() => setIsMuted(!isMuted)}
                            icon={isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                        />
                        <ControlBtn
                            active={!isVideoOff}
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            icon={isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                        />
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-10">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(239,68,68,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                                await fetch("/api/rooms/participants", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ roomId: id, action: "leave" }),
                                });
                                router.push("/lobby");
                            }}
                            className="px-12 py-5 rounded-[2rem] bg-red-600/90 hover:bg-red-600 border border-red-500/30 text-white shadow-3xl transition-all flex items-center gap-4 font-black text-sm uppercase tracking-[0.3em] italic"
                        >
                            <PhoneOff size={24} fill="currentColor" /> Leave
                        </motion.button>
                    </div>

                    <div className="flex items-center gap-6">
                        <ControlBtn icon={<Monitor size={24} />} />
                        <ControlBtn
                            active={isChatOpen}
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            icon={<MessageCircle size={24} />}
                        />
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ControlBtn({ icon, active = false, onClick }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`w-16 h-16 rounded-[1.5rem] border-2 transition-all flex items-center justify-center ${active
                ? "bg-purple-gradient border-purple-400/20 shadow-2xl shadow-purple-500/30 text-white"
                : "bg-white/[0.03] border-white/5 text-gray-700 hover:text-white hover:bg-white/[0.05] hover:border-white/10"
                }`}
        >
            {icon}
        </motion.button>
    );
}

function RoomMessage({ user, text, time, isMe = false }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: isMe ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
        >
            <div className="flex items-center gap-3 mb-2 px-2">
                <span className="text-[10px] font-black uppercase text-purple-500 tracking-[0.2em] italic">{user}</span>
                <span className="text-[9px] text-gray-700 font-black italic">{time}</span>
            </div>
            <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-black italic tracking-tight leading-relaxed shadow-3xl ${isMe ? "bg-purple-gradient text-white rounded-tr-none border border-purple-400/20" : "bg-white/[0.03] text-gray-300 rounded-tl-none border border-white/5"
                }`}>
                {text}
            </div>
        </motion.div>
    );
}
