import { prisma } from "@/lib/prisma";
import { DeleteContractButton } from "@/components/admin/DeleteContractButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, FileText, Users, Mail, TrendingUp, Settings } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
    const contracts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container mx-auto pt-24 pb-10 px-4">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link href="/admin/crm" className="block">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-10 h-10" />
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Yeni</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">CRM Sistemi</h3>
                        <p className="text-blue-100 text-sm">Müşteri ilişkileri yönetimi</p>
                    </div>
                </Link>

                <Link href="/admin/campaigns" className="block">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <Mail className="w-10 h-10" />
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Brevo</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">E-posta Kampanyaları</h3>
                        <p className="text-purple-100 text-sm">Kampanya yönetimi ve analitik</p>
                    </div>
                </Link>

                <Link href="/admin/settings/brevo" className="block">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <Settings className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Brevo Ayarları</h3>
                        <p className="text-orange-100 text-sm">API ve e-posta yapılandırması</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link href="/admin/templates" className="block">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <Mail className="w-10 h-10" />
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">5 Hazır</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">E-posta Şablonları</h3>
                        <p className="text-pink-100 text-sm">Drag & drop template builder</p>
                    </div>
                </Link>

                <Link href="/admin/customers" className="block">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Müşteri Yönetimi</h3>
                        <p className="text-green-100 text-sm">Müşteri kayıtları ve siparişler</p>
                    </div>
                </Link>
            </div>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Sözleşme Yönetimi</h1>
                <Button asChild className="bg-[#0F172A]">
                    <Link href="/admin/contracts/new">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Sözleşme Ekle
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead>Slug (Link)</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contracts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">Henüz sözleşme bulunmuyor.</TableCell>
                            </TableRow>
                        ) : (
                            contracts.map((contract) => (
                                <TableRow key={contract.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-slate-500" />
                                            {contract.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{contract.category}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(contract.price)}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500">{contract.slug}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/admin/contracts/${contract.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeleteContractButton id={contract.id} title={contract.title} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
