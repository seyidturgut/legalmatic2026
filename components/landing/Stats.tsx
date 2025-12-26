
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
    { id: 1, name: 'Oluşturulan Sözleşme', value: '10.000+' },
    { id: 2, name: 'Kayıtlı Kullanıcı', value: '5.000+' },
    { id: 3, name: 'Mutlu Müşteri', value: '%99.8' },
    { id: 4, name: 'Tasarruf Edilen Saat', value: '25.000+' },
];

export function Stats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div className="bg-[#ec7b1f] py-24 sm:py-32 relative overflow-hidden isolate" ref={ref}>
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.orange.500),theme(colors.orange.600))] opacity-20" />
            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white/5 shadow-xl shadow-orange-600/10 ring-1 ring-orange-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Türkiye'nin En Hızlı Büyüyen Hukuk Platformu
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-orange-100">
                            Binlerce birey ve kurum, hukuki süreçlerini Legalmatic ile hızlandırıyor.
                        </p>
                    </div>
                    <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex flex-col bg-white/10 p-8 backdrop-blur-sm hover:bg-white/20 transition-colors"
                            >
                                <dt className="text-sm font-semibold leading-6 text-orange-100">{stat.name}</dt>
                                <dd className="order-first text-3xl font-bold tracking-tight text-white">{stat.value}</dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
