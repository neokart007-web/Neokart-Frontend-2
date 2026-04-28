"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Star, StarHalf } from "lucide-react";

interface Product {
  id: string;
  name: string;
  images: string[];
  rating: number;
  reviewCount: number;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  dealBadge: string;
  benefit: string;
}

const products: Product[] = [
  {
    id: "brightening-suncream",
    name: "Brightening Suncream",
    images: ["/products/suncream-1.jpg", "/products/suncream-2.jpg"],
    rating: 5,
    reviewCount: 500,
    currentPrice: 100,
    originalPrice: 299,
    currency: "₹",
    dealBadge: "FLAT 10% OFF",
    benefit: "Brightens Skin"
  },
  {
    id: "deconstruct-lip-balm",
    name: "Deconstruct Brightening Lip Balm with SPF 30",
    images: ["/products/lip-balm-1.jpg", "/products/lip-balm-2.jpg"],
    rating: 5,
    reviewCount: 300,
    currentPrice: 100,
    originalPrice: 200,
    currency: "₹",
    dealBadge: "EXCLUSIVE DEAL",
    benefit: "SPF 30 protection"
  },
  {
    id: "chemist-body-wash",
    name: "Chemist at Play Exfoliating Body Wash",
    images: ["/products/body-wash-1.jpg", "/products/body-wash-2.jpg"],
    rating: 4,
    reviewCount: 0,
    currentPrice: 299,
    originalPrice: 399,
    currency: "₹",
    dealBadge: "EXCLUSIVE DEAL",
    benefit: "Tan & Uneven Skin Tone, Bumps & Rough Te..."
  },
  {
    id: "underarm-roll",
    name: "Underarm Roll",
    images: ["/products/underarm-1.jpg", "/products/underarm-2.jpg"],
    rating: 5,
    reviewCount: 400,
    currentPrice: 999,
    originalPrice: 1199,
    currency: "₹",
    dealBadge: "FLAT 20% OFF",
    benefit: "Fragrance & Aluminium Free"
  },
  {
    id: "test-product",
    name: "Test3",
    images: ["/products/test-1.jpg", "/products/test-2.jpg"],
    rating: 4,
    reviewCount: 200,
    currentPrice: 299,
    originalPrice: 399,
    currency: "₹",
    dealBadge: "EXCLUSIVE DEAL",
    benefit: "test"
  }
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) {
      return <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
    }
    if (i === Math.floor(rating) && rating % 1 !== 0) {
      return <StarHalf key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
    }
    return <Star key={i} className="w-4 h-4 fill-slate-200 text-slate-200" />;
  });
};

function ProductCard({ product, isVisible, index }: { product: Product; isVisible: boolean; index: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [product.images.length]);

  return (
    <article 
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 group w-[280px] md:w-auto flex-shrink-0 snap-start h-full flex flex-col motion-reduce:transition-none motion-reduce:transform-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl overflow-hidden">
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-[3/4] bg-slate-50 flex-shrink-0">
          {product.images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`${product.name} product image ${i + 1}`}
              fill
              loading={index > 2 ? "lazy" : "eager"}
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 33vw, 20vw"
              className={`object-cover transition-opacity duration-400 motion-reduce:transition-none group-hover:scale-105 group-hover:duration-500 ${
                i === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Carousel Dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {product.images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 motion-reduce:transition-none ${
                    i === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="px-4 pt-4 pb-3 flex flex-col flex-grow">
          <div className="flex items-center justify-center gap-0.5 mb-2" aria-label={`${product.rating} out of 5 stars`}>
            {renderStars(product.rating)}
            <span className="text-sm font-medium text-slate-400 ml-1">({product.reviewCount})</span>
          </div>
          
          <h3 className="font-sans font-bold text-base md:text-lg text-slate-900 leading-tight text-center mb-3 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-2" aria-label={`Sale price ${product.currentPrice}, original price ${product.originalPrice}`}>
            <span className="font-sans font-bold text-xl md:text-2xl text-slate-900">
              {product.currency}{product.currentPrice}
            </span>
            <span className="font-sans font-normal text-sm text-slate-400 line-through">
              {product.currency}{product.originalPrice}
            </span>
          </div>

          <div className="text-red-600 font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider text-center mb-1">
            {product.dealBadge}
          </div>

          <p className="font-sans font-normal text-xs text-slate-500 text-center line-clamp-1">
            {product.benefit}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-6">
        <button 
          className="w-full bg-slate-900 text-white font-sans font-bold text-[10px] md:text-xs uppercase tracking-widest py-3 rounded-full hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ADD TO CART
        </button>
      </div>
    </article>
  );
}

export default function ProductSection() {
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
    <section ref={sectionRef} className="bg-white pt-10 md:pt-16 pb-16 md:pb-24 w-full">
      {/* Section Header */}
      <div className="text-center px-6">
        <h2 
          className={`font-sans font-black text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] uppercase text-slate-900 mb-4 transition-all duration-600 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          OUR PRODUCTS
        </h2>
        <div 
          className={`w-20 h-1 bg-slate-900 mx-auto mt-4 mb-12 md:mb-16 transition-transform duration-500 delay-200 origin-center motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>

      {/* Product Grid */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 snap-x snap-mandatory pb-4 md:pb-0 hide-scrollbar">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isVisible={isVisible} 
              index={index} 
            />
          ))}
        </div>
      </div>

      {/* View All Products Button */}
      <div className="flex justify-center mt-12 md:mt-16 px-6">
        <Link 
          href="/products" 
          className="border border-slate-900 text-slate-900 font-sans font-bold text-xs md:text-sm uppercase tracking-widest py-4 px-12 hover:bg-slate-900 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          VIEW ALL PRODUCTS
        </Link>
      </div>
    </section>
  );
}
