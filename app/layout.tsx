import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "@/components/providers/SessionProvider";
import { getServerSession } from "next-auth"; // Added this import to make getServerSession available

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legalmatic",
  description: "Hukuki İşlemleriniz İçin Akıllı Çözümler",
  icons: {
    icon: [
      { url: '/cropped-favicon.jpg?v=3' },
      { url: '/cropped-favicon.jpg?v=3', type: 'image/jpeg' },
    ],
    shortcut: ['/cropped-favicon.jpg?v=3'],
    apple: [
      { url: '/cropped-favicon.jpg?v=3' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="tr">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
