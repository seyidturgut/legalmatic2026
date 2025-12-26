
import { Scale, Zap, Lock, FileText, Smartphone, Headphones } from "lucide-react";

const features = [
    {
        name: '%100 Hukuki Güvence',
        description:
            'Tüm sözleşmelerimiz alanında uzman avukatlar tarafından hazırlanır ve düzenli olarak mevzuata göre güncellenir.',
        icon: Scale,
    },
    {
        name: '2 Dakikada Hazır',
        description:
            'Karmaşık hukuki terimlerle uğraşmayın. Basit soruları cevaplayın, sistem sizin için sözleşmeyi yazsın.',
        icon: Zap,
    },
    {
        name: 'KVKK ve Gizlilik',
        description:
            'Verileriniz şifrelenerek saklanır. Sözleşme oluşturulduktan sonra kişisel verileriniz sistemden otomatik silinir.',
        icon: Lock,
    },
    {
        name: 'Word & PDF Çıktısı',
        description:
            'Sözleşmenizi ister düzenlenebilir Word formatında, ister imzaya hazır PDF formatında indirin.',
        icon: FileText,
    },
    {
        name: 'Her Cihazda Çalışır',
        description:
            'Bilgisayar, tablet veya telefon. HukukMatik her yerde yanınızda, dilediğiniz zaman sözleşme oluşturun.',
        icon: Smartphone,
    },
    {
        name: 'Canlı Destek',
        description:
            'Aklınıza takılan bir soru mu var? Destek ekibimiz size yardımcı olmak için hazır.',
        icon: Headphones,
    },
];

export function Features() {
    return (
        <div className="bg-white dark:bg-slate-950 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Header Section */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-sm font-bold tracking-wide text-[#ec7b1f] uppercase mb-4">Neden Legalmatic?</h2>
                    <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
                        Sözleşme Hazırlamanın <br className="hidden sm:block" /> En Güvenli Yolu
                    </p>
                    <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Geleneksel yöntemlerle saatler süren ve yüksek maliyetli olan sözleşme süreçlerini dijitale taşıdık.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mx-auto max-w-7xl">
                    <dl className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col items-start text-left group hover:bg-slate-50 dark:hover:bg-slate-900/50 p-6 rounded-2xl transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#ec7b1f] shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <dt className="text-lg font-bold text-slate-900 dark:text-white">
                                        {feature.name}
                                    </dt>
                                </div>
                                <dd className="text-base leading-7 text-slate-600 dark:text-slate-400">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
