
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    const { id } = await params;
    try {
        const contract = await prisma.product.findUnique({
            where: { id },
        });
        if (!contract) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }
        return NextResponse.json(contract);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch contract" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = await params;
    try {
        const body = await req.json();
        console.log(`Updating contract ${id}`, { ...body, htmlContent: body.htmlContent ? "HTML_CONTENT_PRESENT (length: " + body.htmlContent.length + ")" : "MISSING" });

        const contract = await prisma.product.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                price: parseFloat(body.price),
                slug: body.slug,
                category: body.category,
                templateSchema: body.templateSchema,
                htmlContent: body.htmlContent, // Update HTML content
            },
        });
        return NextResponse.json(contract);
    } catch (error) {
        console.error("Error updating contract:", error);
        return NextResponse.json({ error: "Failed to update contract: " + error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = await params;
    try {
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 });
    }
}
