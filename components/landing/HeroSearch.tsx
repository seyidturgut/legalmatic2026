"use client";

import * as React from "react";
import { Search, Loader2, FileText, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/app/actions/search";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Inline debounce hook if not exists (safer to include small logic here or use standard debounce)
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function HeroSearch() {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounceValue(query, 300);

    React.useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchProducts(debouncedQuery);
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const popularSearches = ["İş Sözleşmesi", "Kira", "Hizmet Alımı", "Gizlilik", "Vekalet"];

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query) {
            // Optional: Navigate to search results page if implemented
            // router.push(`/search?q=${query}`);
        }
    };

    return (
        <div className="w-full max-w-xl mb-4 relative z-50" ref={containerRef}>

            {/* AI Search Bar Container */}
            <div className="relative group">
                {/* Animated Gradient Stroke Layer - Positioned absolutely behind */}
                <div className="absolute -inset-[2px] rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,#ec7b1f_90deg,transparent_180deg)] animate-[spin_3s_linear_infinite]" />
                </div>

                {/* Main Input Field - White Background */}
                <div className="relative bg-white rounded-full flex items-center p-2 shadow-2xl shadow-orange-500/10 border border-slate-100/50">

                    {/* Left Icon: Search in Orange Circle */}
                    <div className="flex-shrink-0 w-10 h-10 bg-[#ec7b1f] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value.length >= 2) setIsOpen(true);
                        }}
                        onFocus={() => {
                            if (query.length >= 2) setIsOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Hangi sözleşmeye ihtiyacınız var?"
                        className="flex-grow bg-transparent border-none text-slate-700 text-lg px-4 h-10 focus:ring-0 focus:outline-none placeholder:text-slate-400 font-medium"
                    />

                    {/* Right Badge: Arrow Button */}
                    <div className="hidden sm:flex items-center justify-center w-9 h-9 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 px-2 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Popüler:
                </div>
                {popularSearches.map((term) => (
                    <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-100 hover:text-[#ec7b1f] dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                        {term}
                    </button>
                ))}
            </div>

            {/* Dropdown Results */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                    {isLoading ? (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            Aranıyor...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                                Sonuçlar
                            </div>
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/sozlesmeler/${product.slug}`}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5 text-[#ec7b1f]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-[#ec7b1f] transition-colors">
                                            {product.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 truncate">
                                            {product.category}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#ec7b1f] -translate-x-1 group-hover:translate-x-0 transition-all" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-900 dark:text-slate-200 font-medium">Sonuç bulunamadı</p>
                            <p className="text-sm text-slate-500 mt-1">
                                "{query}" için eşleşen sözleşme bulamadık.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
