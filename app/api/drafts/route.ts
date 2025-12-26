
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"; // Singleton
import * as z from "zod";

const draftSchema = z.object({
    productId: z.string(),
    answers: z.any(),
    currentStep: z.number().optional(),
});

export async function POST(req: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { productId, answers, currentStep } = draftSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const draft = await prisma.contractDraft.upsert({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId,
                },
            },
            update: {
                answers: JSON.stringify(answers),
                currentStep: currentStep || 0,
            },
            create: {
                userId: user.id,
                productId: productId,
                answers: JSON.stringify(answers),
                currentStep: currentStep || 0,
            },
        });

        return NextResponse.json({ success: true, draft }, { status: 200 });

    } catch (error) {
        console.error("Draft Save Error:", error);
        return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!session?.user?.email || !productId) {
        return NextResponse.json({ error: "Missing params or unauthorized" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const draft = await prisma.contractDraft.findUnique({
        where: {
            userId_productId: {
                userId: user.id,
                productId: productId,
            },
        },
    });

    if (!draft) {
        return NextResponse.json({ draft: null }, { status: 200 });
    }

    // Parse JSON answer string back to object
    try {
        return NextResponse.json({
            draft: {
                ...draft,
                answers: JSON.parse(draft.answers)
            }
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ draft: null }, { status: 200 });
    }
}
