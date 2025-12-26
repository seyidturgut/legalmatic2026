import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function CustomersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    const customers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    orders: true,
                    contracts: true
                }
            }
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="mb-8">
                    <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        <Link href="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Panele Dön
                        </Link>
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Müşteriler</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Toplam {customers.length} kayıtlı kullanıcı bulunuyor.
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b bg-slate-50 dark:bg-slate-900/50">
                                    <tr className="border-b transition-colors data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800">
                                        <th className="h-12 px-6 align-middle font-medium text-slate-500 dark:text-slate-400">Kullanıcı</th>
                                        <th className="h-12 px-6 align-middle font-medium text-slate-500 dark:text-slate-400">Rol</th>
                                        <th className="h-12 px-6 align-middle font-medium text-slate-500 dark:text-slate-400 text-center">Sipariş</th>
                                        <th className="h-12 px-6 align-middle font-medium text-slate-500 dark:text-slate-400 text-center">Sözleşme</th>
                                        <th className="h-12 px-6 align-middle font-medium text-slate-500 dark:text-slate-400 text-right">Kayıt Tarihi</th>
                                        <th className="h-12 px-6 align-middle font-medium text-slate-500 dark:text-slate-400 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-white dark:bg-slate-950">
                                    {customers.length > 0 ? customers.map((customer) => (
                                        <tr key={customer.id} className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                            <td className="p-6 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">{customer.name || "İsimsiz Kullanıcı"}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {customer.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 align-middle">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                                                    customer.role === 'ADMIN'
                                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                                        : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                                )}>
                                                    {customer.role}
                                                </span>
                                            </td>
                                            <td className="p-6 align-middle text-center">
                                                <div className="inline-flex items-center justify-center min-w-[2rem] h-6 rounded bg-orange-50 text-orange-700 text-xs font-medium px-2">
                                                    {customer._count.orders}
                                                </div>
                                            </td>
                                            <td className="p-6 align-middle text-center">
                                                <div className="inline-flex items-center justify-center min-w-[2rem] h-6 rounded bg-blue-50 text-blue-700 text-xs font-medium px-2">
                                                    {customer._count.contracts}
                                                </div>
                                            </td>
                                            <td className="p-6 align-middle text-right text-slate-500">
                                                {new Date(customer.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="p-6 align-middle text-right">
                                                <Button asChild size="sm" variant="outline" className="h-8">
                                                    <Link href={`/admin/customers/${customer.id}`}>
                                                        İncele
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                                Kayıtlı kullanıcı bulunamadı.
                                            </td>
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
