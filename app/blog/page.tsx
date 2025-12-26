
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { blogPosts } from "@/lib/blogData";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Header */}
                <div className="container mx-auto px-4 py-16 text-center">
                    <Badge variant="outline" className="mb-4 border-orange-200 text-orange-600 bg-orange-50 px-4 py-1">
                        Güncel Hukuk & Teknoloji
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Legalmatic Blog
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Hukuk dünyasındaki son gelişmeler, girişimciler için rehberler ve sözleşme hazırlama ipuçları.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer">
                                <Card className="h-full overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                                    <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm">
                                                {post.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                                            <div className="flex items-center gap-1">
                                                <CalendarDays className="w-3 h-3" />
                                                {post.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime}
                                            </div>
                                        </div>
                                        <CardTitle className="line-clamp-2 text-xl group-hover:text-[#ec7b1f] transition-colors">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="line-clamp-3">
                                            {post.excerpt}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="text-sm font-medium text-[#ec7b1f] flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Devamını Oku <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="container mx-auto px-4 mt-24">
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold text-white mb-4">Bültenimize Abone Olun</h2>
                            <p className="text-slate-300 mb-8">
                                Yeni makaleler, hukuki ipuçları ve güncellemelerden anında haberdar olmak için e-bültenimize katılın.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ec7b1f]"
                                />
                                <button className="px-6 py-3 bg-[#ec7b1f] hover:bg-[#d65d0a] text-white font-semibold rounded-xl transition-colors">
                                    Abone Ol
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
