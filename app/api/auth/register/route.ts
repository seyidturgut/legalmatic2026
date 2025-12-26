import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// const prisma = new PrismaClient(); // Removed local instance

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Auto-assign ADMIN role for the specific email
        const role = email === "info@legalmatic.net" ? "ADMIN" : "USER";

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                image: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            },
        });

        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Register Error Details:", error);
        return NextResponse.json({ error: "Kayıt oluşturulamadı: " + (error as any).message }, { status: 500 });
    }
}
