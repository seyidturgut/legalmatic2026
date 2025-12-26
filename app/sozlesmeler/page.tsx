import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ContractCatalog } from "@/components/contracts/ContractCatalog";

export const dynamic = 'force-dynamic';

async function getContracts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export default async function ContractsPage() {
    const contracts = await getContracts();

    // Transform Prisma output if necessary, or pass directly if types match. 
    // ContractCatalog expects { id, title, description, price, slug, category } which matches Prisma Product.

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
            <Navbar />

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 pt-28 pb-4 pl-5">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="hover:text-blue-600 transition-colors">
                                <Home className="w-4 h-4" />
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Sözleşmeler</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Page Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12 md:pt-16 md:pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 -z-10" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 text-center max-w-2xl relative">
                    <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur border-blue-200 text-blue-700 animate-fade-in-up">
                        <Sparkles className="w-3 h-3 mr-1" /> Legalmatic Sözleşmeler
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        İhtiyacınız Olan Sözleşmeyi Bulun
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        Avukat onaylı, güncel ve kişiselleştirilebilir sözleşme şablonları.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 flex-1">
                <ContractCatalog contracts={contracts} />
            </div>
            <Footer />
        </main>
    );
}
