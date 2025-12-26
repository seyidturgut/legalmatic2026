
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Check, Shield, Download, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";

interface SlideData {
    id: number;
    title: string;
    step: string;
    progress: number;
    filled: boolean;
    contractNo: string;
    contentTitle: string;
    contentPrice: string;
}

const slides: SlideData[] = [
    {
        id: 1,
        title: "Ev Kira Sözleşmesi",
        step: "Adım 2/3: Taraf Bilgileri",
        progress: 66,
        filled: true,
        contractNo: "2024/001",
        contentTitle: "Madde 3 - Kira Bedeli",
        contentPrice: "25.000 TL"
    },
    {
        id: 2,
        title: "Araç Satış Sözleşmesi",
        step: "Adım 3/3: Ödeme Bilgileri",
        progress: 90,
        filled: false,
        contractNo: "2024/052",
        contentTitle: "Madde 5 - Satış Bedeli",
        contentPrice: "1.250.000 TL"
    },
    {
        id: 3,
        title: "Gizlilik Sözleşmesi (NDA)",
        step: "Adım 1/3: Kapsam",
        progress: 33,
        filled: true,
        contractNo: "2024/104",
        contentTitle: "Madde 2 - Gizli Bilgi",
        contentPrice: "Ticari Sırlar"
    }
];

export function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[currentIndex];

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full max-w-7xl mx-auto perspective-1000">

            {/* Navigation Buttons (Floating) */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-600 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hidden md:flex">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-600 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hidden md:flex">
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Main Mockup Container - Animate Presence for transitions */}
            <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:rounded-3xl lg:p-4 bg-white/40 backdrop-blur-xl dark:bg-slate-800/40 dark:ring-white/10 shadow-2xl overflow-hidden min-h-[500px] md:min-h-[550px] flex flex-col transition-all duration-500 hover:shadow-orange-500/10 dark:hover:shadow-orange-900/10">

                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 dark:from-slate-800/30 dark:to-transparent pointer-events-none" />

                <div className="rounded-xl shadow-2xl ring-1 ring-slate-900/10 bg-white dark:bg-slate-950 overflow-hidden relative flex-1 flex flex-col z-10">
                    {/* Mockup Header */}
                    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-800 rounded-md px-3 py-1 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            legalmatic.com/olustur/sihirbaz
                        </div>
                        <div className="w-10" /> {/* Spacer */}
                    </div>

                    {/* Content Area with Animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="flex flex-col md:flex-row h-full"
                        >
                            {/* Left Sidebar: Form Interaction */}
                            <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-center">
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#ec7b1f] transition-colors">{slide.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{slide.step}</p>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${slide.progress}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            className="h-full bg-[#ec7b1f] rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                        <div className="h-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                        <div className="flex gap-2">
                                            <div className="h-10 w-1/2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center justify-center text-sm font-semibold text-[#ec7b1f] dark:text-orange-300 ring-2 ring-orange-500/20">Evet</div>
                                            <div className="h-10 w-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg opacity-50" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    <div className="text-[10px] text-slate-400">Son Güncelleme: <br /> Şimdi</div>
                                    <div className="h-10 px-6 bg-[#ec7b1f] hover:bg-[#d65d0a] rounded-lg shadow-lg shadow-orange-500/20 flex items-center justify-center text-white text-sm font-semibold cursor-pointer transition-transform active:scale-95">
                                        Sonraki <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Content: Document Preview */}
                            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 md:p-10 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                {/* Document Paper */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="w-full max-w-[420px] bg-white text-slate-800 shadow-2xl rounded-sm min-h-[420px] p-8 text-xs leading-relaxed relative hover:scale-[1.02] transition-transform duration-500 border border-slate-200/50"
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-100/50 to-transparent pointer-events-none" />

                                    <div className="flex justify-between items-end mb-8 border-b pb-4">
                                        <h1 className="font-bold text-xl tracking-tight uppercase text-slate-900">{slide.title}</h1>
                                        <span className="font-mono text-[9px] text-slate-400">No: {slide.contractNo}</span>
                                    </div>

                                    <div className="space-y-3 opacity-60 mb-6">
                                        <div className="h-2 bg-slate-100 w-full rounded" />
                                        <div className="h-2 bg-slate-100 w-11/12 rounded" />
                                        <div className="h-2 bg-slate-100 w-full rounded" />
                                    </div>

                                    {/* Dynamic Highlighted Block */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="my-6 p-4 bg-orange-50/50 border border-orange-100 rounded-lg relative"
                                    >
                                        <div className="absolute -left-3 top-4 w-1.5 h-1.5 bg-[#ec7b1f] rounded-full animate-pulse" />
                                        <p className="font-bold text-orange-900 text-sm mb-1">{slide.contentTitle}</p>
                                        <p className="text-slate-700">
                                            Taraflar, işbu sözleşme konusu için <span className="bg-yellow-100 px-1 font-bold text-slate-900 mx-1 rounded shadow-sm">{slide.contentPrice}</span> bedel üzerinde anlaşmışlardır.
                                        </p>
                                    </motion.div>

                                    <div className="space-y-3 opacity-60">
                                        <div className="h-2 bg-slate-100 w-full rounded" />
                                        <div className="h-2 bg-slate-100 w-10/12 rounded" />
                                        <div className="h-2 bg-slate-100 w-full rounded" />
                                    </div>

                                    {/* Paper Signature / Footer */}
                                    <div className="absolute bottom-8 left-8 right-8 flex justify-between pt-4 border-t border-slate-100">
                                        <div className="w-16 h-8 bg-slate-50 border-b border-slate-300" />
                                        <div className="w-16 h-8 bg-slate-50 border-b border-slate-300" />
                                    </div>
                                </motion.div>

                                {/* Floating Ready Badge */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.6, type: "spring" }}
                                    className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20"
                                >
                                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Hazır!</p>
                                        <p className="text-[10px] text-slate-500">İndirilebilir.</p>
                                    </div>
                                </motion.div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots Navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 md:hidden">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentIndex ? 'bg-[#ec7b1f] w-4' : 'bg-slate-300'}`}
                        />
                    ))}
                </div>

                {/* Decorative Glow Behind */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ec7b1f] to-[#b45309] rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000 -z-10" />
            </div>
        </div>
    );
}
