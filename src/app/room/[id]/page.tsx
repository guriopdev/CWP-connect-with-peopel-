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
import ProfileModal from "@/components/ProfileModal";

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const [isParticipantsListOpen, setIsParticipantsListOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Media Stream Handling (preview only, before entering)
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
                setMediaError(err.message || "Camera/Mic access denied.");
            }
        }
        if (!hasEntered) {
            setupMedia();
        }

        return () => {
            // Stop preview stream when entering Jitsi (Jitsi handles its own streams)
            if (streamRef.current && hasEntered) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [hasEntered]);

    useEffect(() => {
        if (localStream && videoRef.current) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream, isVideoOff]);

    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => { track.enabled = !isMuted; });
            localStream.getVideoTracks().forEach(track => { track.enabled = !isVideoOff; });
        }
    }, [isMuted, isVideoOff, localStream]);

    // Participant tracking
    const [activeParticipants, setActiveParticipants] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const COLORS = ["bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-cyan-500", "bg-pink-500"];

    useEffect(() => {
        fetch("/api/user/profile").then(res => res.json()).then(data => {
            if (data?.id) setCurrentUserId(data.id);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!hasEntered || !currentUserId) return;

        fetch("/api/rooms/participants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId: id, action: "join" }),
        });

        const heartbeatInterval = setInterval(() => {
            fetch("/api/rooms/participants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: id, action: "heartbeat" }),
            });
        }, 10000);

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
                        color: COLORS[i % COLORS.length],
                        requestSent: false,
                        image: p.user.image || null,
                        bio: p.user.bio,
                        country: p.user.country,
                        education: p.user.education,
                    }));
                    setActiveParticipants(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch participants:", err);
            }
        };

        fetchParticipants();
        const pollInterval = setInterval(fetchParticipants, 5000);

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

    const sendFriendRequest = async (participantId: string) => {
        try {
            const res = await fetch("/api/friends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: participantId }),
            });
            if (res.ok || res.status === 409) {
                setActiveParticipants(prev => prev.map(p =>
                    p.id === participantId ? { ...p, requestSent: true } : p
                ));
            }
        } catch (err) {
            console.error("Failed to send friend request:", err);
        }
    };

    // ─── PRE-JOIN SCREEN ───
    if (!hasEntered) {
        return (
            <div className="h-screen bg-black text-white flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
                <InteractiveBackground />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="z-10 w-full max-w-lg sm:max-w-2xl glass-panel rounded-[2rem] sm:rounded-[4.5rem] p-8 sm:p-16 md:p-24 text-center border border-white/5 shadow-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 sm:h-2.5 bg-purple-gradient shadow-[0_0_30px_rgba(168,85,247,0.4)]" />

                    <div className="w-56 h-40 sm:w-80 sm:h-60 bg-black rounded-xl sm:rounded-[2.5rem] mx-auto mb-8 sm:mb-12 overflow-hidden border border-white/10 relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
                        {!isVideoOff ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover -scale-x-100"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                    <VideoOff size={32} className="text-gray-800" />
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 flex gap-2 items-center px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/10">
                            <div className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-purple-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">{isMuted ? 'Muted' : 'Mic On'}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4 italic tracking-tighter uppercase leading-none">Join <span className="text-purple-500">Room</span></h1>
                    <p className="text-[10px] sm:text-sm font-black text-gray-700 mb-8 sm:mb-16 uppercase tracking-[0.3em] sm:tracking-[0.4em] italic">Room ID: {id.slice(0, 8)}</p>

                    <div className="flex items-center justify-center gap-8 sm:gap-12 mb-10 sm:mb-20">
                        <div className="flex flex-col items-center gap-3 sm:gap-5">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMuted(!isMuted)}
                                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-[1.8rem] flex items-center justify-center transition-all border-2 ${!isMuted ? 'bg-purple-gradient border-purple-400/20 text-white shadow-2xl shadow-purple-500/20' : 'bg-white/[0.02] border-white/5 text-gray-700 hover:text-white'}`}
                            >
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                            </motion.button>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-700 italic">{isMuted ? "Off" : "On"}</span>
                        </div>

                        <div className="flex flex-col items-center gap-3 sm:gap-5">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-[1.8rem] flex items-center justify-center transition-all border-2 ${!isVideoOff ? 'bg-purple-gradient border-purple-400/20 text-white shadow-2xl shadow-purple-500/20' : 'bg-white/[0.02] border-white/5 text-gray-700 hover:text-white'}`}
                            >
                                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                            </motion.button>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-700 italic">{isVideoOff ? "Off" : "On"}</span>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                // Stop preview stream before Jitsi takes over
                                if (streamRef.current) {
                                    streamRef.current.getTracks().forEach(track => track.stop());
                                }
                                setHasEntered(true);
                            }}
                            className="w-full py-5 sm:py-8 rounded-xl sm:rounded-[2rem] bg-purple-gradient text-white font-black text-lg sm:text-2xl italic tracking-tighter uppercase shadow-3xl"
                        >
                            Enter Room
                        </motion.button>
                        <button
                            onClick={() => router.push('/lobby')}
                            className="w-full py-3 sm:py-5 rounded-lg sm:rounded-[1.5rem] bg-white/[0.02] text-gray-700 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:text-white hover:bg-white/[0.05] transition-all italic underline underline-offset-8 decoration-purple-500/30"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── IN-ROOM VIEW (Jitsi Embed) ───
    return (
        <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative">
            {/* Room Header */}
            <header className="h-14 sm:h-16 md:h-20 px-3 sm:px-6 md:px-10 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between z-[60] relative flex-shrink-0">
                <div className="flex items-center gap-3 sm:gap-6 md:gap-10">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/lobby" className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-2xl border border-purple-500/20 hover:scale-110 transition-transform">
                            <Shield className="text-purple-500" size={16} />
                        </Link>
                        <div>
                            <h1 className="font-black text-xs sm:text-base md:text-xl italic uppercase tracking-tighter">Room_<span className="text-purple-500">{id.slice(0, 8).toUpperCase()}</span></h1>
                            <p className="text-[7px] sm:text-[9px] text-gray-600 font-black uppercase tracking-wider flex items-center gap-1.5 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                            </p>
                        </div>
                    </div>

                    {/* Participants Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsParticipantsListOpen(!isParticipantsListOpen)}
                            className="flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl bg-white/[0.03] border border-white/10 text-[8px] sm:text-[10px] font-black uppercase tracking-wider hover:border-purple-500/40 transition-all italic"
                        >
                            <Users size={12} className="text-purple-500/60" /> {activeParticipants.length}
                        </button>

                        <AnimatePresence>
                            {isParticipantsListOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    className="absolute top-12 left-0 w-64 sm:w-80 glass-panel border border-white/10 rounded-2xl p-4 sm:p-6 shadow-3xl z-[70] bg-black/95 backdrop-blur-[40px]"
                                >
                                    <h3 className="text-[9px] sm:text-[10px] italic uppercase font-black tracking-[0.3em] text-gray-700 mb-4 sm:mb-6 border-b border-white/5 pb-3">Participants</h3>
                                    <div className="space-y-3 sm:space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                                        {activeParticipants.length === 0 ? (
                                            <p className="text-[9px] text-gray-700 font-bold italic text-center py-4">Connecting...</p>
                                        ) : (
                                            activeParticipants.map(p => (
                                                <div key={p.id} className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => !p.isMe && setSelectedUser(p)}>
                                                        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg ${p.color} border border-white/10 flex items-center justify-center text-[9px] sm:text-xs font-black italic overflow-hidden shadow-lg group-hover:scale-110 transition-transform`}>
                                                            {p.image ? (
                                                                <img src={p.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                p.name[0]
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] sm:text-[11px] font-black italic uppercase tracking-tight truncate max-w-[80px] sm:max-w-[120px] group-hover:text-purple-400 transition-colors">{p.name} {p.isMe && "(You)"}</span>
                                                    </div>
                                                    {!p.isMe && (
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => sendFriendRequest(p.id)}
                                                            disabled={p.requestSent}
                                                            className={`px-2 sm:px-3 py-1 rounded-lg text-[7px] sm:text-[8px] font-black uppercase tracking-wider transition-all flex-shrink-0 ${p.requestSent ? "bg-white/5 text-gray-700" : "bg-purple-gradient text-white shadow-lg"}`}
                                                        >
                                                            {p.requestSent ? "Sent" : "Add"}
                                                        </motion.button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <ProfileModal 
                            user={selectedUser} 
                            isOpen={!!selectedUser} 
                            onClose={() => setSelectedUser(null)} 
                            onMessage={selectedUser ? () => router.push(`/lobby?chatMode=dm&chatUser=${selectedUser.id}`) : undefined}
                        />
                    </div>
                </div>

                {/* Leave Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                        await fetch("/api/rooms/participants", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ roomId: id, action: "leave" }),
                        });
                        router.push("/lobby");
                    }}
                    className="px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl bg-red-600/90 hover:bg-red-600 border border-red-500/30 text-white shadow-xl transition-all flex items-center gap-1.5 sm:gap-2 font-black text-[9px] sm:text-[11px] uppercase tracking-wider italic"
                >
                    <PhoneOff size={14} fill="currentColor" /> Leave
                </motion.button>
            </header>

            {/* ─── Jitsi Meet Video Conference ─── */}
            <div className="flex-1 relative z-10 bg-black">
                <iframe
                    src={`https://meet.ffmuc.net/CWP-StudyRoom-${id}#config.startWithAudioMuted=${isMuted}&config.startWithVideoMuted=${isVideoOff}&config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.disableInviteFunctions=true&interfaceConfig.HIDE_INVITE_MORE_HEADER=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.DEFAULT_BACKGROUND=%23000000&interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true`}
                    allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                    className="w-full h-full border-0"
                    style={{ background: "#000" }}
                />
            </div>
        </div>
    );
}
