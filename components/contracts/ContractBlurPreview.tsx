"use client";

import { Lock } from "lucide-react";

interface ContractBlurPreviewProps {
    title: string;
}

export function ContractBlurPreview({ title }: ContractBlurPreviewProps) {
    return (
        <div className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300">
            {/* Header / Toolbar Mockup */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                    ÖNİZLEME
                </div>
            </div>

            {/* Document Body */}
            <div className="p-4 md:p-6 relative min-h-[200px] md:min-h-[300px]">
                {/* Readable Header */}
                <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2 uppercase tracking-wide">{title}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 font-serif italic">Bu Sözleşme .../.../20.. Tarihinde Düzenlenmiştir</p>
                </div>

                {/* Readable Intro Paragraph */}
                <div className="space-y-3 md:space-y-4 font-serif text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify mb-3 md:mb-4">
                    <p>
                        <strong>TARAFLAR:</strong> İşbu sözleşme, bir tarafta hizmet alan (bundan sonra "İŞVEREN" olarak anılacaktır) ile diğer tarafta hizmet veren (bundan sonra "YÜKLENİCİ" olarak anılacaktır) arasında...
                    </p>
                    <p className="hidden md:block">
                        <strong>SÖZLEŞMENİN KONUSU:</strong> İşbu sözleşmenin konusu, İŞVEREN'in talebi doğrultusunda YÜKLENİCİ tarafından sağlanacak olan profesyonel hizmetlerin kapsamını...
                    </p>
                </div>

                {/* Blurred Content */}
                <div className="space-y-4 font-serif text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify opacity-50 blur-[3px] select-none pointer-events-none">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p className="hidden md:block">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <p className="hidden md:block">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                    </p>
                    <p className="hidden md:block">
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui.
                    </p>
                    <p className="hidden md:block">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 dark:to-transparent flex flex-col items-center justify-center text-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-full p-3 md:p-4 shadow-xl border border-slate-100 dark:border-slate-800 mb-3 animate-in zoom-in spin-in-3 duration-500">
                        <Lock className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 md:mb-2">Sözleşmenin Tamamını İnceleyin</h4>
                    <p className="text-xs md:text-sm text-slate-500 max-w-[250px] mx-auto hidden md:block">
                        Sözleşmeyi satın alarak tüm maddeleri görüntüleyebilir, Word formatında indirebilir ve düzenleyebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
