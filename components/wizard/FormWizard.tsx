"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FormSchema, Question } from "@/types/wizard";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2, Lock, Save, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ContractVisualizer } from "./ContractVisualizer";
import { cn } from "@/lib/utils";

interface FormWizardProps {
    schema: FormSchema;
    productTitle: string;
    productPrice: number;
    productSlug: string;
    productId: string;
}

export default function FormWizard({ schema, productTitle, productPrice, productSlug, productId }: FormWizardProps) {
    const { data: session } = useSession();
    const router = useRouter();

    // Core State
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isCompleted, setIsCompleted] = useState(false);

    // Draft State
    const [isDraftLoading, setIsDraftLoading] = useState(true);
    const [foundDraft, setFoundDraft] = useState<any>(null);
    const [showDraftDialog, setShowDraftDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Payment & Generation State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [isGenerating, setIsGenerating] = useState(false);

    // Guest & Security Logic
    const GUEST_STEP_LIMIT = 2; // Allow 3 steps (0, 1, 2)
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    // Refs
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // --- EFFECTS ---

    // Load guest draft on mount if not logged in
    useEffect(() => {
        if (!session && !foundDraft) {
            const localDraft = localStorage.getItem(`guest_draft_${productId}`);
            if (localDraft) {
                try {
                    const parsed = JSON.parse(localDraft);
                    setAnswers(parsed.answers || {});
                    setCurrentStep(parsed.currentStep || 0);
                } catch (e) {
                    console.error("Failed to parse guest draft", e);
                }
            }
        }
    }, [session, foundDraft, productId]);

    // Save guest progress to local storage
    useEffect(() => {
        if (!session) {
            localStorage.setItem(`guest_draft_${productId}`, JSON.stringify({
                answers,
                currentStep,
                updatedAt: new Date().toISOString()
            }));
        }
    }, [answers, currentStep, session, productId]);

    // Check for existing draft on mount (Server)
    useEffect(() => {
        const checkDraft = async () => {
            if (!session?.user?.email || !productId) {
                setIsDraftLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/drafts?productId=${productId}`);
                const data = await res.json();

                if (data.draft) {
                    setFoundDraft(data.draft);
                    setShowDraftDialog(true);
                }
            } catch (error) {
                console.error("Draft check failed:", error);
            } finally {
                setIsDraftLoading(false);
            }
        };

        checkDraft();
    }, [session, productId]);

    // Auto-Save Logic (Debounced)
    useEffect(() => {
        if (!session?.user?.email || isDraftLoading || isCompleted) return;

        // Don't save if empty or initial load
        if (Object.keys(answers).length === 0 && currentStep === 0) return;

        const timer = setTimeout(async () => {
            setIsSaving(true);
            try {
                await fetch('/api/drafts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId,
                        answers,
                        currentStep
                    })
                });
                setLastSaved(new Date());
            } catch (error) {
                console.error("Auto-save failed:", error);
            } finally {
                setIsSaving(false);
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [answers, currentStep, session, productId, isDraftLoading, isCompleted]);


    // --- HELPERS ---

    // Filter questions based on conditional logic
    const visibleQuestions = schema.filter((q) => {
        if (!q.showIf) return true;
        const { field, operator, value } = q.showIf;
        const targetValue = answers[field];

        if (operator === 'equals') return targetValue === value;
        if (operator === 'not_equals') return targetValue !== value;
        return true;
    });

    const totalSteps = visibleQuestions.length;
    const currentQuestion = visibleQuestions[currentStep];
    const progress = Math.min(((currentStep + 1) / totalSteps) * 100, 100);

    // Auto-scroll logic matching the visualizer IDs
    useEffect(() => {
        if (currentQuestion) {
            const element = document.getElementById(`clause - ${currentQuestion.id} `);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentStep, currentQuestion]);

    const handleAnswerChange = (value: any) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    };

    const handleNext = () => {
        // Guest Limit Check
        if (!session && currentStep >= GUEST_STEP_LIMIT) {
            setShowLoginDialog(true);
            return;
        }

        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const isCurrentAnswerValid = () => {
        if (!currentQuestion?.required) return true;
        const val = answers[currentQuestion.id];
        if (currentQuestion.type === 'checkbox') return true;
        return val !== undefined && val !== "" && val !== null;
    };

    // Handle Enter Key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isCurrentAnswerValid()) {
            e.preventDefault();
            handleNext();
        }
    };

    const handleOpenPayment = () => {
        setShowPaymentModal(true);
    };

    const handlePurchase = async () => {
        setPaymentStatus('processing');
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            // 1. Call Purchase API to finalize contract
            const res = await fetch('/api/contracts/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });

            if (!res.ok) throw new Error('Purchase failed');
            setPaymentStatus('success');
            // 2. Redirect to Dashboard after short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error(error);
            setPaymentStatus('error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleManualSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    answers,
                    currentStep
                })
            });
            setLastSaved(new Date());
            alert("Taslak başarıyla kaydedildi! Dilediğiniz zaman devam edebilirsiniz.");
            router.push('/');
        } catch (error) {
            alert("Kayıt sırasında bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- RENDER FOCUS MODE (Completion) ---

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-start pt-8 p-4 animate-in fade-in duration-500">
                <Card className="max-w-2xl w-full shadow-2xl border-0 ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardHeader className="pb-2">
                        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                            <Check className="h-10 w-10 text-green-600 dark:text-green-500" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-center text-slate-900 dark:text-white">
                            Sözleşmeniz Hazır!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <p className="text-center text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                            Tüm soruları başarıyla cevapladınız. Şimdi sözleşmenizi güvenli ödeme ile indirebilirsiniz.
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Toplam Tutar</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-[#ec7b1f]">{productPrice}</span>
                                <span className="text-xl font-medium text-slate-500">TL</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-2 pb-8 px-8">
                        <Button
                            className="w-full h-16 text-xl font-semibold bg-[#ec7b1f] hover:bg-[#d65d0a] shadow-lg shadow-orange-500/20 rounded-xl transition-all hover:scale-[1.02]"
                            onClick={handleOpenPayment}
                        >
                            Ödeme Yap ve İndir
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsCompleted(false)}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                        >
                            Düzenlemeye Geri Dön
                        </Button>
                    </CardFooter>
                </Card>

                {/* Payment Dialog */}
                <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Güvenli Ödeme</DialogTitle>
                            <DialogDescription>
                                {productTitle} için ödeme işlemini tamamlayın.
                            </DialogDescription>
                        </DialogHeader>

                        {paymentStatus === 'idle' || paymentStatus === 'error' ? (
                            <div className="space-y-4 py-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center justify-between border border-blue-100 dark:border-blue-800">
                                    <span className="font-medium text-blue-900 dark:text-blue-100">Ödenecek Tutar:</span>
                                    <span className="font-bold text-xl text-blue-700 dark:text-blue-300">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(productPrice)}</span>
                                </div>

                                <div className="border dark:border-slate-800 rounded-xl p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock className="w-4 h-4 text-green-600" />
                                        <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">256-bit SSL Korumalı</span>
                                    </div>
                                    <Input placeholder="Kart Numarası" className="font-mono h-12" defaultValue="**** **** **** 4242" disabled />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="AA/YY" className="font-mono h-12" defaultValue="12/30" disabled />
                                        <Input placeholder="CVC" className="font-mono h-12" defaultValue="***" disabled />
                                    </div>
                                </div>
                            </div>
                        ) : paymentStatus === 'processing' ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
                                </div>
                                <p className="text-slate-600 font-medium animate-pulse">Ödeme işleniyor...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">Ödeme Başarılı!</h3>
                                    <p className="text-slate-600">Belgeniz indiriliyor...</p>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="sm:justify-between gap-2">
                            {paymentStatus === 'idle' || paymentStatus === 'error' ? (
                                <>
                                    <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>İptal</Button>
                                    <Button onClick={handlePurchase} className="w-full sm:w-auto bg-[#ec7b1f] hover:bg-[#d65d0a] text-white">
                                        Ödemeyi Tamamla
                                    </Button>
                                </>
                            ) : null}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    if (!currentQuestion) {
        return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <Loader2 className="h-10 w-10 animate-spin text-[#ec7b1f]" />
        </div>;
    }

    // --- MAIN RENDER ---
    return (
        <div className="h-screen w-full flex flex-col bg-white dark:bg-slate-950 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-hidden">

            {/* 1. Header: Minimal & Functional */}
            <header className="h-20 shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 px-4 md:px-8 flex items-center justify-between gap-4">

                {/* Left: Logo & Title */}
                <div className="flex items-center gap-4 md:gap-6 min-w-0 md:min-w-fit flex-1 md:flex-none">
                    <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
                        <img
                            src="https://legalmatic.net/wp-content/uploads/2021/12/legalmaticlogo.svg"
                            alt="Legalmatic"
                            className="h-6 md:h-8 w-auto"
                        />
                    </Link>
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block shrink-0"></div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Düzenlenen Sözleşme</span>
                        <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 truncate pr-4">
                            {productTitle}
                        </h1>
                    </div>
                </div>

                {/* Center: Progress (Hidden on small mobile to prioritize title, or keep compact) */}
                <div className="hidden md:flex flex-col items-center gap-2 flex-1 max-w-md">
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#ec7b1f] transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(236,123,31,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Adım {currentStep + 1} / {totalSteps}
                    </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2 md:gap-3 min-w-fit">
                    {/* SSL Badge - Flex Item */}
                    <div className="hidden lg:flex items-center gap-1.5 bg-green-50 dark:bg-green-900/10 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-900/30">
                        <Lock className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                        <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">256-BIT SSL</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="text-slate-400 hover:text-[#ec7b1f] hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors hidden sm:flex"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span className="ml-2">{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                        <X className="w-5 h-5 md:mr-2" />
                        <span className="font-medium hidden md:inline">Çıkış</span>
                    </Button>
                </div>
            </header>

            {/* 2. Main Split Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Interactive Form Area (60%) */}
                <div className="flex-1 flex flex-col relative w-full lg:w-[60%] bg-white dark:bg-slate-950 overflow-hidden">
                    <div className="flex-1 overflow-y-auto w-full">
                        <div className="flex flex-col max-w-2xl mx-auto w-full px-6 py-6 lg:px-12 lg:pt-10">

                            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">

                                {/* Question Label */}
                                <div className="space-y-4">
                                    <Label className="inline-block text-xs font-bold text-[#ec7b1f] uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                                        Soru {currentStep + 1}
                                    </Label>
                                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-[1.15] tracking-tight text-balance">
                                        {currentQuestion.label}
                                    </h2>
                                    {currentQuestion?.description && (
                                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                                            {currentQuestion.description}
                                        </p>
                                    )}
                                </div>

                                {/* Inputs */}
                                <div className="pt-4 pb-8">
                                    {/* Text Input */}
                                    {currentQuestion.type === 'text' && (
                                        <Input
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={currentQuestion.placeholder || "Yanıtınızı buraya yazın..."}
                                            className="h-20 text-2xl md:text-3xl px-0 border-0 border-b-2 border-slate-200 dark:border-slate-800 rounded-none focus-visible:ring-0 focus-visible:border-[#ec7b1f] placeholder:text-slate-300 dark:placeholder:text-slate-700 bg-transparent transition-all"
                                            autoFocus
                                        />
                                    )}

                                    {/* Number Input */}
                                    {currentQuestion.type === 'number' && (
                                        <Input
                                            type="number"
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={currentQuestion.placeholder}
                                            className="h-20 text-2xl md:text-3xl px-0 border-0 border-b-2 border-slate-200 dark:border-slate-800 rounded-none focus-visible:ring-0 focus-visible:border-[#ec7b1f] placeholder:text-slate-300 dark:placeholder:text-slate-700 bg-transparent transition-all font-mono"
                                            autoFocus
                                        />
                                    )}

                                    {/* Date Input */}
                                    {currentQuestion.type === 'date' && (
                                        <Input
                                            type="date"
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="h-20 text-2xl md:text-3xl px-0 border-0 border-b-2 border-slate-200 dark:border-slate-800 rounded-none focus-visible:ring-0 focus-visible:border-[#ec7b1f] bg-transparent transition-all"
                                            autoFocus
                                        />
                                    )}

                                    {/* Textarea */}
                                    {currentQuestion.type === 'textarea' && (
                                        <Textarea
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.metaKey) {
                                                    handleNext();
                                                }
                                            }}
                                            placeholder={currentQuestion.placeholder}
                                            className="min-h-[200px] text-xl p-6 border-2 border-slate-100 dark:border-slate-800 focus:border-[#ec7b1f] focus:ring-0 rounded-2xl bg-slate-50 dark:bg-slate-900/50 resize-none transition-all placeholder:text-slate-300"
                                            autoFocus
                                        />
                                    )}

                                    {/* Select / Options */}
                                    {currentQuestion.type === 'select' && (
                                        <div className="grid gap-3">
                                            {currentQuestion.options?.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        handleAnswerChange(option.value);
                                                        // Optional: auto-advance
                                                    }}
                                                    className={cn(
                                                        "h-20 px-8 rounded-2xl border-2 text-left transition-all font-medium flex items-center justify-between group",
                                                        answers[currentQuestion.id] === option.value
                                                            ? "border-[#ec7b1f] bg-orange-50 dark:bg-orange-900/20 text-[#ec7b1f] shadow-lg shadow-orange-500/10"
                                                            : "border-slate-100 dark:border-slate-800 hover:border-[#ec7b1f]/30 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                                                    )}
                                                >
                                                    <span className="text-xl">{option.label}</span>
                                                    {answers[currentQuestion.id] === option.value && (
                                                        <Check className="w-6 h-6 text-[#ec7b1f]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Radio */}
                                    {currentQuestion.type === 'radio' && (
                                        <div className="grid gap-3">
                                            {currentQuestion.options?.map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => handleAnswerChange(option.value)}
                                                    className={cn(
                                                        "group flex items-center gap-6 p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.01]",
                                                        answers[currentQuestion.id] === option.value
                                                            ? "border-[#ec7b1f] bg-orange-50 dark:bg-orange-900/20 shadow-lg shadow-orange-500/10"
                                                            : "border-slate-100 dark:border-slate-800 hover:border-[#ec7b1f]/30 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                                        answers[currentQuestion.id] === option.value
                                                            ? "border-[#ec7b1f]"
                                                            : "border-slate-200 group-hover:border-slate-300"
                                                    )}>
                                                        {answers[currentQuestion.id] === option.value && (
                                                            <div className="w-4 h-4 rounded-full bg-[#ec7b1f]" />
                                                        )}
                                                    </div>
                                                    <span className={cn(
                                                        "text-xl font-medium transition-colors",
                                                        answers[currentQuestion.id] === option.value ? "text-[#ec7b1f]" : "text-slate-700 dark:text-slate-300"
                                                    )}>{option.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Navigation Bar - Hybrid Sticky */}
                        <div className="sticky bottom-0 w-full mt-auto bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center z-20">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="h-14 px-6 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100/50 transition-all disabled:opacity-0"
                            >
                                <ArrowLeft className="w-6 h-6 mr-2" />
                                <span className="text-lg font-medium">Önceki</span>
                            </Button>

                            {/* Forward Button */}
                            <Button
                                onClick={handleNext}
                                disabled={!isCurrentAnswerValid()}
                                className={cn(
                                    "h-16 px-10 rounded-2xl text-xl font-semibold shadow-xl transition-all hover:scale-105 active:scale-95",
                                    isCurrentAnswerValid()
                                        ? "bg-[#ec7b1f] hover:bg-[#d65d0a] text-white shadow-orange-500/25 hover:shadow-orange-500/40"
                                        : "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
                                )}
                            >
                                {currentStep === totalSteps - 1 ? 'Tamamla' : 'Devam Et'}
                                {currentStep !== totalSteps - 1 && <ArrowRight className="w-6 h-6 ml-3" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right: Live Preview (40%) - Hidden on mobile */}
                <div className="hidden lg:flex w-[40%] bg-slate-100/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 z-10">
                        <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Canlı Önizleme
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8" ref={scrollAreaRef}>
                        <div className="max-w-[calc(210mm*0.8)] mx-auto bg-white dark:bg-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none min-h-[800px] origin-top transition-transform">
                            <ContractVisualizer
                                schema={schema}
                                answers={answers}
                                title={productTitle}
                                currentQuestionId={currentQuestion.id}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Resume Dialog */}
            <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yarım kalan taslağınız var</DialogTitle>
                        <DialogDescription>
                            En son {foundDraft?.updatedAt && new Date(foundDraft.updatedAt).toLocaleString()} tarihinde kaydettiğiniz bir taslak bulundu.
                            Kaldığınız yerden devam etmek ister misiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowDraftDialog(false);
                        }}>
                            Baştan Başla
                        </Button>
                        <Button onClick={() => {
                            if (foundDraft) {
                                setAnswers(foundDraft.answers); // JSON.parse removed
                                setCurrentStep(foundDraft.currentStep);
                            }
                            setShowDraftDialog(false);
                        }} className="bg-[#ec7b1f] hover:bg-[#d65d0a]">
                            Kaldığım Yerden Devam Et
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Login Dialog for Guests */}
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-[#ec7b1f]" />
                        </div>
                        <DialogTitle className="text-center">Devam Etmek İçin Üye Olun</DialogTitle>
                        <DialogDescription className="text-center">
                            Güvenliğiniz için sözleşmenizin geri kalanını şifreli hesabınızda saklamalıyız. Ücretsiz üye olarak kaldığınız yerden devam edebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-400 flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Verileriniz otomatik kaydedilir</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>İstediğiniz cihazdan devam edebilirsiniz</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>256-bit uçtan uca şifreleme</span>
                        </div>
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => router.push('/login?callbackUrl=' + encodeURIComponent(window.location.href))} className="w-full">
                            Giriş Yap
                        </Button>
                        <Button onClick={() => router.push('/register?callbackUrl=' + encodeURIComponent(window.location.href))} className="w-full bg-[#ec7b1f] hover:bg-[#d65d0a] text-white">
                            Hemen Üye Ol
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
