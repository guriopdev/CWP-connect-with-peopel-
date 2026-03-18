"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, MessageSquare, LogOut,
    Search, Plus, Users, Lock, X, Sparkles, ArrowLeft, Flag,
    Send, Shield, Bell, Moon, Settings, CheckCheck, Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

import { Suspense } from "react";

type View = "rooms" | "chat" | "settings";
type ChatMode = "global" | "dm";

import ProfileModal from "@/components/ProfileModal";

function LobbyContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated" && !session?.user?.hasCompletedProfile) {
            router.push("/auth/setup-profile");
        }
    }, [session, status, router]);

    const initialChatMode = (searchParams.get("chatMode") as ChatMode) || "global";
    const initialView = searchParams.has("chatMode") ? "chat" : "rooms";

    const [activeTab, setActiveTab] = useState<View>(initialView);
    const [chatMode, setChatMode] = useState<ChatMode>(initialChatMode);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [friends, setFriends] = useState<any[]>([]);

    useEffect(() => {
        const mode = searchParams.get("chatMode");
        if (mode && (mode === "global" || mode === "dm")) {
            setActiveTab("chat");
            setChatMode(mode as ChatMode);
        }
    }, [searchParams]);

    useEffect(() => {
        fetch("/api/user/profile").then(r => r.json()).then(d => { if (d?.id) setCurrentUserId(d.id); }).catch(() => {});
        fetch("/api/friends").then(r => r.json()).then(d => {
            if (d && d.sent && d.received) {
                const accepted = [
                    ...d.sent.filter((r: any) => r.status === "accepted").map((r: any) => r.receiver),
                    ...d.received.filter((r: any) => r.status === "accepted").map((r: any) => r.sender)
                ];
                setFriends(accepted);
            }
        }).catch(() => {});
    }, []);

    const [newRoom, setNewRoom] = useState({ name: "", subject: "General", isLocked: false, password: "" });
    const [protectedRoom, setProtectedRoom] = useState<any>(null);
    const [inputPassword, setInputPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    // Fetch rooms from the database on load
    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await fetch("/api/rooms");
                if (res.ok) {
                    const data = await res.json();
                    setRooms(data);
                }
            } catch (err) {
                console.error("Failed to fetch rooms:", err);
            } finally {
                setLoadingRooms(false);
            }
        }
        if (status === "authenticated") {
            fetchRooms();
        }
    }, [status]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newRoom.name,
                    subject: newRoom.subject,
                    isLocked: newRoom.isLocked,
                    password: newRoom.password,
                }),
            });
            if (res.ok) {
                const createdRoom = await res.json();
                setRooms([createdRoom, ...rooms]);
                setIsCreateModalOpen(false);
                setNewRoom({ name: "", subject: "General", isLocked: false, password: "" });
            }
        } catch (err) {
            console.error("Failed to create room:", err);
        }
    };

    const handleJoinRoom = (room: any) => {
        if (room.isLocked) {
            setProtectedRoom(room);
            setInputPassword("");
            setPasswordError(false);
        } else {
            router.push(`/room/${room.id}`);
        }
    };

    const verifyPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/rooms/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId: protectedRoom.id,
                    password: inputPassword,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    router.push(`/room/${protectedRoom.id}`);
                } else {
                    setPasswordError(true);
                }
            } else {
                setPasswordError(true);
            }
        } catch (err) {
            setPasswordError(true);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-x-hidden">
            <Navbar />

            {/* Premium Technical Background */}
            <InteractiveBackground />

            {/* Sidebar with High-Blur Glass */}
            <aside className="w-full md:w-28 flex flex-row md:flex-col items-center py-6 md:py-16 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 backdrop-blur-3xl z-[60] fixed md:sticky top-0 md:h-screen">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="hidden md:flex p-5 rounded-3xl bg-purple-gradient mb-16 shadow-[0_20px_40px_-10px_rgba(168,85,247,0.3)]"
                >
                    <LayoutDashboard size={32} />
                </motion.div>
                <div className="flex flex-row md:flex-col justify-around w-full md:w-auto md:gap-12">
                    <SidebarIcon
                        active={activeTab === "rooms"}
                        onClick={() => setActiveTab("rooms")}
                        icon={<LayoutDashboard size={28} />}
                        label="LOBBY"
                    />
                    <SidebarIcon
                        active={activeTab === "chat"}
                        onClick={() => setActiveTab("chat")}
                        icon={<MessageSquare size={28} />}
                        label="MESSAGE"
                    />
                    <div className="md:mt-auto">
                        <SidebarIcon icon={<LogOut size={28} />} className="text-red-500/40 hover:text-red-600" label="LOGOUT" />
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-8 md:p-24 overflow-y-auto relative z-10 pt-44 md:pt-32">
                <AnimatePresence mode="wait">
                    {activeTab === "rooms" && (
                        <motion.div
                            key="rooms"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-24">
                                <div className="max-w-2xl">
                                    <h1 className="text-7xl md:text-[6rem] font-black mb-8 italic leading-[0.85] tracking-tighter">
                                        STUDY <span className="hero-gradient-text">ROOMS</span>
                                    </h1>
                                    <p className="text-2xl text-gray-500 font-medium italic border-l-2 border-purple-500/30 pl-8 ml-2">
                                        Find a room to join or create your own to start studying.
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 group">
                                    <div className="relative flex-1">
                                        <div className="absolute -inset-1 bg-purple-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                        <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 flex items-center gap-4 min-w-[320px]">
                                            <Search className="text-gray-600" size={20} />
                                            <input
                                                type="text"
                                                placeholder="SEARCH ROOMS..."
                                                className="bg-transparent border-none outline-none w-full font-black text-xs tracking-[0.2em] placeholder:text-gray-800 italic"
                                            />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90, boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="p-6 rounded-[1.5rem] bg-purple-gradient text-white shadow-2xl"
                                    >
                                        <Plus size={32} />
                                    </motion.button>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12">
                                {rooms.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-gray-500 font-bold italic">
                                        No active rooms found. Create one to get started!
                                    </div>
                                ) : (
                                    rooms.map((room) => (
                                        <RoomCard
                                            key={room.id}
                                            room={room}
                                            onJoin={() => handleJoinRoom(room)}
                                            isOwner={room.adminId === currentUserId || room.admin === session?.user?.username || room.admin === session?.user?.name}
                                            onDelete={async () => {
                                                const res = await fetch(`/api/rooms/delete?roomId=${room.id}`, { method: "DELETE" });
                                                if (res.ok) setRooms(rooms.filter(r => r.id !== room.id));
                                            }}
                                        />
                                    ))
                                )}
                                <motion.div
                                    onClick={() => setIsCreateModalOpen(true)}
                                    whileHover={{ y: -15, borderColor: "rgba(168,85,247,0.5)", background: "rgba(255,255,255,0.02)" }}
                                    className="rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-20 text-gray-700 hover:text-purple-400 transition-all cursor-pointer group min-h-[450px]"
                                >
                                    <div className="p-10 rounded-full bg-white/[0.02] mb-10 group-hover:bg-purple-500/10 transition-all duration-500 border border-white/5 group-hover:border-purple-500/20">
                                        <Plus size={72} className="group-hover:scale-110 transition-transform text-purple-500/40" />
                                    </div>
                                    <span className="font-black uppercase tracking-[0.4em] text-[11px]">Create New Room</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "chat" && <ChatView chatMode={chatMode} setChatMode={setChatMode} friends={friends} />}
                    {activeTab === "settings" && <SettingsView />}
                </AnimatePresence>
            </main>

            {/* Create Room Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            className="z-10 w-full max-w-2xl glass-panel rounded-[4.5rem] p-16 md:p-24 border border-white/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-purple-gradient shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
                            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-12 right-12 text-gray-700 hover:text-white transition-colors">
                                <X size={36} />
                            </button>

                            <h2 className="text-6xl font-black mb-16 italic tracking-tighter uppercase leading-[0.8] text-white">Create <br /><span className="text-purple-500">Room</span></h2>
                            <form onSubmit={handleCreateRoom} className="space-y-12">
                                <div className="group/input">
                                    <label className="block text-[11px] font-black uppercase text-gray-700 mb-5 tracking-[0.3em] group-focus-within/input:text-purple-400 transition-colors">Room Name</label>
                                    <input
                                        required
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                        placeholder="Math Study Group..."
                                        className="w-full px-10 py-7 rounded-[2rem] bg-white/[0.03] border border-white/10 focus:border-purple-500/40 outline-none transition-all font-black text-2xl italic uppercase placeholder:text-gray-900 tracking-tight"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-700 mb-5 tracking-[0.3em]">Subject</label>
                                    <select
                                        value={newRoom.subject}
                                        onChange={(e) => setNewRoom({ ...newRoom, subject: e.target.value })}
                                        className="w-full px-10 py-7 rounded-[2rem] bg-white/[0.03] border border-white/10 outline-none font-black text-xl uppercase appearance-none cursor-pointer hover:bg-white/[0.05] transition-colors"
                                    >
                                        <option value="General" className="bg-black">General</option>
                                        <option value="Computer Science" className="bg-black">Computer Science</option>
                                        <option value="Math" className="bg-black">Math</option>
                                        <option value="Art" className="bg-black">Art</option>
                                    </select>
                                </div>
                                <div className="space-y-8 bg-white/[0.01] p-10 rounded-[2.5rem] border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-[11px] text-gray-700 uppercase tracking-[0.3em]">Make Private</span>
                                        <input
                                            type="checkbox"
                                            checked={newRoom.isLocked}
                                            onChange={(e) => setNewRoom({ ...newRoom, isLocked: e.target.checked })}
                                            className="w-7 h-7 accent-purple-600 cursor-pointer"
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {newRoom.isLocked && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pt-6"
                                            >
                                                <input
                                                    required
                                                    type="password"
                                                    value={newRoom.password}
                                                    onChange={(e) => setNewRoom({ ...newRoom, password: e.target.value })}
                                                    placeholder="SYNC_WORDS"
                                                    className="w-full px-10 py-7 rounded-[2rem] bg-white/[0.03] border border-white/10 focus:border-purple-500/40 outline-none transition-all font-black text-2xl tracking-[0.4em] text-center italic placeholder:text-gray-900"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(168,85,247,0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-9 rounded-[2.5rem] bg-purple-gradient font-black text-3xl tracking-tighter italic uppercase shadow-3xl transition-all border border-purple-400/20"
                                >
                                    Create Room
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Join Protected Room Modal */}
            <AnimatePresence>
                {protectedRoom && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProtectedRoom(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="z-10 w-full max-w-md glass-panel rounded-[3rem] p-8 md:p-12 border border-white/10 relative text-center"
                        >
                            <button onClick={() => setProtectedRoom(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>

                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400 border border-purple-500/20">
                                <Lock size={32} />
                            </div>

                            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Protected Room</h2>
                            <p className="text-gray-500 font-medium mb-8 italic">"{protectedRoom.name}" requires sync words.</p>

                            <form onSubmit={verifyPassword} className="space-y-6">
                                <div>
                                    <input
                                        autoFocus
                                        required
                                        type="password"
                                        value={inputPassword}
                                        onChange={(e) => {
                                            setInputPassword(e.target.value);
                                            setPasswordError(false);
                                        }}
                                        placeholder="Enter sync words..."
                                        className={`w-full px-6 py-4 rounded-2xl bg-white/5 border ${passwordError ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500/50 outline-none transition-all font-bold text-center text-xl tracking-widest`}
                                    />
                                    {passwordError && (
                                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 animate-bounce">Incorrect Sync Words</p>
                                    )}
                                </div>
                                <button type="submit" className="w-full py-5 rounded-2xl bg-purple-gradient font-black text-lg shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-transform">
                                    ACCESS ROOM
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarIcon({ icon, active = false, onClick, className = "", label }: { icon: React.ReactNode, active?: boolean, onClick?: () => void, className?: string, label: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`flex flex-col items-center gap-3 transition-all cursor-pointer group/icon ${active ? "text-purple-400" : "text-gray-600 hover:text-white"}`}
        >
            <div className={`p-5 rounded-[2rem] transition-all duration-500 ${active ? "bg-purple-500/15 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/5"}`}>
                {icon}
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] opacity-40 group-hover/icon:opacity-100 transition-opacity uppercase">{label}</span>
        </motion.div>
    );
}

function RoomCard({ room, onJoin, isOwner, onDelete }: { room: any; onJoin: () => void; isOwner?: boolean; onDelete?: () => void }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] glass-panel border border-white/5 hover:border-purple-500/40 transition-all relative group flex flex-col justify-between min-h-[280px] sm:min-h-[360px] md:min-h-[480px] shadow-3xl overflow-hidden"
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4 sm:mb-6 md:mb-10">
                    <div className="px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl bg-white/5 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-purple-400 border border-white/10">
                        {room.subject}
                    </div>
                    <div className="flex items-center gap-2">
                        {room.isLocked && (
                            <div className="p-2 sm:p-4 rounded-full bg-white/[0.02] border border-white/10">
                                <Lock size={16} className="text-purple-500/50 sm:w-[22px] sm:h-[22px]" />
                            </div>
                        )}
                        {isOwner && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                                className="p-2 sm:p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                                title="Delete Room"
                            >
                                <X size={16} />
                            </motion.button>
                        )}
                    </div>
                </div>
                <h3 className="text-xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-6 italic tracking-tighter leading-tight group-hover:text-white transition-colors uppercase">{room.name}</h3>
                <p className="text-gray-500 text-sm sm:text-lg md:text-xl mb-6 sm:mb-12 font-medium italic">Host: <span className="text-purple-300 not-italic font-black tracking-tight uppercase">{room.admin}</span></p>
            </div>

            <div className="flex items-center justify-between pt-4 sm:pt-6 md:pt-10 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2 sm:gap-4 text-gray-500 font-black text-[10px] sm:text-xs tracking-widest uppercase">
                    <Users size={18} className="text-purple-500/30 sm:w-6 sm:h-6" />
                    <span className="flex flex-col">
                        <span className="text-white text-base sm:text-lg tracking-normal">{room.users}</span>
                        <span className="text-[8px] sm:text-[10px] text-gray-700">ONLINE</span>
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onJoin}
                    className="px-5 sm:px-10 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-black font-black text-[10px] sm:text-xs hover:bg-purple-gradient hover:text-white transition-all uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-xl"
                >
                    Join
                </motion.button>
            </div>
        </motion.div>
    );
}

