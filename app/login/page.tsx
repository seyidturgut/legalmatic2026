
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                alert("Giriş başarısız: " + result.error);
            } else {
                router.push("/dashboard");
                router.refresh();
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
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tekrar Hoşgeldiniz</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Hesabınıza giriş yaparak işlemlerinize devam edin.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
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
                                />
                                <div className="text-right mt-1">
                                    <Link href="#" className="text-xs text-[#ec7b1f] hover:underline">Şifremi Unuttum?</Link>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-[#ec7b1f] hover:bg-[#d65d0a] text-white" disabled={loading}>
                            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-slate-500">Hesabınız yok mu? </span>
                        <Link href="/register" className="font-semibold text-[#ec7b1f] hover:text-[#d65d0a]">
                            Hemen Üye Ol
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
