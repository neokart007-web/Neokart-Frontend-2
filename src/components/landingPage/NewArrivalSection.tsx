"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowRight, Check } from "lucide-react";
import { cldOptimize } from "../../lib/image";

interface NewArrival {
  id: string;
  name: string;
  description: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  features: string[];
}

export default function NewArrivalSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [item, setItem] = useState<NewArrival | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
          : "http://localhost:5000";
        const res = await axios.get(`${baseUrl}/api/v1/products`);
        if (res.data.success && res.data.data) {
          // Products come back newest-first; the first flagged one is the latest arrival.
          const found = res.data.data.find((p: any) => p.showAsNewArrival === true);
          if (found) {
            setItem({
              id: found._id,
              name: found.name,
              description: found.description || "",
              image:
                found.images && found.images.length > 0
                  ? found.images[0]
                  : "/products/suncream-1.jpg",
              currentPrice: found.variants?.[0]?.price || 0,
              originalPrice: found.variants?.[0]?.oldPrice || 0,
              currency: "₹",
              features: found.keyFeatures
                ? found.keyFeatures
                    .split(/,|\n/)
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                    .slice(0, 3)
                : [],
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch new arrival", err);
      }
    };
    fetchNewArrival();
  }, []);

  // Runs once the product loads (the section only mounts then, so the ref exists here).
  useEffect(() => {
    if (!item) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [item]);

  // No product flagged as new arrival — don't render an empty section
  if (!item) return null;

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-12 md:py-20 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* ── Image ── */}
          <div
            className={`relative transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative aspect-square w-full max-w-lg mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-white/10">
              <Image
                src={cldOptimize(item.image, 900)}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                priority
                unoptimized
                className="object-cover"
              />
            </div>
          </div>

          {/* ── Content ── */}
          <div
            className={`flex flex-col transition-all duration-700 delay-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Eyebrow */}
            <p className="font-sans font-bold text-xs md:text-sm tracking-[0.25em] uppercase text-[#a78bda] mb-4">
              New Arrival
            </p>

            {/* Name */}
            <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-5">
              {item.name}
            </h2>

            {/* Description */}
            {item.description && (
              <p className="font-sans text-sm md:text-base text-white/60 leading-relaxed max-w-xl mb-7 line-clamp-4">
                {item.description}
              </p>
            )}

            {/* Feature bullets */}
            {item.features.length > 0 && (
              <ul className="flex flex-col gap-3 mb-9">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#593dab]/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#a78bda]" strokeWidth={3} />
                    </span>
                    <span className="font-sans text-sm md:text-base text-white/80 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-5">
              <Link
                href={`/products/${item.id}`}
                className="group inline-flex items-center gap-2.5 bg-[#593dab] hover:bg-[#4a3391] text-white font-sans font-bold text-sm uppercase tracking-widest py-4 px-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#593dab] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
