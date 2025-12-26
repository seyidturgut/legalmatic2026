
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Check for ADMIN role
    // Note: We need to ensure the session type includes role, or cast it for now.
    // In `app/api/auth/[...nextauth]/route.ts` we mapped token.role to session.user.role
    const userRole = (session.user as any).role;

    if (userRole !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-md">
                        Bu sayfayı görüntülemek için yetkiniz bulunmamaktadır. Eğer admin iseniz lütfen doğru hesapla giriş yapınız.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />
            {children}
        </div>
    );
}
