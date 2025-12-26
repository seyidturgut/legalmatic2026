
import { FileText, Check, Shield, Download } from "lucide-react";

export function HeroInterfaceMockup() {
    return (
        <div className="relative rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 bg-white/40 backdrop-blur-md dark:bg-slate-800/40 dark:ring-white/10 shadow-2xl animate-float">
            <div className="rounded-md shadow-2xl ring-1 ring-slate-900/10 bg-white dark:bg-slate-950 overflow-hidden relative">
                {/* Mockup Header - Browser styling */}
                <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="mx-auto bg-slate-200 dark:bg-slate-800 rounded-md px-3 py-1 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        legalmatic.com/olustur/kira-sozlesmesi
                    </div>
                </div>

                {/* Mockup Body - Split Layout */}
                <div className="flex flex-col md:flex-row h-[400px] md:h-[500px]">

                    {/* Left Sidebar: Steps & Form */}
                    <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Ev Kira Sözleşmesi</h3>
                            <p className="text-xs text-slate-500">Adım 2/3: Taraf Bilgileri</p>
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-[#ec7b1f] w-2/3 rounded-full" />
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 overflow-hidden relative">
                            {/* Abstract Form Fields */}
                            <div className="space-y-1">
                                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="h-9 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm" />
                            </div>
                            <div className="space-y-1">
                                <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="h-9 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm" />
                            </div>
                            <div className="space-y-1">
                                <div className="h-3 w-2/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-9 w-1/2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md flex items-center justify-center text-xs font-medium text-[#ec7b1f] dark:text-orange-300">Evet</div>
                                    <div className="h-9 w-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md" />
                                </div>
                            </div>

                            {/* Floating Tooltip hint */}
                            <div className="absolute top-20 right-0 translate-x-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-bounce">
                                Otomatik Dolduruldu ✨
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="h-10 w-full bg-[#ec7b1f] hover:bg-[#d65d0a] rounded-lg shadow-lg flex items-center justify-center text-white text-sm font-medium hover:scale-105 transition-transform cursor-pointer shadow-orange-500/20">
                                Devam Et
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Document Preview */}
                    <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                        {/* The Document Paper */}
                        <div className="w-full max-w-[400px] bg-white text-slate-800 shadow-2xl rounded-sm min-h-[400px] p-6 text-[8px] md:text-[10px] leading-relaxed relative hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-100 to-transparent opacity-50 pointer-events-none" />

                            <div className="flex justify-between items-end mb-6 border-b pb-2">
                                <h1 className="font-bold text-lg">KİRA SÖZLEŞMESİ</h1>
                                <span className="font-mono text-[8px] text-slate-400">No: 2024/001</span>
                            </div>

                            <div className="space-y-2 opacity-70">
                                <div className="h-2 bg-slate-100 w-full rounded" />
                                <div className="h-2 bg-slate-100 w-11/12 rounded" />
                                <div className="h-2 bg-slate-100 w-full rounded" />
                            </div>

                            {/* Highlighted Dynamic Section */}
                            <div className="my-4 p-2 bg-orange-50/50 border border-orange-100 rounded relative">
                                <div className="absolute -left-3 top-2 w-1.5 h-1.5 bg-[#ec7b1f] rounded-full" />
                                <p className="font-semibold text-orange-900">Madde 3 - Kira Bedeli</p>
                                <p className="mt-1">Aylık kira bedeli <span className="bg-yellow-100 px-1 font-bold text-slate-900">25.000 TL</span> olarak belirlenmiştir. Ödemeler her ayın ilk 5 günü içinde yapılacaktır.</p>
                            </div>

                            <div className="space-y-2 opacity-70">
                                <div className="h-2 bg-slate-100 w-full rounded" />
                                <div className="h-2 bg-slate-100 w-10/12 rounded" />
                                <div className="h-2 bg-slate-100 w-full rounded" />
                                <div className="h-2 bg-slate-100 w-9/12 rounded" />
                            </div>
                        </div>

                        {/* Floating "Ready" Card */}
                        <div className="absolute bottom-8 right-8 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-bounce">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">Hazır!</p>
                                <p className="text-[10px] text-slate-500">İndirilmeye hazır.</p>
                            </div>
                            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center ml-2">
                                <Download className="w-4 h-4 text-slate-500" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ec7b1f] to-[#b45309] rounded-2xl blur opacity-20 transition duration-1000 group-hover:opacity-30 -z-10" />
        </div>
    );
}
