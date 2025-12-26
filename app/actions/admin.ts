'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    // Verify Admin
    const admin = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!admin || admin.role !== 'ADMIN') {
        throw new Error("Forbidden");
    }

    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    if (!userId || !email) {
        throw new Error("Missing required fields");
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                role
            }
        });

        revalidatePath(`/admin/customers/${userId}`);
        revalidatePath(`/admin/customers`);
    } catch (error) {
        console.error("Update User Error:", error);
        throw new Error("Failed to update user");
    }
}
