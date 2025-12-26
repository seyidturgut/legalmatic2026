
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-900 mb-8 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                        Professional Legal Tech
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                        Create lawyer-approved contracts in minutes
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Answer simple questions and get professional, legally binding documents generated instantly. Secure, fast, and compliant.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 bg-[#0F172A] hover:bg-[#0F172A]/90 text-white text-base w-full sm:w-auto">
                            <Link href="/sozlesmeler">
                                Start Creating Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                            <Link href="/sozlesmeler">View Sample Contracts</Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Lawyer Approved</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Bank-level Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Instant Download</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
}
