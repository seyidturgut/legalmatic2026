import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("E-posta ve şifre gereklidir.");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Kullanıcı bulunamadı.");
                }

                // Compare hashed password
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const b = require('bcryptjs');
                const isPasswordValid = await b.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Hatalı şifre.");
                }

                return user;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/login',
    }
};
