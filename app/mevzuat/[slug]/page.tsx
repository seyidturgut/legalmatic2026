
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Scale, Calendar, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const legislation = await prisma.legislation.findUnique({
        where: { slug },
    });

    if (!legislation) return { title: "Mevzuat Bulunamadı" };

    return {
        title: `${legislation.title} - Mevzuat | Legalmatic`,
        description: legislation.summary,
    };
}

export default async function LegislationDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const legislation = await prisma.legislation.findUnique({
        where: { slug },
        include: {
            products: true
        }
    });

    if (!legislation) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-50/80 via-indigo-50/20 to-transparent dark:from-blue-950/20 dark:via-slate-950/0 dark:to-transparent -z-10" />

            <Navbar />

            <main className="flex-grow pt-28 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="hover:text-blue-600 transition-colors">
                                        <Home className="w-4 h-4" />
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-slate-500 font-medium">Mevzuat Bilgi Bankası</BreadcrumbPage>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{legislation.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
                        {/* Header */}
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-8 mb-8">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1 text-sm font-semibold">
                                    {legislation.type}
                                </Badge>
                                <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-full px-4 py-1">
                                    <span className="font-semibold mr-1">Ref No:</span> {legislation.referenceNo}
                                </div>
                                {legislation.publishDate && (
                                    <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-full px-4 py-1">
                                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                        {new Date(legislation.publishDate).toLocaleDateString('tr-TR')}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                                {legislation.title}
                            </h1>

                            {legislation.summary && (
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                    {legislation.summary}
                                </p>
                            )}
                        </div>

                        {/* Content */}
                        {legislation.content && (
                            <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    İlgili Metin / Maddeler
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 font-serif text-lg leading-loose text-slate-700 dark:text-slate-300">
                                    {legislation.content.split('\n').map((line, i) => (
                                        <p key={i} className="mb-4 last:mb-0 min-h-[1.5em]">{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Contracts */}
                        {legislation.products && legislation.products.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Scale className="w-6 h-6 text-blue-600" />
                                    Bu Mevzuata Dayanan Sözleşmeler
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {legislation.products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/sozlesmeler/${product.slug}`}
                                            className="group bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-between"
                                        >
                                            <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 transition-colors">
                                                {product.title}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-400 max-w-lg mx-auto">
                                * Bu sayfadaki mevzuat bilgileri bilgilendirme amaçlıdır. Güncel resmi gazete kararları ve yasal değişiklikler için resmi kaynakları kontrol ediniz.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
