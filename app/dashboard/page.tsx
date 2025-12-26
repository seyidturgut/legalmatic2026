
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Users, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ContractDownloadButton } from "@/components/dashboard/ContractDownloadButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect("/login");
    }

    // Check for Admin Role
    if (user.role === 'ADMIN') {
        const totalCustomers = await prisma.user.count({
            where: { role: { not: 'ADMIN' } }
        });

        const totalProducts = await prisma.product.count();

        // Calculate monthly sales
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlySales = await prisma.order.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: { gte: firstDayOfMonth },
                status: 'COMPLETED'
            }
        });

        // Fetch recent orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                product: true
            }
        });

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Paneli</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Hoş geldin, <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline" className="rounded-full">
                                <Link href="/admin/customers">
                                    <Users className="w-4 h-4 mr-2" />
                                    Müşteriler
                                </Link>
                            </Button>
                            <Button asChild className="bg-[#ec7b1f] hover:bg-[#d65d0a] text-white rounded-full shadow-lg shadow-orange-500/20">
                                <Link href="/admin/contracts/new">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Yeni Sözleşme Ekle
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
                                <Users className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalCustomers}</div>
                                <p className="text-xs text-slate-500">Mevcut kullanıcı sayısı</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Aylık Satış</CardTitle>
                                <CreditCard className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {monthlySales._sum.amount ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(monthlySales._sum.amount) : '0 ₺'}
                                </div>
                                <p className="text-xs text-slate-500">Bu ayki toplam ciro</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sözleşme Adedi</CardTitle>
                                <FileText className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalProducts}</div>
                                <p className="text-xs text-slate-500">Sistemdeki toplam sözleşme türü</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Son Siparişler</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{recentOrders.length}</div>
                                <p className="text-xs text-slate-500">Son 5 işlem gösteriliyor</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Orders Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>En Son Satılan Sözleşmeler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm text-left">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Müşteri</th>
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Sözleşme</th>
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Tutar</th>
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Durum</th>
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400 text-right">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                                                <td className="p-4 align-middle font-medium">{order.user?.name || order.user?.email}</td>
                                                <td className="p-4 align-middle">{order.product?.title}</td>
                                                <td className="p-4 align-middle">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={cn(
                                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                                        order.status === 'COMPLETED' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                    )}>
                                                        {order.status === 'COMPLETED' ? 'Tamamlandı' : 'Bekliyor'}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle text-right">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-slate-500">Henüz sipariş bulunmuyor.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Fetch Drafts
    const drafts = await prisma.contractDraft.findMany({
        where: { userId: user.id },
        include: { product: true },
        orderBy: { updatedAt: 'desc' }
    });

    // Fetch Completed Contracts (UserContract)
    const contracts = await prisma.userContract.findMany({
        where: { userId: user.id },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panelim</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Hoş geldin, <span className="font-semibold text-slate-900 dark:text-white">{session.user?.name}</span>
                        </p>
                    </div>
                    <Button asChild className="bg-[#ec7b1f] hover:bg-[#d65d0a] text-white rounded-full shadow-lg shadow-orange-500/20">
                        <Link href="/sozlesmeler">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Sözleşme Oluştur
                        </Link>
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Toplam Sözleşme</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{contracts.length}</div>
                            <p className="text-xs text-slate-500 mt-1">Oluşturulan belgeler</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Bekleyen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{drafts.length}</div>
                            <p className="text-xs text-slate-500 mt-1">Tamamlanmamış taslaklar</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Drafts Section */}
                {drafts.length > 0 && (
                    <Card className="mb-8 border-orange-200 dark:border-orange-900/50 shadow-sm bg-orange-50/30 dark:bg-orange-900/10">
                        <CardHeader>
                            <CardTitle className="text-[#ec7b1f]">Devam Eden Taslaklar</CardTitle>
                            <CardDescription>
                                Yarım bıraktığınız sözleşmeleri buradan tamamlayabilirsiniz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {drafts.map((draft) => (
                                    <div key={draft.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                {draft.product.title.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">{draft.product.title}</h4>
                                                <p className="text-xs text-slate-500">Son Güncelleme: {new Date(draft.updatedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <Button asChild size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                                            <Link href={`/olustur/${draft.product.slug}`}>
                                                Devam Et
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Contracts List (UserContract) */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle>Sözleşmelerim</CardTitle>
                        <CardDescription>
                            Satın aldığınız ve oluşturduğunuz tüm sözleşmeler burada listelenir.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {contracts.length > 0 ? (
                            <div className="space-y-4">
                                {contracts.map((contract) => (
                                    <div key={contract.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <FileText className="h-8 w-8 text-slate-400" />
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">{contract.product.title}</h4>
                                                <p className="text-xs text-slate-500">Oluşturma: {new Date(contract.createdAt).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Tamamlandı</span>
                                            <ContractDownloadButton
                                                slug={contract.product.slug}
                                                answers={contract.answers}
                                                title={contract.product.title}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Henüz tamamlanan sözleşmeniz yok</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-6">
                                    İhtiyacınız olan hukuki belgeyi hemen oluşturmaya başlayın.
                                </p>
                                <Button asChild variant="outline" className="rounded-full">
                                    <Link href="/sozlesmeler">Sözleşmelere Göz At</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
