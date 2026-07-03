"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Search, User, ShoppingBag, X, Menu, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartCount, clearCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [liveResults, setLiveResults] = useState<any[]>([]);

  // Fetch products when search opens
  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      const fetchProducts = async () => {
        try {
          const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const res = await axios.get(`${BASE_URL}/v1/products`);
          if (res.data.success && res.data.data) {
            setAllProducts(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch products for search ", err);
        }
      };
      fetchProducts();
    }
  }, [isSearchOpen, allProducts.length]);

  // Update live results when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.keyFeatures && p.keyFeatures.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      ).slice(0, 5);
      setLiveResults(filtered);
    } else {
      setLiveResults([]);
    }
  }, [searchQuery, allProducts]);

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return `${BASE_URL}${url}`;
    }
    return url;
  };

  const handleResultClick = (id: string) => {
    router.push(`/products/${id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("heedy_user"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("heedy_user");
    localStorage.removeItem("heedy_cart");
    setIsLoggedIn(false);
    clearCart();
    router.push("/sign-in");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleToggleSearch = () => {
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-14 lg:h-16 px-6 lg:px-12 flex items-center justify-between border-b ${scrolled ? "bg-white shadow-sm border-slate-200" : "bg-white border-transparent"
        }`}
    >
      {/* ── Mobile Menu Toggle & Profile (Left on Mobile) ── */}
      <div className="flex md:hidden flex-1 justify-start items-center gap-1 relative z-20 pointer-events-none">
        <button
          onClick={toggleMobileMenu}
          className="p-2 -ml-2 text-slate-900 hover:text-blue-500 transition-colors duration-200 pointer-events-auto"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
        </button>
        <Link
          href={isLoggedIn ? "/profile" : "/sign-in"}
          className="p-2 text-slate-900 hover:text-blue-500 transition-colors duration-200 pointer-events-auto"
          aria-label="Account"
        >
          <User size={22} strokeWidth={2} />
        </Link>
      </div>

      {/* ── Logo (Center on Mobile, Left on Desktop) ── */}
      <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center z-10">
        <Link href="/" className="flex-shrink-0" aria-label="NEOKART home">
          <div className="relative w-40 sm:w-44 md:w-52 lg:w-56 h-10 lg:h-12">
            <Image
              src="/logo.jpeg"
              alt="Neokart Logo"
              fill
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
              className="object-contain md:object-left object-center"
              priority
            />
          </div>
        </Link>
      </div>

      {/* ── Center: Nav links (Hidden on mobile) ── */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-12">
        <Link
          href="/products"
          className="font-sans font-black text-base tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors duration-200"
        >
          SHOP
        </Link>
        <Link
          href="/contact-us"
          className="font-sans font-black text-base tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors duration-200"
        >
          CONTACT
        </Link>
      </nav>

      {/* ── Right: Search & Utilities ── */}
      <div className="flex items-center justify-end gap-2 md:gap-4 flex-1 md:flex-none relative z-20 pointer-events-none md:pointer-events-auto">

        {/* --- Mobile Always Visible Icons --- */}
        <div className="flex md:hidden items-center gap-1 sm:gap-2 pointer-events-auto">
          {/* Search Trigger */}
          <button
            onClick={handleToggleSearch}
            className="p-2 text-slate-900 hover:text-blue-500 transition-colors duration-200"
            aria-label="Toggle search"
          >
            <Search size={22} strokeWidth={2} />
          </button>

          <Link
            href="/cart"
            className="relative p-2 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
            aria-label="Cart"
          >
            <ShoppingBag size={22} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </Link>

        </div>

        {/* --- Desktop Interactive Area --- */}
        <div className="hidden md:flex items-center relative min-h-[40px]">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              /* --- Desktop Default State Icons --- */
              <motion.div
                key="default-utilities"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-4"
              >
                {/* Search Trigger */}
                <button
                  onClick={handleToggleSearch}
                  className="flex items-center text-slate-900 hover:text-blue-500 transition-colors duration-200 group"
                  aria-label="Open search"
                >
                  <Search size={24} strokeWidth={2} className="w-6 h-6" />
                </button>

                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative w-10 h-10 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
                  aria-label="Cart"
                >
                  <ShoppingBag size={24} strokeWidth={2} className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Account Icon */}
                <Link
                  href="/profile"
                  className="w-10 h-10 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
                  aria-label="Account"
                >
                  <User size={24} strokeWidth={2} className="w-6 h-6" />
                </Link>

                {/* Logout Icon (Desktop) */}
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center text-slate-900 hover:text-red-500 transition-colors duration-200"
                    aria-label="Log out"
                  >
                    <LogOut size={20} strokeWidth={2} className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ) : (
              /* --- Desktop Search Active State --- */
              <motion.div
                key="active-search"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2 lg:gap-4"
              >
                {/* Search Input Container */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "16rem" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative lg:w-[22rem]"
                >
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full bg-white border border-blue-500 rounded-full pl-5 pr-12 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-[15px]"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors duration-200"
                      aria-label="Submit search"
                    >
                      <Search size={20} strokeWidth={2} />
                    </button>
                  </form>

                  {/* Desktop Live Results Dropdown */}
                  {searchQuery.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50">
                      {liveResults.length > 0 ? (
                        <>
                          <ul>
                            {liveResults.map(p => {
                              const imgUrl = getImageUrl(p.images?.[0]);
                              return (
                                <li key={p._id} className="border-b border-slate-50 last:border-0">
                                  <button
                                    onClick={() => handleResultClick(p._id)}
                                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                                  >
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                      {imgUrl ? (
                                        <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <ShoppingBag size={16} className="text-slate-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-sm text-slate-900 truncate">{p.name}</p>
                                      <p className="text-xs text-slate-500 truncate">{p.category}</p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-500 shrink-0">₹{p.variants?.[0]?.price}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                          <button
                            onClick={handleSearch}
                            className="w-full text-center py-3 bg-slate-50 font-bold text-[11px] uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors border-t border-slate-100"
                          >
                            View all results for &quot;{searchQuery}&quot;
                          </button>
                        </>
                      ) : (
                        <div className="px-4 py-5 text-center text-sm text-slate-400 font-medium">
                          No products found for &quot;{searchQuery}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setIsSearchOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
                  aria-label="Close search"
                >
                  <X size={24} strokeWidth={2} />
                </motion.button>



                {/* Cart Icon */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link
                    href="/cart"
                    className="relative w-10 h-10 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
                    aria-label="Cart"
                  >
                    <ShoppingBag size={24} strokeWidth={2} className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>

                {/* Profile Icon */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/profile"
                    className="w-10 h-10 flex items-center justify-center text-slate-900 hover:text-blue-500 transition-colors duration-200"
                    aria-label="Account"
                  >
                    <User size={24} strokeWidth={2} className="w-6 h-6" />
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 right-0 bg-white border-b border-slate-200 px-6 py-4 md:hidden shadow-lg z-40"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-slate-50 border-2 border-blue-500 rounded-full pl-5 pr-12 py-2.5 text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                  aria-label="Submit search"
                >
                  <Search size={20} strokeWidth={2} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-500 p-2"
              >
                <X size={24} />
              </button>
            </form>

            {/* Mobile Live Results Dropdown */}
            {searchQuery.trim().length > 0 && (
              <div className="mt-4 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                {liveResults.length > 0 ? (
                  <>
                    <ul>
                      {liveResults.map(p => {
                        const imgUrl = getImageUrl(p.images?.[0]);
                        return (
                          <li key={p._id} className="border-b border-slate-50 last:border-0">
                            <button
                              onClick={() => handleResultClick(p._id)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                            >
                              <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                {imgUrl ? (
                                  <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <ShoppingBag size={16} className="text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-slate-900 truncate">{p.name}</p>
                                <p className="text-xs text-slate-500">{p.category}</p>
                              </div>
                              <span className="text-xs font-bold text-blue-500 shrink-0">₹{p.variants?.[0]?.price}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      onClick={handleSearch}
                      className="w-full text-center py-3 bg-slate-50 font-bold text-xs text-blue-600 hover:text-blue-700 transition-colors border-t border-slate-100"
                    >
                      View all results for &quot;{searchQuery}&quot;
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-4 text-center text-sm text-slate-400 font-medium">
                    No products found
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-24 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-30 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-2">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans font-bold text-base tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors py-3 border-b border-slate-100"
              >
                SHOP
              </Link>
              <Link
                href="/contact-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans font-bold text-base tracking-[0.15em] uppercase text-slate-900 hover:text-blue-500 transition-colors py-3"
              >
                CONTACT
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
