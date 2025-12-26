import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
    title: 'İletişim - Legalmatic',
    description: 'Sorularınız ve önerileriniz için bize ulaşın. Adres, telefon ve iletişim formu.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col">
            <Navbar />

            {/* Content Wrapper with padding for fixed navbar */}
            <div className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Bize Ulaşın</h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">Sorularınız, önerileriniz veya destek talepleriniz için bize her zaman ulaşabilirsiniz.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Contact Info */}
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-700 delay-100 fade-in">
                            <Card className="border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden ">
                                <CardContent className="p-8 space-y-8">
                                    {/* Address */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 text-[#ec7b1f]">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Adres</h3>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                                Maslak Mah. Büyükdere Cad.<br />
                                                Noramin İş Merkezi Sitesi No: 237,<br />
                                                İç Kapı No:8 Sarıyer/İstanbul
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-blue-600">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Telefon</h3>
                                            <a href="tel:02127090850" className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-600 transition-colors">0212 709 0850</a>
                                            <p className="text-sm text-slate-400 mt-1">Hafta içi 09:00 - 18:00</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 text-green-600">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">E-Posta</h3>
                                            <a href="mailto:bilgi@legalmatic.net" className="text-slate-500 dark:text-slate-400 font-medium hover:text-green-600 transition-colors">bilgi@legalmatic.net</a>
                                            <p className="text-sm text-slate-400 mt-1">7/24 Bize yazabilirsiniz.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Google Map Embed */}
                            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 relative bg-slate-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12028.983756209865!2d29.0201174!3d41.1158655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab5c16182c407%3A0x89e0018f36294d!2sNoramin%20Is%20Merkezi!5e0!3m2!1str!2str!4v1703670000000!5m2!1str!2str"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Legalmatic Ofis Konumu"
                                    className="grayscale hover:grayscale-0 transition-all duration-700"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-4 duration-700 delay-200 fade-in">
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Bize Yazın</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Adınız Soyadınız</label>
                                        <Input id="name" placeholder="Adınız Soyadınız" className="h-12 bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">E-Posta Adresi</label>
                                        <Input id="email" type="email" placeholder="ornek@email.com" className="h-12 bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">Konu</label>
                                    <Input id="subject" placeholder="Mesajınızın konusu..." className="h-12 bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Mesajınız</label>
                                    <Textarea id="message" placeholder="Size nasıl yardımcı olabiliriz?" className="min-h-[150px] bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800 resize-none" />
                                </div>

                                <Button size="lg" className="w-full h-14 bg-[#ec7b1f] hover:bg-[#d96a12] text-white text-lg font-bold rounded-xl shadow-lg shadow-orange-500/20 transform hover:-translate-y-1 transition-all duration-300">
                                    <Send className="w-5 h-5 mr-2" />
                                    GÖNDER
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
