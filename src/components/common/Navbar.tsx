"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, ShoppingBag, X, Menu, LogOut, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/products", label: "Products", exact: false },
];

// WhatsApp contact number (redirect target)
const WHATSAPP_NUMBER = "916235251520";

// WhatsApp brand glyph (lucide has no dedicated WhatsApp icon)
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartCount, clearLocalCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("heedy_user"));
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 lg:h-[72px] px-3 sm:px-4 lg:px-8 flex items-center gap-2 sm:gap-3 lg:gap-6 border-b border-black/10 bg-[#aea3cf]/95 backdrop-blur-md">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsMobileMenuOpen((v) => !v)}
        className="lg:hidden p-1.5 sm:p-2 -ml-1 sm:-ml-2 text-slate-900 hover:text-[#4a3391] transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Logo */}
      <Link href="/" className="flex-shrink-0" aria-label="NEOKART home">
        <div className="relative w-32 sm:w-44 md:w-52 lg:w-56 h-9 sm:h-10 lg:h-12">
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

      {/* Desktop search bar */}
      <form
        onSubmit={handleSearch}
        role="search"
        className="hidden md:flex flex-1 max-w-md mx-4 items-center"
      >
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full h-10 pl-10 pr-4 rounded-full bg-white/80 border border-black/10 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a3391] focus:bg-white transition"
          />
        </div>
      </form>

      {/* Spacer to push utilities right (mobile — search opens from the icon) */}
      <div className="flex-1 md:hidden" />

      {/* Right utilities */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
        {/* Mobile search toggle (desktop uses the inline search bar) */}
        <button
          onClick={() => {
            setIsMobileSearchOpen((v) => !v);
            setIsMobileMenuOpen(false);
          }}
          className="md:hidden p-1.5 sm:p-2 text-slate-900 hover:text-[#4a3391] transition-colors"
          aria-label="Search"
          aria-expanded={isMobileSearchOpen}
        >
          {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 sm:p-2 text-slate-900 hover:text-green-600 transition-colors"
          aria-label="Contact us on WhatsApp"
        >
          <WhatsAppIcon size={20} />
        </a>

        {/* Account */}
        <Link
          href={isLoggedIn ? "/profile" : "/sign-in"}
          className="p-1.5 sm:p-2 text-slate-900 hover:text-[#4a3391] transition-colors"
          aria-label="Account"
        >
          <User size={20} />
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative p-1.5 sm:p-2 text-slate-900 hover:text-[#4a3391] transition-colors"
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

      {/* Mobile search bar (slides down from header) */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-[#aea3cf] border-b border-black/10 shadow-lg z-30 md:hidden overflow-hidden"
          >
            <form onSubmit={handleSearch} role="search" className="px-6 py-3">
              <div className="relative w-full">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  autoFocus
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-white/80 border border-black/10 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a3391] focus:bg-white transition"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
