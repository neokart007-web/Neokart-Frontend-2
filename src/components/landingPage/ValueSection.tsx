"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ValueSection() {
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
    <section ref={sectionRef} className="bg-[#0A1E3D] w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Image Panel */}
          <div 
            className={`relative rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/20 aspect-[4/5] lg:aspect-square w-full transition-all duration-700 ease-out group motion-reduce:transition-none motion-reduce:transform-none ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
            }`}
          >
            <Image
              src="/images/value-image.jpg"
              alt="Curology moisturizer product on geometric platform"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3D]/30 to-transparent pointer-events-none" />
          </div>

          {/* Content Panel */}
          <div className="flex flex-col justify-center">
            
            <p 
              className={`font-sans font-semibold text-xs md:text-sm tracking-[0.25em] uppercase text-blue-300 mb-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              OUR SCIENTIFIC HERITAGE
            </p>
            
            <h2 
              className={`font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              Why Choose <span className="italic">Heedy</span>
            </h2>
            
            <p 
              className={`font-sans font-normal text-base md:text-lg text-slate-400 leading-relaxed max-w-lg mb-12 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              We combine Alpine botanical purity with advanced dermatological science to create sun protection that feels like a second skin.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              
              {/* Feature 1 */}
              <div 
                className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <h3 className="font-sans font-bold text-sm md:text-base tracking-[0.15em] uppercase text-white mb-3">
                  SWISS BIO-ACTIVE
                </h3>
                <p className="font-sans font-normal text-xs md:text-sm tracking-wide uppercase text-slate-500 leading-relaxed">
                  CLINICALLY PROVEN TO REDUCE CELLULAR OXIDATION BY 85%.
                </p>
              </div>

              {/* Feature 2 */}
              <div 
                className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
                }`}
                style={{ transitionDelay: "700ms" }}
              >
                <h3 className="font-sans font-bold text-sm md:text-base tracking-[0.15em] uppercase text-white mb-3">
                  OCEAN SAFE
                </h3>
                <p className="font-sans font-normal text-xs md:text-sm tracking-wide uppercase text-slate-500 leading-relaxed">
                  100% REEF-FRIENDLY FILTERS WITH ZERO MICROPLASTICS.
                </p>
              </div>

            </div>

            {/* CTA Button */}
            <Link
              href="/process"
              aria-label="Discover our scientific process and product development"
              className={`mt-10 self-start bg-white text-[#0A1E3D] px-8 md:px-10 py-4 md:py-5 rounded-full font-sans font-bold text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-slate-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0A1E3D] motion-reduce:transition-none motion-reduce:transform-none ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              DISCOVER OUR PROCESS
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
