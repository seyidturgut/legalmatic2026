
"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FileUploader } from "@/components/analysis/FileUploader";
import { AnalysisProcessing } from "@/components/analysis/AnalysisProcessing";
import { RiskReport } from "@/components/analysis/RiskReport";
import { mockAnalyzeContract, RiskAnalysisResult } from "@/lib/mockAnalysisService";

export default function AIAnalysisPage() {
    const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
    const [result, setResult] = useState<RiskAnalysisResult | null>(null);

    const handleFileSelect = async (file: File) => {
        setStatus('processing');
        try {
            const analysisResult = await mockAnalyzeContract(file);
            setResult(analysisResult);
            setStatus('completed');
        } catch (error) {
            console.error("Analiz hatası:", error);
            setStatus('idle'); // Hata durumunda başa dön
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <main className="min-h-screen bg-[#fcfbf9] dark:bg-slate-950 font-sans">
            <Navbar />

            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-950/20 pointer-events-none -z-10" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#ec7b1f] font-semibold text-sm mb-4">
                            Beta • Ücretsiz
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
                            Yapay Zeka ile <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec7b1f] to-[#b45309]">Sözleşme Risk Analizi</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Sözleşmenizi yükleyin, AI robotumuz saniyeler içinde potansiyel riskleri, gizli maddeleri ve sizin aleyhinize olabilecek durumları raporlasın.
                        </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        {status === 'idle' && (
                            <FileUploader onFileSelect={handleFileSelect} />
                        )}

                        {status === 'processing' && (
                            <AnalysisProcessing />
                        )}

                        {status === 'completed' && result && (
                            <RiskReport result={result} />
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
