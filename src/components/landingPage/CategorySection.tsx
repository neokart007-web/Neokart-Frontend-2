"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const categories = [
  {
    id: 'skin-care',
    label: 'Skin Care',
    image: '/images/skin-care.jpg',
    alt: 'Skin Care category featuring moisturizing brightening sunscreen'
  },
  {
    id: 'lip-care',
    label: 'Lip Care',
    image: '/images/lip-care.jpg',
    alt: 'Lip Care category featuring nourished glossy lips'
  },
  {
    id: 'body-care',
    label: 'Body Care',
    image: '/images/body-care.jpg',
    alt: 'Body Care category featuring luxurious body cream application'
  }
];

export default function CategorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="bg-white py-20 md:py-28 lg:py-32 w-full">
      {/* Section Header */}
      <div className="text-center px-6 md:px-12 max-w-4xl mx-auto mb-16 md:mb-20">
        <p 
          className={`font-sans font-semibold text-xs tracking-[0.3em] uppercase text-blue-800 mb-4 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          THE CURATED SELECTION
        </p>
        <h2 
          className={`font-serif font-normal text-4xl md:text-5xl lg:text-7xl text-slate-900 leading-tight mb-6 transition-all duration-700 delay-100 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Sensory Categories
        </h2>
        <p 
          className={`font-sans font-normal text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto transition-all duration-700 delay-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Explore our world of high-performance luxury cosmetics, where science meets sensory indulgence.
        </p>
      </div>

      {/* Category Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0">
        {categories.map((category, index) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.id}`}
            aria-label={`Browse ${category.label}`}
            className={`group relative overflow-hidden aspect-[4/5] lg:aspect-[3/4] block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <Image
              src={category.image}
              alt={category.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-500 motion-reduce:transition-none" />
            <h3 className="absolute bottom-6 left-6 md:bottom-10 md:left-10 font-serif font-normal text-2xl md:text-3xl lg:text-4xl text-white italic">
              {category.label}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
