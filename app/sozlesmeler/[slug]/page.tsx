
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, FileText, Shield, Clock, HelpCircle, Home } from "lucide-react";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SuitabilityCheck } from "@/components/contracts/SuitabilityCheck";
import { ContractBlurPreview } from "@/components/contracts/ContractBlurPreview";
import { AlertTriangle, Gavel } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { slug },
    });

    if (!product) return { title: "Sözleşme Bulunamadı" };

    return {
        title: `${product.title} - Legalmatic`,
        description: product.description,
    };
}

export default async function ContractDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Force dynamic rendering to ensure fresh data
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { legislations: true },
    });

    if (!product) {
        notFound();
    }

    const details = product.details as any || {};

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans flex flex-col relative">
            {/* Decorative Background Elements - Managed with z-index to avoid scroll issues */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-transparent dark:from-blue-950/20 dark:via-slate-950/0 dark:to-transparent -z-10" />
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-orange-100/40 dark:bg-orange-900/10 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />
            <div className="fixed top-40 -left-20 w-[400px] h-[400px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />

            <Navbar />

            <main className="flex-grow pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Breadcrumb - Integrated and compact */}
                    <div className="mb-6 pl-1">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="hover:text-blue-600 transition-colors">
                                        <Home className="w-4 h-4" />
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/sozlesmeler">Sözleşmeler</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-slate-500 font-medium">{product.category}</BreadcrumbPage>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{product.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* LEFT COLUMN: Content (8 cols) */}
                        <div className="lg:col-span-8 flex flex-col gap-10">

                            {/* Header Section */}
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                                        {product.category}
                                    </Badge>
                                    <div className="flex items-center text-xs font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1">
                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                                    {product.title}
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {details.intro || product.description}
                                </p>
                            </div>

                            {/* Blurred Preview Teaser */}
                            <ContractBlurPreview title={product.title} />

                            {/* Tabs & Details */}
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-900 p-1 rounded-xl mb-8">
                                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium py-2.5">Genel Bakış</TabsTrigger>
                                    <TabsTrigger value="scope" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium py-2.5">Kapsam</TabsTrigger>
                                    <TabsTrigger value="faq" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium py-2.5">Sıkça Sorulanlar</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">

                                    {/* Suitability Check */}
                                    {details.suitability && details.suitability.length > 0 && (
                                        <SuitabilityCheck items={details.suitability} />
                                    )}

                                    {details.whatIsIt && (
                                        <div className="group">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 group-hover:text-blue-600 transition-colors">
                                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                                {details.whatIsIt.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-300 text-base leading-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                                {details.whatIsIt.content}
                                            </p>
                                        </div>
                                    )}
                                    {details.whoUses && (
                                        <div className="group">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 group-hover:text-purple-600 transition-colors">
                                                <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                                                {details.whoUses.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-300 text-base leading-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                                {details.whoUses.content}
                                            </p>
                                        </div>
                                    )}

                                    {/* Risks Section */}
                                    {details.risks && details.risks.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                                <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                                                    <AlertTriangle className="w-5 h-5" />
                                                </div>
                                                Önlenen Hukuki Riskler
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {details.risks.map((risk: any, i: number) => (
                                                    <div key={i} className="bg-red-50/50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 hover:border-red-200 transition-colors">
                                                        <h4 className="font-bold text-red-900 dark:text-red-100 mb-2">{risk.title}</h4>
                                                        <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                                                            {risk.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="scope" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-8">
                                    {details.scope && details.scope.length > 0 ? (
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Sözleşme Maddeleri ve Kapsamı</h3>
                                                <p className="text-sm text-slate-500 mt-1">Bu sözleşme aşağıdaki başlıkları detaylıca düzenler:</p>
                                            </div>
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {details.scope.map((item: string, i: number) => (
                                                    <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-default">
                                                        <div className="mt-1 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 italic p-4">Kapsam bilgisi bulunamadı.</p>
                                    )}

                                    {/* Legal Basis */}
                                    {details.legalBasis && details.legalBasis.length > 0 && (
                                        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm">
                                                <Gavel className="w-4 h-4" />
                                                Hukuki Dayanak
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {details.legalBasis.map((law: string, i: number) => (
                                                    <Badge key={i} variant="outline" className="bg-slate-200/50 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 font-normal">
                                                        {law}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="faq" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                                    {details.faq && details.faq.length > 0 ? (
                                        <Accordion type="single" collapsible className="w-full space-y-4">
                                            {details.faq.map((item: any, i: number) => (
                                                <AccordionItem key={i} value={`item-${i}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 shadow-sm data-[state=open]:border-blue-200 data-[state=open]:ring-1 data-[state=open]:ring-blue-100 transition-all">
                                                    <AccordionTrigger className="text-base font-semibold text-slate-900 dark:text-white hover:no-underline py-4 hover:text-blue-600 transition-colors">
                                                        {item.q}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-slate-600 dark:text-slate-400 pb-4 leading-relaxed">
                                                        {item.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    ) : (
                                        <p className="text-slate-500 italic p-4">Sıkça sorulan soru bulunamadı.</p>
                                    )}
                                </TabsContent>
                            </Tabs>

                            {/* Related Legislations Section */}
                            {product.legislations && product.legislations.length > 0 && (
                                <div className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-slate-400 rounded-full"></div>
                                        İlgili Mevzuatlar
                                    </h3>
                                    <div className="grid gap-4">
                                        {product.legislations.map((legislation: any) => (
                                            <Link
                                                key={legislation.id}
                                                href={`/mevzuat/${legislation.slug}`}
                                                className="group block bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-medium">
                                                                {legislation.type}
                                                            </Badge>
                                                            <span className="text-xs text-slate-400 font-medium">Ref: {legislation.referenceNo}</span>
                                                        </div>
                                                        <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                            {legislation.title}
                                                        </h4>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>Bu mevzuat referansı bilgilendirme amaçlıdır.</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Sticky Sidebar (4 cols) */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                                    <div className="bg-[#fafafa] dark:bg-slate-950 rounded-[1.25rem] p-6">

                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TEK SEFERLİK ÖDEME</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                        {product.price === 0 ? "Ücretsiz" : `₺${product.price}`}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-400">/ belge</span>
                                                </div>

                                                {/* Social Proof Badge */}
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <div className="flex -space-x-1.5">
                                                        <div className="w-5 h-5 rounded-full border border-white dark:border-slate-900 bg-slate-200" />
                                                        <div className="w-5 h-5 rounded-full border border-white dark:border-slate-900 bg-slate-300" />
                                                        <div className="w-5 h-5 rounded-full border border-white dark:border-slate-900 bg-slate-400" />
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-medium">
                                                        Bugüne kadar <strong className="text-slate-700 dark:text-slate-300">{getPurchasedCount(product.slug)}</strong> kişi satın aldı
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            {[
                                                "Hukukçu onaylı güncel içerik",
                                                "Anında Word (.docx) olarak indirme",
                                                "Sınırsız düzenleme imkanı",
                                                "7/24 Kullanılabilir"
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-3 shrink-0" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
                                            <Link href={`/olustur/${product.slug}`}>
                                                Hemen Oluştur <ArrowRight className="ml-2 w-5 h-5" />
                                            </Link>
                                        </Button>

                                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                                            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500 font-bold">VISA</div>
                                            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500 font-bold">MC</div>
                                            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500 font-bold">AMEX</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust & Stats Cards (Moved here) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Güvenilirlik</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Avukat Onaylı</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Format</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Word & PDF</span>
                                    </div>
                                </div>

                                {/* Help Card */}
                                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50 flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">Yardıma mı ihtiyacınız var?</h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                            Sözleşme seçimi veya oluşturma süreciyle ilgili sorularınız için bizimle iletişime geçebilirsiniz.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Floating CTA */}
            <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden animate-in slide-in-from-bottom-5 duration-500">
                <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md p-2 pl-5 pr-2 rounded-2xl flex items-center justify-between shadow-2xl border border-slate-700/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">TOPLAM</span>
                        <span className="text-xl font-bold text-white tracking-tight">
                            {product.price === 0 ? "Ücretsiz" : `₺${product.price}`}
                        </span>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl px-6 h-12 shadow-lg shadow-orange-500/20" asChild>
                        <Link href={`/olustur/${product.slug}`}>
                            Hemen Oluştur <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

// Helper to generate a deterministic random number based on slug
function getPurchasedCount(slug: string): number {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate a number between 42 and 342
    return (Math.abs(hash) % 300) + 42;
}
