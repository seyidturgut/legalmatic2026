'use server'

import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { title: { contains: query } }, // Case insensitive usually depends on DB collation
                    { description: { contains: query } },
                    { category: { contains: query } }
                ]
            },
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                price: true
            }
        });
        return products;
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
