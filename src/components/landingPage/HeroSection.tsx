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
  mobileImage?: string;
  status: string;
}

interface ISlide {
  id: string;
  image: string;
  mobileImage: string | null;
  alt: string;
  headline: string;
  subheadline: string;
}

const DEFAULT_SLIDES: ISlide[] = [
  {
    id: "default-1",
    image: "/hero-bg.png",
    mobileImage: "/hero-bg.png",
    alt: "Premium skincare dynamic hydration",
    headline: "DYNAMIC HYDRATION",
    subheadline: "Sweat-resistant, feather-light, invisible finish.",
  },
];

export default function HeroSection() {
  const [allSlides, setAllSlides] = useState<ISlide[]>(DEFAULT_SLIDES);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Only run on client side
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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
              mobileImage: b.mobileImage
                ? (b.mobileImage.startsWith("/") ? `${baseUrl}${b.mobileImage}` : b.mobileImage)
                : null,
              alt: b.title,
              headline: b.title,
              subheadline: b.description,
            }));
            setAllSlides(mapped);
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

  // Filter slides dynamically based on screen size
  const displaySlides = allSlides.filter(slide => {
    if (slide.id.startsWith("default-")) return true;
    return isMobile ? !!slide.mobileImage : true;
  });

  const finalSlides = displaySlides.length > 0 ? displaySlides : DEFAULT_SLIDES;

  useEffect(() => {
    if (currentSlide >= finalSlides.length) {
      setCurrentSlide(0);
    }
  }, [finalSlides.length, currentSlide]);

  useEffect(() => {
    if (isLoading || finalSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isLoading, finalSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % finalSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? finalSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-black touch-pan-y"
      aria-label="Hero section"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleTouchEnd}
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
        {finalSlides.map((slide, index) =>
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
                <div className="hidden md:block absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={index === 0 || index === 1}
                    sizes="100vw"
                    loading={index === 0 || index === 1 ? undefined : "lazy"}
                    className="object-cover"
                    unoptimized={slide.image.startsWith("http://localhost")}
                  />
                </div>
                <div className="block md:hidden absolute inset-0">
                  <Image
                    src={slide.mobileImage || slide.image}
                    alt={slide.alt}
                    fill
                    priority={index === 0 || index === 1}
                    sizes="100vw"
                    loading={index === 0 || index === 1 ? undefined : "lazy"}
                    className="object-cover object-center"
                    unoptimized={(slide.mobileImage || slide.image).startsWith("http://localhost")}
                  />
                </div>
              </motion.div>
              <div className="absolute inset-0 bg-black/20" /> {/* overlay */}

              {/* Content specific to this slide */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">

                {/* Headline */}
                <h1 className="mb-6 text-white drop-shadow-sm font-sans font-normal text-4xl md:text-6xl lg:text-8xl tracking-[0.2em] md:tracking-[0.2em] uppercase pointer-events-auto">
                  {slide.headline}
                </h1>

                {/* Subheadline */}
                <p className="mb-10 text-white/90 max-w-xl font-sans font-normal text-base md:text-lg lg:text-xl tracking-wide pointer-events-auto">
                  {slide.subheadline}
                </p>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Navigation Layer - show only if multiple slides */}
      {finalSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black z-20"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black z-20"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
            {finalSlides.map((slide, index) => (
              <button
                key={slide.id}
                role="tab"
                aria-selected={currentSlide === index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`transition-colors duration-300 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${currentSlide === index
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
