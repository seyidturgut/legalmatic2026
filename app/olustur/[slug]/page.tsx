
import { prisma } from "@/lib/prisma";
import FormWizard from "@/components/wizard/FormWizard";
import { notFound } from "next/navigation";
import { FormSchema } from "@/types/wizard";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Force dynamic rendering to ensure fresh schema
export const revalidate = 0;

export default async function CreateContractPage({ params }: PageProps) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
    });

    if (!product) {
        notFound();
    }

    // Parse schema safely
    let schema: FormSchema = [];
    try {
        schema = JSON.parse(product.templateSchema);
    } catch (error) {
        console.error("Failed to parse schema JSON", error);
        return <div>Error loading contract template.</div>;
    }

    return (
        <FormWizard
            schema={schema}
            productTitle={product.title}
            productPrice={product.price}
            productSlug={product.slug}
            productId={product.id}
        />
    );
}
