import { prisma } from "@/lib/prisma";
import { DeleteContractButton } from "@/components/admin/DeleteContractButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, FileText } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
    const contracts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container mx-auto pt-24 pb-10 px-4">
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
