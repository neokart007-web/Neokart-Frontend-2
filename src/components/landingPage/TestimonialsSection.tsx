"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  name: string;
  role: string;
  initial: string;
  imageUrl?: string;
}

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < rating ? "text-blue-400 fill-blue-400" : "text-slate-700 fill-slate-700"}`}
    />
  ));

function TestimonialCard({ testimonial, isVisible, index }: { testimonial: Testimonial; isVisible: boolean; index: number }) {
  return (
    <article
      aria-label={`Testimonial from ${testimonial.name}`}
      className={`relative p-8 md:p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] flex flex-col motion-reduce:transition-none motion-reduce:transform-none ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      style={{ transitionDelay: `${300 + index * 150}ms` }}
    >
      {/* Header: Stars + Quote Icon */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
          {renderStars(testimonial.rating)}
        </div>
        {/* Decorative Quote Icon */}
        <svg
          aria-hidden="true"
          className="w-10 h-10 text-white/[0.08] flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.5C7.5 12.07 9.07 10.5 11 10.5L10 8zm14 0c-3.314 0-6 2.686-6 6v10h10V14h-6.5c0-1.93 1.57-3.5 3.5-3.5L24 8z" />
        </svg>
      </div>

      {/* Quote Text */}
      <p className="font-serif font-normal text-lg md:text-xl italic text-slate-300 leading-relaxed mb-8 flex-grow text-left break-words line-clamp-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-8" />

      {/* Author Row */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        {testimonial.imageUrl ? (
          <img
            src={testimonial.imageUrl}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center flex-shrink-0"
            aria-label={`${testimonial.name} profile picture`}
          >
            <span className="text-white font-bold text-lg uppercase">{testimonial.initial}</span>
          </div>
        )}
        {/* Info */}
        <div>
          <p className="font-sans font-bold text-sm tracking-[0.1em] uppercase text-white">
            {testimonial.name}
          </p>
          <p className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-slate-500 mt-0.5">
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
          : "http://localhost:5000";
        const res = await axios.get(`${baseUrl}/api/v1/testimonials`);
        if (res.data.success && res.data.data) {
          const activeOnes = res.data.data.filter(
            (t: any) => t.status === "ACTIVE"
          );
          const mapped = activeOnes.map((t: any) => ({
            id: t._id,
            rating: t.rating,
            quote: t.review,
            name: t.clientName,
            role: t.clientRole,
            initial: t.clientName.charAt(0).toUpperCase(),
            imageUrl: t.imageUrl || "",
          }));
          setTestimonials(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      }
    };
    fetchTestimonials();
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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Also set visible after data loads in case section is already in viewport
  useEffect(() => {
    if (!loading && testimonials.length > 0) {
      setIsVisible(true);
    }
  }, [loading, testimonials.length]);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-[#0A1E3D] w-full py-12 md:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p
            className={`font-sans font-semibold text-xs tracking-[0.25em] uppercase text-blue-300 mb-4 transition-opacity duration-400 ease-out motion-reduce:transition-none ${isVisible ? "opacity-100" : "opacity-0"
              }`}
          >
            CLIENTELE VOICES
          </p>
          <h2
            className={`font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-tight transition-all duration-600 ease-out motion-reduce:transition-none motion-reduce:transform-none ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: "100ms" }}
          >
            Voices of Excellence
          </h2>
        </div>

        {/* Testimonials Marquee (Mobile) */}
        <div className="md:hidden marquee-container flex overflow-hidden relative w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] pb-4">
          <style dangerouslySetInnerHTML={{
            __html: `
             @keyframes marquee {
               0% { transform: translateX(0); }
               100% { transform: translateX(-100%); }
             }
             .animate-marquee {
               animation: marquee 20s linear infinite;
             }
             .marquee-container:hover .animate-marquee {
               animation-play-state: paused;
             }
           `}} />

          <div className="flex shrink-0 gap-6 animate-marquee pr-6">
            {testimonials.map((testimonial, index) => (
              <div key={`m1-${testimonial.id}`} className="w-[85vw] sm:w-[60vw] flex-shrink-0">
                <TestimonialCard testimonial={testimonial} isVisible={isVisible} index={index} />
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-6 animate-marquee pr-6" aria-hidden="true">
            {testimonials.map((testimonial, index) => (
              <div key={`m2-${testimonial.id}`} className="w-[85vw] sm:w-[60vw] flex-shrink-0">
                <TestimonialCard testimonial={testimonial} isVisible={isVisible} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid (Desktop) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
