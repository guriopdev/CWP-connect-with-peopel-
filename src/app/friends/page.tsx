"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck, UserX, Users, Clock, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

type Tab = "received" | "sent" | "friends";

export default function FriendsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("received");
    const [sent, setSent] = useState<any[]>([]);
    const [received, setReceived] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/auth/login");
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;
        fetchRequests();
    }, [status]);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/friends");
            if (res.ok) {
                const data = await res.json();
                setSent(data.sent);
                setReceived(data.received);
            }
        } catch (err) {
            console.error("Failed to fetch friend requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId: string, action: "accept" | "reject") => {
        try {
            await fetch("/api/friends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, action }),
            });
            fetchRequests();
        } catch (err) {
            console.error("Action failed:", err);
        }
    };

    const acceptedFriends = [
        ...sent.filter(r => r.status === "accepted").map(r => ({ ...r.receiver, requestId: r.id })),
        ...received.filter(r => r.status === "accepted").map(r => ({ ...r.sender, requestId: r.id })),
    ];
    const pendingReceived = received.filter(r => r.status === "pending");
    const pendingSent = sent.filter(r => r.status === "pending");

    return (
        <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
            <Navbar />
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none"><InteractiveBackground /></div>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-20">
                <header className="mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
                        My <span className="hero-gradient-text">Friends</span>
                    </h1>
                    <p className="text-base sm:text-xl text-gray-500 font-medium italic">
                        Manage your friend requests and connections.
                    </p>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 sm:gap-4 mb-10 sm:mb-16 overflow-x-auto no-scrollbar">
                    {([
                        { key: "received", label: "Received", icon: <UserPlus size={16} />, count: pendingReceived.length },
                        { key: "sent", label: "Sent", icon: <Clock size={16} />, count: pendingSent.length },
                        { key: "friends", label: "Friends", icon: <UserCheck size={16} />, count: acceptedFriends.length },
                    ] as const).map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab.key
                                    ? "bg-purple-gradient text-white shadow-lg shadow-purple-500/20"
                                    : "bg-white/[0.03] text-gray-500 border border-white/10 hover:text-white"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px]">{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 text-gray-600 font-bold"
                        >
                            Loading...
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "received" && (
                                <div className="space-y-4 sm:space-y-6">
                                    {pendingReceived.length === 0 ? (
                                        <EmptyState icon={<UserPlus size={48} />} text="No pending requests" />
                                    ) : (
                                        pendingReceived.map((req) => (
                                            <RequestCard
                                                key={req.id}
                                                user={req.sender}
                                                type="received"
                                                onAccept={() => handleAction(req.id, "accept")}
                                                onReject={() => handleAction(req.id, "reject")}
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === "sent" && (
                                <div className="space-y-4 sm:space-y-6">
                                    {pendingSent.length === 0 ? (
                                        <EmptyState icon={<Clock size={48} />} text="No sent requests" />
                                    ) : (
                                        pendingSent.map((req) => (
                                            <RequestCard key={req.id} user={req.receiver} type="sent" />
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === "friends" && (
                                <div className="space-y-4 sm:space-y-6">
                                    {acceptedFriends.length === 0 ? (
                                        <EmptyState icon={<Users size={48} />} text="No friends yet. Join a room and send requests!" />
                                    ) : (
                                        acceptedFriends.map((friend) => (
                                            <RequestCard key={friend.id} user={friend} type="friend" />
                                        ))
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function RequestCard({ user, type, onAccept, onReject }: {
    user: any;
    type: "received" | "sent" | "friend";
    onAccept?: () => void;
    onReject?: () => void;
}) {
    return (
        <motion.div
            layout
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] glass-panel border border-white/5 hover:border-purple-500/20 transition-all"
        >
            <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-gradient flex items-center justify-center text-lg sm:text-xl font-black italic flex-shrink-0">
                    {user.image ? (
                        <img src={user.image} alt="" className="w-full h-full object-cover rounded-xl sm:rounded-2xl" />
                    ) : (
                        user.name?.[0] || "?"
                    )}
                </div>
                <div>
                    <p className="font-black text-sm sm:text-lg">{user.name || "User"}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold">
                        {user.username ? `@${user.username}` : user.email || ""}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
                {type === "received" && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAccept}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-purple-gradient text-white font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg"
                        >
                            <Check size={14} /> Accept
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onReject}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] sm:text-xs uppercase tracking-widest border border-white/10"
                        >
                            <X size={14} /> Decline
                        </motion.button>
                    </>
                )}
                {type === "sent" && (
                    <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/5 text-yellow-400/70 font-black text-[10px] sm:text-xs uppercase tracking-widest border border-white/10">
                        Pending
                    </span>
                )}
                {type === "friend" && (
                    <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-[10px] sm:text-xs uppercase tracking-widest border border-emerald-500/20">
                        <UserCheck size={14} className="inline mr-2" /> Friends
                    </span>
                )}
            </div>
        </motion.div>
    );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="py-20 sm:py-32 flex flex-col items-center justify-center text-gray-700">
            <div className="mb-6 opacity-30">{icon}</div>
            <p className="font-black text-xs sm:text-sm uppercase tracking-widest text-center">{text}</p>
        </div>
    );
}
