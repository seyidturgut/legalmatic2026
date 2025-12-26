
"use client";

import { RiskAnalysisResult } from "@/lib/mockAnalysisService";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface RiskReportProps {
    result: RiskAnalysisResult;
}

export function RiskReport({ result }: RiskReportProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getScoreProgressColor = (score: number) => {
        if (score >= 80) return "bg-green-600";
        if (score >= 50) return "bg-yellow-500";
        return "bg-red-600";
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">

                    {/* Score Circle */}
                    <div className="relative flex-shrink-0">
                        <div className="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
                            <div className="text-center">
                                <div className={cn("text-5xl font-extrabold", getScoreColor(result.score))}>
                                    {result.score}
                                </div>
                                <div className="text-xs uppercase font-bold text-slate-400 mt-1">Güven Puanı</div>
                            </div>
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    className="text-slate-100 dark:text-slate-800 stroke-current"
                                    strokeWidth="8"
                                    cx="50"
                                    cy="50"
                                    r="46"
                                    fill="transparent"
                                />
                                <circle
                                    className={cn("stroke-current transition-all duration-1000 ease-out", getScoreColor(result.score))}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    cx="50"
                                    cy="50"
                                    r="46"
                                    fill="transparent"
                                    strokeDasharray="289.02652413026095"
                                    strokeDashoffset={289.02652413026095 - (result.score / 100) * 289.02652413026095}
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analiz Özeti</h2>
                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                            {result.summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Risks */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white px-2">Tespit Edilen Riskler ve Öneriler</h3>

                {result.risks.map((risk, index) => (
                    <motion.div
                        key={risk.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className={cn(
                            "rounded-xl p-6 border-l-4 shadow-sm bg-white dark:bg-slate-900",
                            risk.severity === 'high' ? "border-red-500" :
                                risk.severity === 'medium' ? "border-yellow-500" : "border-blue-500"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                {risk.severity === 'high' && <AlertTriangle className="w-6 h-6 text-red-500" />}
                                {risk.severity === 'medium' && <Info className="w-6 h-6 text-yellow-500" />}
                                {risk.severity === 'low' && <Info className="w-6 h-6 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                        risk.severity === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                            risk.severity === 'medium' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    )}>
                                        {risk.severity === 'high' ? "Yüksek Risk" : risk.severity === 'medium' ? "Orta Risk" : "Düşük Risk"}
                                    </span>
                                </div>

                                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 font-serif italic text-slate-600 dark:text-slate-400 text-sm">
                                    "{risk.clause}"
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Sorun Nedir?</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{risk.issue}</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20">
                                        <h4 className="text-sm font-bold text-green-800 dark:text-green-400 mb-1 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> AI Önerisi
                                        </h4>
                                        <p className="text-sm text-green-700 dark:text-green-300">{risk.suggestion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
}
