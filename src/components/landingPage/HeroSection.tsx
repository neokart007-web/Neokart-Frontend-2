"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { id: 1, image: "/hero-bg.png" },
  { id: 2, image: "/hero-bg.png" },
  { id: 3, image: "/hero-bg.png" },
];

export default function HeroSection() {
  // Started at 2 (3rd slide) per the image description
  const [currentSlide, setCurrentSlide] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section 
      className="relative w-full h-screen overflow-hidden animate-fade-in motion-reduce:animate-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt="Beach background with Aura skincare product"
            fill
            priority={index === 2} // priority for initial slide since we start on 3rd
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="mb-6 text-white drop-shadow-sm font-sans font-thin text-4xl md:text-6xl lg:text-8xl tracking-[0.2em] md:tracking-[0.2em] uppercase">
          DYNAMIC HYDRATION
        </h1>
        <p className="mb-10 text-white/90 max-w-xl font-sans font-normal text-lg md:text-xl tracking-wide">
          Sweat-resistant, feather-light, invisible finish.
        </p>
        <button className="bg-white text-gray-900 px-10 py-4 rounded-full font-sans font-semibold text-sm tracking-widest uppercase hover:bg-gray-100 hover:scale-105 transition-all duration-300 motion-reduce:transition-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          SHOP NOW
        </button>
      </div>

      {/* Carousel Controls */}
      <button 
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center text-white hover:bg-white/30 transition motion-reduce:transition-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center text-white hover:bg-white/30 transition motion-reduce:transition-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-colors duration-300 motion-reduce:transition-none ${
              currentSlide === index
                ? "w-2.5 h-2.5 rounded-full bg-blue-600"
                : "w-2.5 h-2.5 rounded-full bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
