
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import HTMLtoDOCX from "html-to-docx";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug, data } = body;

        if (!slug || !data) {
            return NextResponse.json({ error: "Missing slug or data" }, { status: 400 });
        }

        // 1. Fetch Contract HTML from Database
        const product = await prisma.product.findUnique({
            where: { slug }
        });

        if (!product || !product.htmlContent) {
            return NextResponse.json(
                { error: `Contract template not found for slug: ${slug}` },
                { status: 404 }
            );
        }

        // 2. Replace Placeholders
        // Logic: Look for {{key}} and replace with data[key]
        let content = product.htmlContent;

        // Simple replacement with whitespace tolerance
        Object.keys(data).forEach((key) => {
            // Replace {{ key }} or {{key}} or {{  key  }}
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            content = content.replace(regex, data[key]);
        });

        // Clean up any remaining tags if needed, or leave them. 
        // Conditional logic ({{#if...}}) is harder with string replace. 
        // For MVP, we stick to direct variable replacement.
        // If complex logic is needed, handle it in frontend or use a library string template engine (like handlebars) before html-to-docx.
        // For now, let's assume simple value replacement.

        // 3. Convert HTML to DOCX
        // html-to-docx expects HTML string, null, options.
        const fileBuffer = await HTMLtoDOCX(content, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });

        // 4. Return formatted response
        return new NextResponse(fileBuffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename="${slug}_generated.docx"`,
            },
        });

    } catch (error) {
        console.error("Error generating document:", error);
        return NextResponse.json(
            { error: "Internal Server Error during document generation" },
            { status: 500 }
        );
    }
}
