
"use client";

import { User } from "lucide-react";

const advisors = [
    {
        name: 'Av. Mehmet Yılmaz',
        role: 'Kurucu Ortak / Bilişim Hukuku',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
        bio: '20 yıllık tecrübesiyle Türkiye\'nin önde gelen bilişim hukuku uzmanlarından.',
    },
    {
        name: 'Av. Zeynep Kaya',
        role: 'Baş Hukuk Danışmanı / Ticaret Hukuku',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
        bio: 'Ticaret hukuku ve sözleşmeler alanında uzmanlaşmış, uluslararası deneyime sahip.',
    },
    {
        name: 'Av. Ali Demir',
        role: 'Danışma Kurulu Üyesi / KVKK Uzmanı',
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
        bio: 'KVKK ve veri gizliliği süreçlerinde Legalmatic\'in uyumluluğunu denetlemektedir.',
    },
];

export function AdvisoryBoard() {
    return (
        <div className="bg-white dark:bg-slate-950 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Uzman Hukukçu Kadromuz
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Legalmatic'teki tüm şablonlar ve süreçler, alanında uzman hukukçulardan oluşan danışma kurulumuz tarafından düzenli olarak denetlenmekte ve onaylanmaktadır.
                    </p>
                </div>
                <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {advisors.map((person) => (
                        <li key={person.name} className="group">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden ring-4 ring-slate-50 dark:ring-slate-800 shadow-xl group-hover:scale-105 transition-transform duration-300">
                                    <img className="object-cover w-full h-full" src={person.imageUrl} alt={person.name} />
                                </div>
                                <h3 className="text-base font-semibold leading-7 tracking-tight text-slate-900 dark:text-white group-hover:text-[#ec7b1f] transition-colors">{person.name}</h3>
                                <p className="text-sm font-semibold leading-6 text-[#ec7b1f]">{person.role}</p>
                                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 max-w-xs">{person.bio}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
