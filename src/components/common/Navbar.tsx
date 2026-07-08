"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, ShoppingBag, X, Menu, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/products", label: "Products", exact: false },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { cartCount, clearLocalCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("heedy_user"));
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    // Clear local session + cart state only; the DB cart is preserved for next login.
    localStorage.removeItem("heedy_user");
    setIsLoggedIn(false);
    clearLocalCart();
    router.push("/sign-in");
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 lg:h-[72px] px-4 lg:px-8 flex items-center gap-3 lg:gap-6 border-b border-black/10 bg-[#aea3cf]/95 backdrop-blur-md">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsMobileMenuOpen((v) => !v)}
        className="lg:hidden p-2 -ml-2 text-slate-900 hover:text-[#4a3391] transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Logo */}
      <Link href="/" className="flex-shrink-0" aria-label="NEOKART home">
        <div className="relative w-40 sm:w-44 md:w-52 lg:w-56 h-10 lg:h-12">
          <Image
            src="/logo.png"
            alt="Neokart Logo"
            fill
            sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
            className="object-contain object-left"
            priority
          />
        </div>
      </Link>

      {/* Desktop nav links */}
      <nav className="hidden lg:flex items-center gap-8 ml-2">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans font-semibold text-[15px] pb-1 border-b-2 transition-colors ${active
                ? "text-slate-900 border-[#4a3391]"
                : "text-slate-700 border-transparent hover:text-slate-900"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Spacer to push utilities right */}
      <div className="flex-1" />

      {/* Right utilities */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
        {/* Account */}
        <Link
          href={isLoggedIn ? "/profile" : "/sign-in"}
          className="p-2 text-slate-900 hover:text-[#4a3391] transition-colors"
          aria-label="Account"
        >
          <User size={20} />
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative p-2 text-slate-900 hover:text-[#4a3391] transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-[#4a3391] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#aea3cf]">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Logout (when logged in) */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="hidden sm:flex p-2 text-slate-900 hover:text-red-600 transition-colors"
            aria-label="Log out"
          >
            <LogOut size={19} />
          </button>
        )}
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-[#aea3cf] border-b border-black/10 shadow-lg z-30 lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-sans font-semibold text-base py-3 border-b border-black/10 last:border-0 transition-colors ${isActive(link.href, link.exact) ? "text-[#4a3391]" : "text-slate-900 hover:text-[#4a3391]"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-sans font-semibold text-base py-3 text-red-700 text-left"
                >
                  <LogOut size={18} /> Log out
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
