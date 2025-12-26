
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const purchaseSchema = z.object({
    productId: z.string(),
});

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { productId } = purchaseSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 1. Get the draft to finalize
        const draft = await prisma.contractDraft.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId,
                },
            },
            include: { product: true }
        });

        if (!draft) {
            return NextResponse.json({ error: "Draft not found" }, { status: 404 });
        }

        // 2. Transaction: Create Contract, Create Order, Delete Draft
        const result = await prisma.$transaction(async (tx) => {
            // A. Create UserContract (The permanent copy)
            const userContract = await tx.userContract.create({
                data: {
                    userId: user.id,
                    productId: productId,
                    answers: draft.answers,
                    status: "COMPLETED"
                }
            });

            // B. Create Order (Financial Record)
            await tx.order.create({
                data: {
                    userId: user.id,
                    productId: productId,
                    amount: draft.product.price,
                    status: "PAID"
                }
            });

            // C. Delete Draft (So they can't resume it, must buy again)
            await tx.contractDraft.delete({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: productId,
                    }
                }
            });

            return userContract;
        });

        return NextResponse.json({ success: true, contractId: result.id }, { status: 200 });

    } catch (error) {
        console.error("Purchase Error:", error);
        return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 });
    }
}