function ChatView({ chatMode, setChatMode, friends }: { chatMode: ChatMode, setChatMode: (m: ChatMode) => void, friends: any[] }) {
    const [selectedUserForProfile, setSelectedUserForProfile] = useState<any>(null);
    const [selectedFriendForChat, setSelectedFriendForChat] = useState<any>(null);
    const [globalMessages, setGlobalMessages] = useState<any[]>([]);
    const [dmMessages, setDmMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const router = useRouter();

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        const newMsg = {
            id: Date.now(),
            user: "You",
            time: "Just now",
            message: messageInput,
            isMe: true,
            isOnline: true,
            isRead: false
        };
        if (chatMode === "global") setGlobalMessages([...globalMessages, newMsg]);
        else setDmMessages([...dmMessages, newMsg]);
        setMessageInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    useEffect(() => {
        if (chatMode !== "dm") {
            setSelectedFriendForChat(null);
        }
    }, [chatMode]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-[calc(100vh-250px)] flex flex-col glass-panel rounded-[3rem] overflow-hidden border border-white/5 relative"
        >
            <div className="flex border-b border-white/5 bg-white/[0.02]">
                <button
                    onClick={() => setChatMode("global")}
                    className={`flex-1 py-6 font-black uppercase tracking-widest text-[10px] transition-all ${chatMode === "global" ? "text-purple-400 bg-white/5 border-b-2 border-purple-500" : "text-gray-500 hover:text-white"
                        }`}
                >
                    Global Chat
                </button>
                <button
                    onClick={() => setChatMode("dm")}
                    className={`flex-1 py-6 font-black uppercase tracking-widest text-[10px] transition-all ${chatMode === "dm" ? "text-purple-400 bg-white/5 border-b-2 border-purple-500" : "text-gray-500 hover:text-white"
                        }`}
                >
                    Messages
                </button>
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col min-h-0 relative">
                <header className="mb-8 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {chatMode === "dm" && selectedFriendForChat && (
                            <button 
                                onClick={() => setSelectedFriendForChat(null)}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all mr-2"
                            >
                                <ArrowLeft size={24} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">
                                {chatMode === "global" ? "Global Network" : (selectedFriendForChat ? selectedFriendForChat.name : "Friends")}
                            </h2>
                            <p className="text-gray-500 font-medium italic text-sm">
                                {chatMode === "global" && "Synced with everyone in the StudySync community."}
                                {chatMode === "dm" && !selectedFriendForChat && "Select a friend to start chatting."}
                                {chatMode === "dm" && selectedFriendForChat && "End-to-end encrypted private chat."}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 space-y-6 overflow-y-auto mb-8 pr-4 custom-scrollbar">
                    {chatMode === "global" && (
                        <>
                            {globalMessages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-10">
                                    <MessageSquare size={40} className="mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest">No messages yet. Say hello!</p>
                                </div>
                            )}
                            {globalMessages.map(msg => (
                                <ChatMessage key={msg.id} {...msg} onProfileClick={() => {}} />
                            ))}
                        </>
                    )}
                    {chatMode === "dm" && (
                        <>
                            {selectedFriendForChat ? (
                                <>
                                    {dmMessages.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-10">
                                            <MessageSquare size={40} className="mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">Start a conversation with {selectedFriendForChat.name}</p>
                                        </div>
                                    )}
                                    {dmMessages.map(msg => (
                                        <ChatMessage key={msg.id} {...msg} onProfileClick={() => {}} />
                                    ))}
                                </>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {friends.length === 0 && (
                                        <div className="col-span-full py-10 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                                            No friends found. Add some in the Network tab!
                                        </div>
                                    )}
                                    {friends.map(friend => (
                                        <div key={friend.id} onClick={() => setSelectedFriendForChat(friend)} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-purple-500/30 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-gradient text-white flex items-center justify-center font-bold text-lg overflow-hidden border border-white/5">
                                                    {friend.image ? <img src={friend.image} className="w-full h-full object-cover" /> : friend.name?.[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm truncate max-w-[120px] text-white group-hover:text-purple-400 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedUserForProfile(friend); }}>{friend.name}</span>
                                                    <span className="text-[10px] text-purple-400 font-black uppercase">{friend.username ? `@${friend.username}` : ""}</span>
                                                </div>
                                            </div>
                                            <MessageSquare size={16} className="text-gray-500" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {(chatMode === "global" || (chatMode === "dm" && selectedFriendForChat)) && (
                    <div className="relative mt-auto">
                        <input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                chatMode === "global" ? "Message global network..." : `Message ${selectedFriendForChat.name}...`
                            }
                            className="w-full pl-6 pr-16 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all font-bold text-sm"
                        />
                        <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-purple-gradient text-white shadow-lg shadow-purple-500/20 hover:scale-110 transition-transform">
                            <Send size={20} />
                        </button>
                    </div>
                )}
            </div>

            <ProfileModal 
                user={selectedUserForProfile} 
                isOpen={!!selectedUserForProfile} 
                onClose={() => setSelectedUserForProfile(null)} 
                onMessage={
                    selectedUserForProfile ? () => {
                        setSelectedFriendForChat(selectedUserForProfile);
                        setSelectedUserForProfile(null);
                        setChatMode("dm");
                    } : undefined
                }
            />
        </motion.div>
    );
}

function ChatMessage({ user, time, message, isMe, isOnline, isRead, onProfileClick }: any) {
    return (
        <div className={`flex flex-col group/message ${isMe ? "items-end text-right" : "items-start text-left"}`}>
            <div className="flex items-center gap-2 mb-2 cursor-pointer group" onClick={onProfileClick}>
                {!isMe && isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Online" />}
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors ${!isMe ? "text-purple-400 group-hover:text-white" : "text-gray-400"}`}>{user}</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-600">{time}</span>
            </div>
            
            <div className={`relative px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xl flex items-end gap-3 ${isMe ? "bg-purple-gradient text-white rounded-tr-none" : "bg-white/[0.05] border border-white/5 text-gray-200 rounded-tl-none"}`}>
                <span>{message}</span>
                
                {/* Report Message Action */}
                {!isMe && (
                    <button className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all" title="Report message">
                        <Flag size={14} />
                    </button>
                )}
                
                {isMe && (
                    <span className="opacity-70 mb-0.5" title={isRead ? "Read" : "Sent"}>
                        {isRead ? (
                            <CheckCheck size={14} className="text-emerald-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                        ) : (
                            <Check size={14} className="text-gray-300" />
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}

function SettingsView() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl space-y-12"
        >
            <header>
                <h2 className="text-4xl font-black mb-2">Settings</h2>
                <p className="text-gray-500 font-medium italic">Configure your focus environment.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingsCard
                    icon={<Shield size={24} />}
                    title="Privacy & Safety"
                    desc="Manage blockers and room visibility settings."
                />
                <SettingsCard
                    icon={<Bell size={24} />}
                    title="Notifications"
                    desc="Custom sounds for Pomodoro and messages."
                />
                <SettingsCard
                    icon={<Moon size={24} />}
                    title="Theme Engine"
                    desc="Choose between AMOLED dark or Neon purple."
                />
            </div>
        </motion.div>
    );
}

function SettingsCard({ icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-[2.5rem] glass-panel border border-white/5 hover:border-purple-500/20 transition-all group cursor-pointer">
            <div className="p-3 rounded-2xl bg-white/5 w-fit mb-6 text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed italic">{desc}</p>
        </div>
    );
}

export default function LobbyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-black uppercase tracking-widest text-2xl">Loading...</div>}>
            <LobbyContent />
        </Suspense>
    );
}
