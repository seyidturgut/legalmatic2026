
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img
                                src="https://legalmatic.net/wp-content/uploads/2021/12/legalmaticlogo.svg"
                                alt="Legalmatic Logo"
                                className="h-8 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="text-sm max-w-sm text-slate-400">
                            Modern ve güvenilir hukuki belge oluşturma platformu. Avukat onaylı şablonlar ile işlerinizi hızlandırın.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Link href="#" className="hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-blue-400 transition-colors"><Github className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-blue-400 transition-colors"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/sozlesmeler" className="hover:text-white transition-colors">Sözleşmeler</Link></li>
                            <li><Link href="#nasil-calisir" className="hover:text-white transition-colors">Nasıl Çalışır?</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Fiyatlandırma</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">SSS</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Yasal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Kullanım Koşulları</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">KVKK Aydınlatma</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} Legalmatic. Tüm hakları saklıdır.
                </div>
            </div>
        </footer>
    );
}
