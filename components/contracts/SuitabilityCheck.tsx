"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuitabilityItem {
    question: string;
    answer: boolean;
}

interface SuitabilityCheckProps {
    items: SuitabilityItem[];
}

export function SuitabilityCheck({ items }: SuitabilityCheckProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [answers, setAnswers] = useState<boolean[]>(new Array(items.length).fill(false));
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (index: number, val: boolean) => {
        const newAnswers = [...answers];
        newAnswers[index] = val;
        setAnswers(newAnswers);
    };

    const calculateResult = () => {
        const allYes = answers.every(a => a === true);
        setShowResult(true);
    };

    const isAllYes = answers.every(a => a === true);

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-100/50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm shadow-blue-500/30">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Bu Sözleşme Bana Uygun Mu?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">3 kısa soruda uygunluk kontrolü yapın.</p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {isOpen && (
                <div className="p-6 pt-0 space-y-6 animate-in slide-in-from-top-2">
                    <div className="space-y-4">
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm flex-1 mr-4">{item.question}</span>
                                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 shrink-0">
                                    <button
                                        onClick={() => handleAnswer(i, true)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                                            answers[i] ? "bg-green-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        )}
                                    >
                                        EVET
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(i, false)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                                            !answers[i] ? "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" : "bg-red-500 text-white shadow-sm"
                                        )}
                                    >
                                        HAYIR
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!showResult ? (
                        <button
                            onClick={calculateResult}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Sonucu Gör
                        </button>
                    ) : (
                        <div className={cn(
                            "rounded-xl p-4 flex items-start gap-3 border animate-in zoom-in-95",
                            isAllYes
                                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300"
                                : "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900 dark:text-amber-300"
                        )}>
                            {isAllYes ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold mb-1">Mükemmel! Bu sözleşme tam size göre.</h4>
                                        <p className="text-sm opacity-90">İhtiyacınız olan tüm hukuki korumaları içeriyor. Güvenle kullanabilirsiniz.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold mb-1">DikkatEdin!</h4>
                                        <p className="text-sm opacity-90">Cevaplarınızdan bazıları bu sözleşme türüyle tam örtüşmüyor olabilir. Yine de temel koruma sağlar ancak bir avukata danışmanızda fayda olabilir.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
