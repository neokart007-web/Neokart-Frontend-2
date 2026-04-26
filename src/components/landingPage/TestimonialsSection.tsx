"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  name: string;
  role: string;
  initial: string;
}

const testimonials: Testimonial[] = [
  {
    id: "demo-2",
    rating: 5,
    quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
    name: "DEMO2",
    role: "CLIENT1",
    initial: "D"
  },
  {
    id: "demo",
    rating: 4,
    quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
    name: "DEMO",
    role: "CLIENT",
    initial: "D"
  },
  {
    id: "test-101",
    rating: 5,
    quote: "To Test The client testimonials",
    name: "TEST 101",
    role: "VERIFIED BUYER",
    initial: "T"
  }
];

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
      className={`relative p-8 md:p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] flex flex-col motion-reduce:transition-none motion-reduce:transform-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
      <p className="font-serif font-normal text-lg md:text-xl italic text-slate-300 leading-relaxed mb-8 flex-grow">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-8" />

      {/* Author Row */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center flex-shrink-0"
          aria-label={`${testimonial.name} profile picture`}
        >
          <span className="text-white font-bold text-lg uppercase">{testimonial.initial}</span>
        </div>
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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0A1E3D] w-full py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p
            className={`font-sans font-semibold text-xs tracking-[0.25em] uppercase text-blue-300 mb-4 transition-opacity duration-400 ease-out motion-reduce:transition-none ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            CLIENTELE VOICES
          </p>
          <h2
            className={`font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-tight transition-all duration-600 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Voices of Excellence
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
