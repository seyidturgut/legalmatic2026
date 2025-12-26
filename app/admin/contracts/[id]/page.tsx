
import { prisma } from "@/lib/prisma";
import ContractForm from "@/components/admin/ContractForm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ContractEditorPage({ params }: PageProps) {
    const { id } = await params;

    if (id === 'new') {
        return (
            <div className="container mx-auto pt-24 pb-10 px-4">
                <ContractForm isNew={true} />
            </div>
        );
    }

    const contract = await prisma.product.findUnique({
        where: { id },
    });

    if (!contract) {
        notFound();
    }

    return (
        <div className="container mx-auto pt-24 pb-10 px-4">
            <ContractForm initialData={contract} />
        </div>
    );
}
