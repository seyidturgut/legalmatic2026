
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const contracts = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(contracts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Creating contract with body:", { ...body, htmlContent: body.htmlContent ? "HTML_CONTENT_PRESENT (length: " + body.htmlContent.length + ")" : "MISSING" });

        // Basic validation
        if (!body.title || !body.slug || !body.price) {
            console.error("Missing required fields:", body);
            return NextResponse.json({ error: "Missing required fields (title, slug, price)" }, { status: 400 });
        }

        const contract = await prisma.product.create({
            data: {
                title: body.title,
                description: body.description || "",
                price: parseFloat(body.price),
                slug: body.slug,
                category: body.category || "Genel",
                templateSchema: body.templateSchema || "[]",
                htmlContent: body.htmlContent || "", // Save HTML content
            },
        });
        return NextResponse.json(contract, { status: 201 });
    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({ error: "Failed to create contract: " + error }, { status: 500 });
    }
}
