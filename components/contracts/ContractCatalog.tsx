
"use client";

import { useState } from "react";
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    slug: string;
    category: string;
}

export function ContractCatalog({ contracts }: { contracts: Product[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredContracts = contracts.filter(c => {
        const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col gap-8">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto w-full mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                    placeholder="Sözleşme ara... (Örn: Kira, Gizlilik)"
                    className="pl-10 h-12 bg-white shadow-xl shadow-slate-200/50 border-slate-200 text-base rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 justify-start md:justify-center no-scrollbar items-center">
                <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-full ${selectedCategory === null ? 'bg-[#ec7b1f] hover:bg-[#d65d0a] border-[#ec7b1f]' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                    Tümü
                </Button>
                {CATEGORIES.map(cat => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full whitespace-nowrap ${selectedCategory === cat ? 'bg-[#ec7b1f] hover:bg-[#d65d0a] border-[#ec7b1f]' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Contracts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredContracts.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {searchTerm ? "Sonuç Bulunamadı" : "Sözleşme Bulunamadı"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {searchTerm ? `"${searchTerm}" için uygun sözleşme şablonu bulunamadı.` : "Bu kategoride henüz bir sözleşme şablonu bulunmuyor."}
                        </p>
                    </div>
                ) : (
                    filteredContracts.map((contract, i) => (
                        <Link href={`/sozlesmeler/${contract.slug}`} key={contract.id} className="group h-full">
                            <Card className="h-full flex flex-col hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 border-slate-200 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900 bg-white dark:bg-slate-900 overflow-hidden relative animate-fade-in-up"
                                style={{ animationDelay: `${(i % 3) * 100}ms` }}>

                                <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-500 opacity-80" />

                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-[#ec7b1f] group-hover:scale-110 transition-transform duration-300">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {contract.category}
                                    </Badge>
                                </CardHeader>

                                <CardContent className="flex-1 pt-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#ec7b1f] transition-colors">
                                        {contract.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                        {contract.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Ücret</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            {contract.price === 0 ? "Ücretsiz" : `₺${contract.price}`}
                                        </p>
                                    </div>
                                    <Button size="sm" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-[#ec7b1f] hover:text-white hover:border-[#ec7b1f] shadow-sm transition-all group-hover:translate-x-1">
                                        Oluştur <ArrowRight className="ml-1.5 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
