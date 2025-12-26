
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // In a real app, call an API route to create user (hash password on server)
            // For now, we will simulate or assume an API endpoint exists
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                alert("Kayıt başarılı! Giriş yapabilirsiniz.");
                router.push("/login");
            } else {
                const data = await res.json();
                alert(data.error || "Kayıt başarısız.");
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
                <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Legalmatic'e Katıl</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Hemen ücretsiz hesap oluşturun ve sözleşmelerinizi yönetin.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Ad Soyad</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    className="mt-1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">E-posta Adresi</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    className="mt-1"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@sirket.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Şifre</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="mt-1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-[#ec7b1f] hover:bg-[#d65d0a] text-white" disabled={loading}>
                            {loading ? "Kaydediliyor..." : "Ücretsiz Kayıt Ol"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-slate-500">Zaten hesabınız var mı? </span>
                        <Link href="/login" className="font-semibold text-[#ec7b1f] hover:text-[#d65d0a]">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
