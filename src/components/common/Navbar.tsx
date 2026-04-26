"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 px-6 lg:px-12 flex items-center justify-between ${
        scrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      {/* Left: Logo */}
      <Link href="/" className="flex items-center">
        <div className="relative w-32 h-10 md:w-40 md:h-12">
          <Image
            src="/logo.png"
            alt="HEEDY Logo"
            fill
            sizes="(max-width: 768px) 128px, 160px"
            className="object-contain object-left"
            priority
          />
        </div>
      </Link>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
        <Link href="/products" className="font-sans font-bold text-sm tracking-widest uppercase hover:text-blue-600 transition-colors text-gray-900">
          SHOP
        </Link>
        <Link href="/contact" className="font-sans font-bold text-sm tracking-widest uppercase hover:text-blue-600 transition-colors text-gray-900">
          CONTACT
        </Link>
      </nav>

      {/* Right: Utility Icons */}
      <div className="flex items-center gap-6 text-gray-900">
        <button className="flex items-center gap-2 hover:text-blue-600 transition-colors group" aria-label="Search">
          <Search size={20} strokeWidth={2} />
          <span className="hidden lg:inline font-sans font-bold text-sm tracking-widest uppercase group-hover:text-blue-600">SEARCH</span>
        </button>
        <button className="hover:text-blue-600 transition-colors" aria-label="Account">
          <User size={20} strokeWidth={2} />
        </button>
        <button className="relative hover:text-blue-600 transition-colors" aria-label="Cart">
          <ShoppingBag size={20} strokeWidth={2} />
          <span className="absolute -top-1.5 -right-2 bg-[#1E40AF] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white">
            0
          </span>
        </button>
      </div>
    </header>
  );
}
