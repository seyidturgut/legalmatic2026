import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, User, ShoppingBag, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { updateUser } from "@/app/actions/admin";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.email) redirect("/login");

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') redirect("/dashboard");

    const customer = await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                include: { product: true },
                orderBy: { createdAt: 'desc' }
            },
            contracts: {
                include: { product: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!customer) notFound();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="mb-8">
                    <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        <Link href="/admin/customers">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Müşteri Listesine Dön
                        </Link>
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{customer.name || customer.email}</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Müşteri Detayları ve Geçmiş İşlemler
                            </p>
                        </div>
                        <div className="text-sm text-slate-500">
                            Kayıt Tarihi: <span className="font-medium text-slate-900 dark:text-white">{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Edit Profile */}
                    <div className="lg:col-span-1">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                            <CardHeader>
                                <CardTitle>Profil Bilgileri</CardTitle>
                                <CardDescription>Kullanıcı bilgilerini düzenleyin</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={updateUser} className="space-y-4">
                                    <input type="hidden" name="userId" value={customer.id} />
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Ad Soyad</Label>
                                        <Input id="name" name="name" defaultValue={customer.name || ''} placeholder="Ad Soyad" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-Posta</Label>
                                        <Input id="email" name="email" defaultValue={customer.email || ''} placeholder="ornek@email.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Rol</Label>
                                        <select
                                            id="role"
                                            name="role"
                                            defaultValue={customer.role}
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                                        >
                                            <option value="USER">Kullanıcı (USER)</option>
                                            <option value="ADMIN">Yönetici (ADMIN)</option>
                                        </select>
                                    </div>

                                    <Button type="submit" className="w-full bg-[#ec7b1f] hover:bg-[#d65d0a] text-white">
                                        <Save className="w-4 h-4 mr-2" />
                                        Değişiklikleri Kaydet
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Toplam Sipariş</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{customer.orders.length}</h3>
                                    </div>
                                    <ShoppingBag className="h-8 w-8 text-orange-500 opacity-20" />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Oluşturulan Sözleşme</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{customer.contracts.length}</h3>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-500 opacity-20" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Orders & Contracts Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>İşlem Geçmişi</CardTitle>
                                <CardDescription>Satın alınan ve oluşturulan sözleşmeler</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {customer.orders.length === 0 && customer.contracts.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">Henüz işlem geçmişi yok.</div>
                                    ) : (
                                        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-8">
                                            {/* Combine and sort specific events if needed, for now listing lists */}
                                            {customer.orders.map((order) => (
                                                <div key={order.id} className="mb-8 ml-6 relative group">
                                                    <span className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900/30">
                                                        <ShoppingBag className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                                    </span>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                        <h3 className="flex items-center text-sm font-semibold text-slate-900 dark:text-white">
                                                            Sipariş Oluşturuldu
                                                            <span className="ml-2 rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600 dark:bg-orange-900/20 dark:text-orange-300">
                                                                {order.status}
                                                            </span>
                                                        </h3>
                                                        <time className="block mb-1 sm:mb-0 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                                                    </div>
                                                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                                        <div className="font-medium">{order.product.title}</div>
                                                        <div className="text-slate-500">Tutar: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}</div>
                                                    </div>
                                                </div>
                                            ))}

                                            {customer.contracts.map((contract) => (
                                                <div key={contract.id} className="mb-8 ml-6 relative group">
                                                    <span className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:ring-slate-950 dark:bg-blue-900/30">
                                                        <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                    </span>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                        <h3 className="flex items-center text-sm font-semibold text-slate-900 dark:text-white">
                                                            Sözleşme Tamamlandı
                                                        </h3>
                                                        <time className="block mb-1 sm:mb-0 text-xs text-slate-500">{new Date(contract.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                                                    </div>
                                                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                                        <span className="font-medium text-slate-900 dark:text-white">{contract.product.title}</span> sözleşmesini başarıyla oluşturdu ve indirdi.
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
