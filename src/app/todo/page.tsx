"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, CheckCircle2, Circle,
    Calendar, ListTodo, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Task {
    id: number;
    text: string;
    completed: boolean;
    category?: string;
}

export default function TodoPage() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, text: "Finish Chemistry Lab Report", completed: false, category: "Study" },
        { id: 2, text: "Revise React Hooks", completed: true, category: "Coding" },
        { id: 3, text: "Buy focus music subscription", completed: false, category: "General" },
    ]);
    const [newTask, setNewTask] = useState("");

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const task: Task = {
            id: Date.now(),
            text: newTask,
            completed: false,
            category: "Personal"
        };
        setTasks([task, ...tasks]);
        setNewTask("");
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pt-52 pb-32 px-6 overflow-x-hidden">
            <Navbar />

            {/* High-Performance Background System */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden text-white/5">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/[0.04] rounded-full blur-[180px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.03] rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="z-10 w-full max-w-5xl glass-panel border border-white/5 rounded-[4.5rem] p-16 md:p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2.5 bg-purple-gradient shadow-[0_0_30px_rgba(168,85,247,0.4)]" />

                <header className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-12">
                    <div className="flex items-center gap-10">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="p-8 rounded-[2.5rem] bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-2xl shadow-purple-500/10"
                        >
                            <ListTodo size={48} />
                        </motion.div>
                        <div>
                            <h1 className="text-6xl md:text-[5rem] font-black italic tracking-tighter uppercase mb-5">To-Do <br /><span className="text-purple-500">List</span></h1>
                            <p className="text-2xl text-gray-500 font-medium italic border-l-2 border-purple-500/30 pl-8 ml-2">Personal tasks for the currently synced session.</p>
                        </div>
                    </div>
                    <div className="px-8 py-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-[11px] font-black text-purple-400 tracking-[0.3em] uppercase">
                        {tasks.filter(t => t.completed).length} DONE TASKS
                    </div>
                </header>

                {/* Tactical Input Control */}
                <form onSubmit={addTask} className="relative mb-24 group flex items-center gap-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700 pointer-events-none" />
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="ADD NEW TASK..."
                        className="relative flex-1 pl-12 pr-12 py-9 rounded-[2.5rem] bg-white/[0.03] border border-white/10 focus:border-purple-500/40 focus:outline-none transition-all text-3xl font-black italic uppercase placeholder:text-gray-900 tracking-tight"
                    />
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90, boxShadow: "0 0 40px rgba(168,85,247,0.5)" }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="relative p-10 rounded-[2rem] bg-purple-gradient text-white shadow-3xl flex-shrink-0 flex items-center justify-center border border-purple-400/20"
                    >
                        <Plus size={40} />
                    </motion.button>
                </form>

                {/* Objective Command Stream */}
                <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, scale: 0.95, x: -30 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                layout
                                className={`group flex items-center justify-between p-12 rounded-[3rem] border transition-all duration-700 ${task.completed
                                    ? "bg-white/[0.01] border-white/5 grayscale opacity-20"
                                    : "bg-white/[0.03] border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]"
                                    }`}
                            >
                                <div className="flex items-center gap-10 flex-1">
                                    <motion.button
                                        whileTap={{ scale: 0.7 }}
                                        onClick={() => toggleTask(task.id)}
                                        className={`transition-all duration-700 ${task.completed ? "text-purple-500" : "text-gray-800 group-hover:text-purple-400"}`}
                                    >
                                        {task.completed ? <CheckCircle2 size={44} /> : <Circle size={44} />}
                                    </motion.button>
                                    <span className={`text-3xl font-black italic uppercase tracking-tight transition-all duration-700 ${task.completed ? "line-through text-gray-800" : "text-white"}`}>
                                        {task.text}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.3, color: "#ef4444" }}
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-4 text-gray-800 transition-all ml-6"
                                >
                                    <Trash2 size={28} />
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {tasks.length === 0 && (
                        <div className="py-40 text-center">
                            <motion.div
                                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-12 text-gray-900 border-2 border-dashed border-white/5"
                            >
                                <Calendar size={64} />
                            </motion.div>
                            <p className="text-3xl text-gray-800 font-black italic uppercase tracking-[0.4em]">Ready for tasks...</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
