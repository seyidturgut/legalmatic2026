"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";
import { UserNav } from "@/components/dashboard/UserNav";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <div className={cn(
        "fixed left-0 right-0 z-50 flex justify-center transition-all duration-300",
        scrolled ? "top-2 md:top-4 px-2 md:px-4" : "top-4 md:top-6 px-2 md:px-4"
      )}>
        <nav
          className={cn(
            "flex items-center justify-between px-4 md:px-8 py-3 md:py-4 transition-all duration-300 ease-in-out",
            scrolled
              ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-slate-800/50 w-full max-w-7xl rounded-2xl"
              : "bg-transparent border-transparent w-full max-w-7xl rounded-none",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-4 md:mr-8 z-50 relative">
            <img
              src="https://legalmatic.net/wp-content/uploads/2021/12/legalmaticlogo.svg"
              alt="Legalmatic Logo"
              className={cn("transition-all duration-300", scrolled ? "h-6 md:h-7" : "h-7 md:h-9")}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
            <NavLinks />
          </div>

          {/* Mobile Menu Toggle & Actions */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto z-50">
            <AuthButtons />

            <button
              className="md:hidden p-2 text-slate-700 dark:text-slate-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-slate-950 pt-24 px-6 md:hidden animate-in slide-in-from-top-10 fade-in duration-200">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <NavLinks mobile onClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function NavLinks({ mobile, onClick }: { mobile?: boolean, onClick?: () => void }) {
  const baseClass = "text-base font-medium text-slate-700 hover:text-[#ec7b1f] dark:text-slate-200 dark:hover:text-[#ec7b1f] transition-colors relative group";
  const mobileClass = "text-xl font-semibold py-2 border-b border-slate-100 dark:border-slate-800";

  const links = [
    { href: "/sozlesmeler", label: "Tüm Sözleşmeler" },
    { href: "/nasil-calisir", label: "Nasıl Çalışır?" },
    { href: "/blog", label: "Blog" },
    { href: "/iletisim", label: "İletişim" },
  ];

  return (
    <>
      {!mobile && (
        <Link
          href="/"
          className="text-slate-700 hover:text-[#ec7b1f] dark:text-slate-200 dark:hover:text-[#ec7b1f] transition-colors"
          aria-label="Ana Sayfa"
        >
          <Home className="w-5 h-5" />
        </Link>
      )}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={mobile ? mobileClass : baseClass}
          onClick={onClick}
        >
          {link.label}
          {!mobile && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ec7b1f] transition-all group-hover:w-full" />}
        </Link>
      ))}
    </>
  );
}

import { Menu, X, Home, ShoppingBag, User, LogIn, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Shopping Cart Button */}
      <Button variant="ghost" size="icon" className="relative group text-slate-700 dark:text-slate-200 hover:text-[#ec7b1f] dark:hover:text-[#ec7b1f] hover:bg-orange-50 dark:hover:bg-orange-900/10 w-10 h-10 md:w-11 md:h-11 rounded-full transition-all duration-300">
        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        {/* Active Badge Mockup */}
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
      </Button>

      {/* User Auth Menu */}
      {session ? (
        <UserNav />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-[#ec7b1f] hover:text-white dark:hover:bg-[#ec7b1f] dark:hover:text-white border-none shadow-lg shadow-slate-200/50 dark:shadow-none w-10 h-10 md:w-11 md:h-11 p-0 transition-all duration-300 hover:scale-105 hover:rotate-3">
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
            <DropdownMenuLabel className="font-normal text-xs text-slate-500 mb-2 px-2 uppercase tracking-wider">
              Hesap İşlemleri
            </DropdownMenuLabel>

            <DropdownMenuItem asChild className="cursor-pointer rounded-lg mb-1 focus:bg-slate-50 dark:focus:bg-slate-800 p-2.5">
              <Link href="/login" className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <LogIn className="w-4 h-4" />
                </div>
                Giriş Yap
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 focus:from-orange-100 focus:to-amber-100 border border-orange-100 dark:border-orange-900/30 p-2.5">
              <Link href="/register" className="flex items-center gap-3 font-semibold text-[#ec7b1f]">
                <div className="w-8 h-8 rounded-full bg-[#ec7b1f] flex items-center justify-center text-white shadow-sm">
                  <UserPlus className="w-4 h-4" />
                </div>
                Hemen Üye Ol
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

