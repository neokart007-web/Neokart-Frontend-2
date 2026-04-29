"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Share2, Camera, MessageCircle, PlayCircle, Heart } from "lucide-react";

const shopLinks = [
  { label: "Skin Care Essentials", href: "/collections/skin-care" },
  { label: "Elite Face Care", href: "/collections/face-care" },
  { label: "Luxe Lips", href: "/collections/lips" },
  { label: "Radiant Eyes", href: "/collections/eyes" },
  { label: "All Products", href: "/products" },
];

const careLinks = [
  { label: "Contact Us", href: "/contact-us" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "About Us", href: "/about" },
];

const contacts = [
  {
    icon: MapPin,
    label: "VISIT US",
    value: "Heedy Sajin Land, Kadakkavoor\nThiruvanathapuram, Kerala",
    href: "https://maps.google.com",
  },
  {
    icon: Phone,
    label: "CALL US",
    value: "+91 9074881551",
    href: "tel:+919074881551",
  },
  {
    icon: Mail,
    label: "EMAIL DIRECTLY",
    value: "infoheedy@gmail.com",
    href: "mailto:infoheedy@gmail.com",
  },
];

const socials = [
  { icon: Share2, label: "Visit our Facebook", href: "#" },
  { icon: Camera, label: "Visit our Instagram", href: "#" },
  { icon: MessageCircle, label: "Visit our Twitter", href: "#" },
  { icon: PlayCircle, label: "Visit our YouTube", href: "#" },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-sans font-bold text-sm tracking-[0.15em] uppercase text-slate-900">
        {children}
      </h3>
      <div className="w-8 h-1 bg-blue-500 rounded-full mt-2" />
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 w-full border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-20 pb-8">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16">

          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="inline-flex items-center mb-6" aria-label="HEEDY brand logo">
              <div className="relative w-52 h-14">
                <Image
                  src="/logo.jpg"
                  alt="HEEDY Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="font-sans font-normal text-base text-slate-500 leading-relaxed mb-8 max-w-sm">
              Redefining high-end beauty. Our carefully curated collections are designed to elevate your everyday routines to extraordinary premium experiences.
            </p>
            <div className="flex gap-3 flex-wrap">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Shop Collections */}
          <div>
            <ColumnTitle>SHOP COLLECTIONS</ColumnTitle>
            <ul className="space-y-4">
              {shopLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-sans font-normal text-base text-slate-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Client Care */}
          <div>
            <ColumnTitle>CLIENT CARE</ColumnTitle>
            <ul className="space-y-4">
              {careLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-sans font-normal text-base text-slate-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Get In Touch */}
          <div>
            <ColumnTitle>GET IN TOUCH</ColumnTitle>
            <ul className="space-y-6">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    rel="noopener noreferrer"
                    aria-label={`${label}: ${value}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                      <Icon size={18} className="text-blue-500" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-slate-500 mb-1">
                        {label}
                      </p>
                      <p className="font-sans font-medium text-sm text-slate-900 whitespace-pre-line leading-relaxed">
                        {value}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans font-normal text-sm text-slate-500 flex items-center gap-1.5">
            © {year} Our Brand. Crafted with{" "}
            <Heart size={14} className="text-blue-500 fill-blue-500 inline" />{" "}
            for you.
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-2">
                <Link
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-sans font-normal text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200"
                >
                  {item}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-slate-300 select-none">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
