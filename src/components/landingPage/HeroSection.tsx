"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface IBanner {
  _id: string;
  title: string;
  description: string;
  image: string;
  status: string;
}

const DEFAULT_SLIDES = [
  {
    id: "default-1",
    image: "/hero-bg.png",
    alt: "Premium skincare dynamic hydration",
    headline: "DYNAMIC HYDRATION",
    subheadline: "Sweat-resistant, feather-light, invisible finish.",
  },
];

export default function HeroSection() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
          : "http://localhost:5000";
        const res = await axios.get(`${baseUrl}/api/v1/banners`);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const activeBanners: IBanner[] = res.data.data.filter(
            (b: IBanner) => b.status === "ACTIVE"
          );
          if (activeBanners.length > 0) {
            const mapped = activeBanners.map((b) => ({
              id: b._id,
              image: b.image.startsWith("/")
                ? `${baseUrl}${b.image}`
                : b.image,
              alt: b.title,
              headline: b.title,
              subheadline: b.description,
            }));
            setSlides(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
        // Keep default slides on error
      }
    };
    fetchBanners();
  }, []);

  // Preloader timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isLoading, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-black"
      aria-label="Hero section"
    >
      {/* Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          >
            <h1 className="text-black font-sans font-black text-6xl md:text-8xl tracking-[0.2em] uppercase mb-8">
              HEEDY
            </h1>
            <div className="w-64 md:w-80 h-[2px] bg-slate-100 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-blue-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background & Content Layer */}
      <AnimatePresence mode="sync">
        {slides.map((slide, index) =>
          index === currentSlide ? (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 overflow-hidden"
              style={{ willChange: "opacity" }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 10, ease: "easeOut" }}
                className="absolute inset-0 origin-center"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0 || index === 1}
                  loading={index === 0 || index === 1 ? undefined : "lazy"}
                  className="object-cover"
                  unoptimized={slide.image.startsWith("http://localhost")}
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/20" /> {/* overlay */}

              {/* Content specific to this slide */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                {/* Optional Eyebrow */}
                <p className="mb-4 text-blue-300 font-sans font-semibold text-xs tracking-[0.2em] uppercase pointer-events-auto">
                  PREMIUM SKINCARE
                </p>

                {/* Headline */}
                <h1 className="mb-6 text-white drop-shadow-sm font-sans font-normal text-4xl md:text-6xl lg:text-8xl tracking-[0.2em] md:tracking-[0.2em] uppercase pointer-events-auto">
                  {slide.headline}
                </h1>

                {/* Subheadline */}
                <p className="mb-10 text-white/90 max-w-xl font-sans font-normal text-base md:text-lg lg:text-xl tracking-wide pointer-events-auto">
                  {slide.subheadline}
                </p>

                {/* CTA */}
                <Link
                  href="/products"
                  className="bg-white text-gray-900 px-8 py-3 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-full font-sans font-semibold text-sm tracking-widest uppercase border-2 border-transparent hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-500 hover:text-black hover:border-white hover:scale-105 transition-all duration-200 motion-reduce:transition-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pointer-events-auto inline-block"
                >
                  SHOP NOW
                </Link>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Navigation Layer - show only if multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                role="tab"
                aria-selected={currentSlide === index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`transition-colors duration-300 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${
                  currentSlide === index
                    ? "w-2.5 h-2.5 rounded-full bg-blue-500"
                    : "w-2.5 h-2.5 rounded-full bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
