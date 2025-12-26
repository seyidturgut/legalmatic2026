
"use client";

import { motion } from "framer-motion";
import { Search, FileText, ShieldAlert, CheckCircle } from "lucide-react";

export function AnalysisProcessing() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">

            {/* Animated Scanner Visual */}
            <div className="relative w-24 h-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl mb-12 overflow-hidden">
                <div className="absolute top-4 left-4 right-4 space-y-2 opacity-30">
                    <div className="h-1 bg-slate-400 rounded w-full" />
                    <div className="h-1 bg-slate-400 rounded w-5/6" />
                    <div className="h-1 bg-slate-400 rounded w-full" />
                    <div className="h-1 bg-slate-400 rounded w-4/6" />
                </div>

                {/* Scanning Beam */}
                <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-[#ec7b1f] shadow-[0_0_20px_#ec7b1f] z-10"
                />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Yapay Zeka Sözleşmenizi İnceliyor...
            </h2>

            <div className="space-y-4 max-w-sm mx-auto">
                <StepItem text="Dosya taranıyor ve metne dönüştürülüyor" delay={0} />
                <StepItem text="Hukuki risk maddeleri tespit ediliyor" delay={1.2} />
                <StepItem text="Emsal Yargıtay kararlarıyla karşılaştırılıyor" delay={2.4} />
            </div>

        </div>
    );
}

function StepItem({ text, delay }: { text: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
        >
            <div className="w-5 h-5 rounded-full border-2 border-[#ec7b1f] border-t-transparent animate-spin" />
            <span>{text}</span>
        </motion.div>
    );
}
