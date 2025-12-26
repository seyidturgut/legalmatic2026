
"use client";

import { motion } from "framer-motion";

const companies = [
    "TechStart", "GlobalLaw", "InnovateCorp", "FutureHoldings", "SmartSolutions", "LegalEagle"
];

export function CompanyLogos() {
    return (
        <div className="py-12 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-slate-500 mb-8 uppercase tracking-widest">
                    1.500+ Şirket ve Hukuk Bürosu Bize Güveniyor
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Text Logos using font styles to look like logos */}
                    {companies.map((company, index) => (
                        <span key={index} className="text-xl md:text-2xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-default select-none font-serif italic">
                            {company}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
