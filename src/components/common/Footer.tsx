"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

// Lucide removed brand icons from their core package, so we define them here:
const Facebook = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Twitter = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Youtube = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const contacts = [
  {
    icon: MapPin,
    label: "VISIT US",
    value: "Neokart Sajin Land, Kadakkavoor\nThiruvanathapuram, Kerala",
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
    value: "neokart007@gmail.com",
    href: "mailto:neokart007@gmail.com",
  },
];

const socials = [
  { icon: Facebook, label: "Visit our Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Visit our Instagram", href: "https://instagram.com" },
  { icon: Twitter, label: "Visit our Twitter", href: "https://twitter.com" },
  { icon: Youtube, label: "Visit our YouTube", href: "https://youtube.com" },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-sans font-bold text-sm tracking-[0.15em] uppercase text-white">
        {children}
      </h3>
      <div className="w-8 h-1 bg-white/60 rounded-full mt-2" />
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [shopLinks, setShopLinks] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
          : 'http://localhost:5000';
        const res = await axios.get(`${baseUrl}/api/v1/categories`);
        if (res.data.success && res.data.data) {
          const active = res.data.data
            .filter((c: any) => c.status === 'ACTIVE')
            .slice(0, 6);
          setShopLinks(
            active.map((c: any) => ({
              label: c.name,
              href: `/products?category=${c.name.toLowerCase().replace(/\s+/g, '-')}`,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch footer categories', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-[#aea3cf]/95 w-full border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-6 md:pt-8 pb-5">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-4"> 
            <Link href="/" className="inline-flex items-center mb-6" aria-label="NEOKART brand logo">
              <div className="relative w-52 h-16">
                <Image
                  src="/logo.png"
                  alt="Neokart Logo"
                  fill
                  sizes="(max-width: 640px) 208px, 208px"
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="font-sans font-normal text-base text-white/70 leading-relaxed mb-8 max-w-sm">
              Redefining high-end gadgets. Our carefully curated collections are designed to bring you the cutting edge of futuristic technology and smart lifestyle devices.
            </p>
            <div className="flex gap-3 flex-wrap">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/80 hover:border-white hover:text-white hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                >
                  <Icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section (Side by side on all screens) */}
          <div className="lg:col-span-4">
            {/* Column 2 — Shop Collections */}
            <div>
              <ColumnTitle>SHOP COLLECTIONS</ColumnTitle>
              <ul className="space-y-4">
                {(shopLinks.length > 0
                  ? shopLinks
                  : [{ label: "All Products", href: "/products" }]
                ).map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans font-normal text-base text-white/70 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4 — Get In Touch */}
          <div className="lg:col-span-4">
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
                    <div className="w-11 h-11 rounded-xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                      <Icon size={18} className="text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-white/60 mb-1">
                        {label}
                      </p>
                      <p className="font-sans font-medium text-sm text-white whitespace-pre-line leading-relaxed">
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
        <div className="mt-8 pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans font-normal text-sm text-white/70 flex items-center gap-1.5">
            © {year} Neokart. Crafted with{" "}
            <Heart size={14} className="text-white fill-white inline" />{" "}
            for you.
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Privacy Policy", "Terms & Conditions"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-2">
                <Link
                  href={item === "Privacy Policy" ? "/privacy-policy" : "/terms-and-conditions"}
                  className="font-sans font-normal text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  {item}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-white/40 select-none">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
