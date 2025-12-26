
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { HeroSlider } from "./HeroSlider";
import { HeroSearch } from "./HeroSearch";

export function Hero() {
    return (
        <div className="relative isolate pt-24 dark:bg-slate-900 overflow-hidden min-h-screen bg-noise">
            {/* Abstract Background Gradient - Animated Blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Main Warm Gradient Mesh */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-orange-200/40 via-amber-100/40 to-transparent blur-3xl opacity-60 animate-blob" />
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-red-200/30 via-orange-100/30 to-transparent blur-3xl opacity-50 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-gradient-to-t from-orange-100/40 via-amber-50/20 to-transparent blur-3xl opacity-40 animate-blob animation-delay-4000" />
            </div>

            <div className="py-20 sm:py-24 lg:pb-32 relative">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    {/* Hero Split Layout */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                        {/* Left Column: Content */}
                        <div className="text-left animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            {/* Badge */}
                            <div className="mb-6 flex justify-start">
                                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20 dark:text-slate-300 dark:ring-white/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
                                    <span className="font-semibold text-[#ec7b1f] dark:text-[#ec7b1f] mr-1">Yeni</span> Yapay Zeka Modülü Yayında <Link href="/sozlesmeler" className="font-semibold text-[#ec7b1f] dark:text-[#ec7b1f] ml-1 group"><span className="absolute inset-0" aria-hidden="true" />Keşfet <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform inline-block">&rarr;</span></Link>
                                </div>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white leading-tight mb-6">
                                Sözleşme Hazırlamanın <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec7b1f] via-[#f59e0b] to-[#b45309] animate-gradient-x">Yeni Standardı</span>
                            </h1>

                            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-lg mb-6">
                                Karmaşık hukuk süreçleriyle vakit kaybetmeyin. İhtiyacınız olan sözleşmeyi seçin, akıllı sihirbazla özelleştirin ve uzman avukat kalitesindeki belgenizi dakikalar içinde indirin.
                            </p>

                            <HeroSearch />

                            <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
                                <Button asChild size="lg" className="h-14 px-8 text-lg bg-[#ec7b1f] hover:bg-[#d65d0a] shadow-xl shadow-orange-500/20 transition-all hover:scale-105 hover:shadow-orange-500/40 rounded-full w-full sm:w-auto">
                                    <Link href="/sozlesmeler">
                                        Sözleşme Oluştur <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg hover:bg-slate-50 dark:hover:bg-slate-800 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 rounded-full border-slate-300 dark:border-slate-700 w-full sm:w-auto">
                                    <Link href="#nasil-calisir">
                                        Detaylı Bilgi
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 flex items-center justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                    <span>%100 Güvenli</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                                    <CheckCircle2 className="h-5 w-5 text-[#ec7b1f]" />
                                    <span>Avukat Onaylı</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Visual (Slider) */}
                        <div className="relative z-10 lg:ml-auto w-full max-w-[640px] animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            <HeroSlider />
                            {/* Decorative glow behind slider */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-3xl -z-10 opacity-60"></div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
