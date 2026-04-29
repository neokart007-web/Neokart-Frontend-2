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
    <section ref={sectionRef} className="bg-white pt-20 md:pt-28 lg:pt-32 w-full">
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

      {/* Category Grid with Names Below */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-100">
        {categories.map((category, index) => (
          <div key={category.id} className="flex flex-col">
            <Link 
              href={`/products?category=${category.id}`}
              aria-label={`Browse ${category.label}`}
              className={`group relative overflow-hidden aspect-square lg:aspect-[4/3] block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
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
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 motion-reduce:transition-none" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative overflow-hidden py-2">
                  <h3 className="font-serif font-normal text-3xl md:text-4xl lg:text-5xl text-white tracking-wide">
                    {category.label}
                  </h3>
                  <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-white transition-all duration-500 ease-out group-hover:w-full group-hover:left-0" />
                </div>
              </div>
            </Link>

            <div 
              className={`py-6 md:py-8 flex justify-center items-center transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Link href={`/products?category=${category.id}`} className="font-sans font-bold text-xs tracking-[0.2em] uppercase text-slate-400 hover:text-blue-600 transition-colors duration-300">
                {category.label}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
