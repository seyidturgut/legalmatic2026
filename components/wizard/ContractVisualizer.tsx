
"use client";

import { motion } from "framer-motion";
import { Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractVisualizerProps {
    title: string;
    answers: Record<string, any>;
    currentQuestionId?: string;
    schema: any[];
}

export function ContractVisualizer({ title, answers, currentQuestionId, schema }: ContractVisualizerProps) {
    // Determine which field is active to highlight it in the doc (simulated)
    // In a real app, this would map question IDs to specific variable placeholders in the HTML.
    // For this visualizer, we will render a list of "Clauses" based on the answers provided so far.

    return (
        <div className="w-full h-full flex items-center justify-center p-2 lg:p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 rounded-lg p-6 lg:p-8 h-[calc(100vh-140px)] flex flex-col border border-slate-200 dark:border-slate-800 transition-all duration-500 overflow-hidden">
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-tighter">{title}</h2>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">No: 2025/CUSTOM</p>
                    </div>
                    <div className="w-8 h-8 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

                {/* Scrollable Content Simulation */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Gradient Overlay for Top/Bottom Fade */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                    <div className="h-full overflow-y-auto pr-2 space-y-4 no-scrollbar pb-12 pt-4">
                        {/* Placeholder intro text */}
                        <div className="space-y-1.5 opacity-30 blur-[0.5px] mb-6">
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        </div>

                        {/* Dynamic Clauses */}
                        <div className="space-y-2 font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {schema.map((q, i) => ({ ...q, originalIndex: i })).slice(
                                Math.floor((schema.findIndex(q => q.id === currentQuestionId) !== -1 ? schema.findIndex(q => q.id === currentQuestionId) : 0) / 3) * 3,
                                (Math.floor((schema.findIndex(q => q.id === currentQuestionId) !== -1 ? schema.findIndex(q => q.id === currentQuestionId) : 0) / 3) * 3) + 3
                            ).map((q) => {
                                const answer = answers[q.id];
                                const isActive = q.id === currentQuestionId;

                                return (
                                    <motion.div
                                        layout
                                        id={`clause-${q.id}`} // Scroll Target
                                        key={q.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: isActive ? 1.0 : 0.98,
                                        }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className={cn(
                                            "p-4 rounded-xl border transition-all duration-300",
                                            isActive
                                                ? "bg-white dark:bg-slate-900 border-[#ec7b1f] shadow-lg shadow-orange-500/5 z-10"
                                                : "bg-slate-50/50 dark:bg-slate-900/50 border-transparent opacity-60 grayscale-[0.5]"
                                        )}
                                    >
                                        <h4 className={cn(
                                            "font-bold text-[10px] uppercase mb-2 tracking-widest flex items-center justify-between",
                                            isActive ? "text-[#ec7b1f]" : "text-slate-400"
                                        )}>
                                            <span>Madde {q.originalIndex + 1}</span>
                                            {isActive && <span className="flex h-1.5 w-1.5 rounded-full bg-[#ec7b1f] animate-pulse" />}
                                        </h4>
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                                                {q.label}
                                            </p>
                                            <div className={cn(
                                                "min-h-[2em] text-lg leading-relaxed break-words",
                                                isActive ? "text-slate-900 dark:text-white font-medium" : "text-slate-600 dark:text-slate-500"
                                            )}>
                                                {answer ? (
                                                    <span className="bg-orange-100/30 dark:bg-orange-900/20 px-1 -mx-1 rounded box-decoration-clone">
                                                        {String(answer)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-700 italic">
                                                        (Bekleniyor...)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Placeholder footer text */}
                        <div className="space-y-1.5 opacity-30 blur-[0.5px] mt-6">
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
                        </div>

                        {/* Signature Block Simulation */}
                        <div className="flex justify-between opacity-30 mt-8">
                            <div className="w-1/3 h-8 border-b border-slate-400"></div>
                            <div className="w-1/3 h-8 border-b border-slate-400"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
