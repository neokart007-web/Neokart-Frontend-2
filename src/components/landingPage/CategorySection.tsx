"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";

const DEFAULT_CATEGORIES = [
  {
    id: 'skin-care',
    label: 'Skin Care',
    image: '/images/skin-care.jpg',
    alt: 'Skin Care category featuring moisturizing brightening sunscreen',
    count: 24,
  },
  {
    id: 'lip-care',
    label: 'Lip Care',
    image: '/images/lip-care.jpg',
    alt: 'Lip Care category featuring nourished glossy lips',
    count: 18,
  },
  {
    id: 'body-care',
    label: 'Body Care',
    image: '/images/body-care.jpg',
    alt: 'Body Care category featuring luxurious body cream application',
    count: 32,
  },
];

export default function CategorySection() {
  const [categories, setCategories] = useState<typeof DEFAULT_CATEGORIES>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
          : 'http://localhost:5000';
        // Fetch categories and products together so we can count products per category
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${baseUrl}/api/v1/categories`),
          axios.get(`${baseUrl}/api/v1/products`),
        ]);

        const products: { category?: string }[] = prodRes.data?.data || [];
        const countForCategory = (name: string) =>
          products.filter(
            (p) => (p.category || '').trim().toLowerCase() === name.trim().toLowerCase()
          ).length;

        if (catRes.data.success && catRes.data.data) {
          const activeCats = catRes.data.data.filter((c: any) => c.status === 'ACTIVE').slice(0, 6);

          if (activeCats.length > 0) {
            const formatted = activeCats.map((c: any, index: number) => ({
              id: c.name.toLowerCase().replace(/\s+/g, '-'),
              label: c.name,
              image: c.image || DEFAULT_CATEGORIES[index % 3].image,
              alt: `${c.name} category`,
              count: countForCategory(c.name),
            }));
            setCategories(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] pt-20 md:pt-28 pb-6 md:pb-8 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Category circles list */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 md:gap-8 justify-items-center">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              aria-label={`Browse ${category.label}`}
              className={`group flex flex-col items-center text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#593dab] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-xl p-1 motion-reduce:transition-none motion-reduce:transform-none ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Circular image container - thin blue/sky border with light background */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[1.5px] border-sky-400 bg-sky-50 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-sky-500 shadow-sm">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  priority={index < 3}
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                  className="object-cover rounded-full p-0.5"
                />
              </div>

              {/* Category Name */}
              <span className="mt-3 font-sans font-bold text-xs sm:text-sm md:text-base text-white/90 group-hover:text-sky-400 transition-colors leading-tight line-clamp-2">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
