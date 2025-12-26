
import { blogPosts, BlogPost } from "@/lib/blogData";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, ArrowLeft, Share2, Bookmark, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Find related posts (just taking next 2 for demo)
    const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 2);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Article Header */}
                <div className="container mx-auto px-4 max-w-4xl text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Link href="/blog" className="text-slate-500 hover:text-[#ec7b1f] transition-colors flex items-center gap-1 text-sm font-medium">
                            Blog
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                        <span className="text-[#ec7b1f] font-medium text-sm">{post.category}</span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight text-balance">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 dark:text-slate-400 text-sm md:text-base border-y border-slate-100 dark:border-slate-800 py-4 max-w-2xl mx-auto">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-[#ec7b1f]" />
                            {post.date}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#ec7b1f]" />
                            {post.readTime} okuma
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="container mx-auto px-4 max-w-5xl mb-16">
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-xl">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Sidebar (Left) - Share & Actions */}
                        <div className="hidden lg:block lg:col-span-2">
                            <div className="sticky top-32 flex flex-col gap-4 items-end">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Paylaş</p>
                                <Button variant="outline" size="icon" className="rounded-full hover:text-[#ec7b1f] hover:border-[#ec7b1f]">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full hover:text-[#ec7b1f] hover:border-[#ec7b1f]">
                                    <Bookmark className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Content (Center) */}
                        <div className="lg:col-span-10 max-w-prose mx-auto">
                            <article className="prose prose-lg dark:prose-invert prose-slate 
                                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-[#ec7b1f] prose-a:no-underline hover:prose-a:underline
                                prose-li:marker:text-[#ec7b1f] prose-img:rounded-2xl prose-img:shadow-lg
                                md:prose-lg lg:prose-xl">
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </article>

                            {/* Author Bio (Placeholder) */}
                            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl">
                                    👨‍⚖️
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Legalmatic Hukuk Ekibi</p>
                                    <p className="text-sm text-slate-500">Alanında uzman avukatlar tarafından hazırlanmıştır.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Posts */}
                <div className="bg-slate-50 dark:bg-slate-900 py-24 mt-24">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">İlginizi Çekebilir</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedPosts.map((related) => (
                                <Link href={`/blog/${related.slug}`} key={related.id} className="group flex gap-6 items-start p-6 bg-white dark:bg-slate-950 rounded-2xl hover:shadow-lg transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                    <div className="w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200">
                                        <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <Badge variant="secondary" className="mb-2 text-xs">{related.category}</Badge>
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-[#ec7b1f] transition-colors">
                                            {related.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                            <CalendarDays className="w-3 h-3" />
                                            {related.date}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
