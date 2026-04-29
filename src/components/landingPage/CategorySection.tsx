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
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth >= 768) return;
      
      const container = scrollRef.current;
      if (container) {
        const nextIndex = (currentIndexRef.current + 1) % categories.length;
        const scrollBehavior = nextIndex === 0 ? 'auto' : 'smooth';
        
        currentIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        container.scrollTo({
          left: currentIndexRef.current * container.clientWidth,
          behavior: scrollBehavior
        });
      }
    }, 3000);

    const handleScroll = () => {
      if (scrollRef.current && window.innerWidth < 768) {
        const index = Math.round(
          scrollRef.current.scrollLeft / scrollRef.current.clientWidth
        );
        currentIndexRef.current = index;
        setActiveIndex(index);
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      clearInterval(interval);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
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
    <section ref={sectionRef} className="bg-white pt-12 md:pt-20 lg:pt-24 w-full">
      {/* Section Header */}
      <div className="text-center px-6 md:px-12 max-w-4xl mx-auto mb-8 md:mb-16">
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
      <div 
        ref={scrollRef}
        className="w-full flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-0 md:gap-6 px-0 md:px-6 pb-4 border-b border-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category, index) => (
          <div key={category.id} className="w-full flex-shrink-0 snap-center flex flex-col md:w-auto md:flex-shrink md:snap-align-none px-6 md:px-0 py-4 md:py-0">
            {/* Mobile Card Layout (New Style) */}
            <Link 
              href={`/products?category=${category.id}`}
              aria-label={`Browse ${category.label}`}
              className={`md:hidden group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none shadow-xl shadow-black/10 ${
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
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none" />
              
              {/* Content Box */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center justify-end gap-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h3 className="font-serif font-normal text-4xl text-white tracking-wide text-center drop-shadow-sm">
                  {category.label}
                </h3>
                
                <span className="px-6 py-2.5 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white text-xs font-sans tracking-[0.15em] uppercase font-bold shadow-lg transition-colors group-hover:bg-white/35">
                  Explore Collection
                </span>
              </div>
            </Link>

            {/* Desktop Card Layout (Original Style) */}
            <Link 
              href={`/products?category=${category.id}`}
              aria-label={`Browse ${category.label}`}
              className={`hidden md:block group relative overflow-hidden aspect-square lg:aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
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
              className={`hidden md:flex py-6 md:py-8 justify-center items-center transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
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

      {/* Pagination Dots (Mobile Only) */}
      <div className="flex justify-center items-center gap-2 mt-2 pb-2 md:hidden">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({
                  left: index * scrollRef.current.clientWidth,
                  behavior: 'smooth'
                });
                setActiveIndex(index);
                currentIndexRef.current = index;
              }
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'bg-blue-300 w-4' : 'bg-blue-100/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
