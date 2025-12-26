
"use client";

import { motion } from "framer-motion";

const steps = [
    {
        id: 1,
        title: "Sözleşmeni Seç",
        description: "İhtiyacınıza uygun sözleşme şablonunu (Kira, Hizmet, Satış vb.) geniş kütüphanemizden bulun."
    },
    {
        id: 2,
        title: "Soruları Cevapla",
        description: "Akıllı sihirbazın yönlendirdiği basit soruları cevaplayarak sözleşmeyi kendinize göre özelleştirin."
    },
    {
        id: 3,
        title: "Öde ve İndir",
        description: "Ödemenizi güvenle yapın, sözleşmenizi anında Word veya PDF formatında indirip kullanmaya başlayın."
    }
];

export function HowItWorks() {
    return (
        <section id="nasil-calisir" className="bg-white dark:bg-slate-950 py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-2xl text-center mb-16"
                >
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        3 Adımda Hazır
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Sadece 2 dakikanızı ayırarak profesyonel bir sözleşmeye sahip olun.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connector Line (Desktop) - Animated */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800 -z-10 overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-slate-200 dark:bg-slate-700"
                        />
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.3
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
                    >
                        {steps.map((step) => (
                            <motion.div
                                key={step.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
                                }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, borderColor: "#ec7b1f" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-2xl mb-6 z-10 transition-colors duration-300"
                                >
                                    <span className="text-4xl font-extrabold text-[#ec7b1f]">{step.id}</span>
                                </motion.div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 px-2 leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
