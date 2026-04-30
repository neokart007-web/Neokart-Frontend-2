"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Star, StarHalf } from "lucide-react";
import { useCart } from "../../context/CartContext";

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

const DEFAULT_PRODUCTS: Product[] = [];

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
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.currentPrice,
      currency: product.currency,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 group w-[280px] md:w-auto flex-shrink-0 snap-start h-full flex flex-col motion-reduce:transition-none motion-reduce:transform-none ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl overflow-hidden">
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-[3/4] bg-slate-50 flex-shrink-0">
          {product.images.slice(0, 2).map((img, i) => {
            const hasMultipleImages = product.images.length > 1;
            return (
              <Image
                key={i}
                src={img}
                alt={`${product.name} product image ${i + 1}`}
                fill
                loading={index > 2 ? "lazy" : "eager"}
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 33vw, 20vw"
                className={`object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${hasMultipleImages
                  ? i === 0
                    ? "opacity-100 group-hover:opacity-0"
                    : "opacity-0 group-hover:opacity-100"
                  : "opacity-100"
                  }`}
              />
            );
          })}
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
          onClick={handleAddToCart}
          className={`w-full text-white font-sans font-bold text-[10px] md:text-xs uppercase tracking-widest py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isAdded ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"
            }`}
        >
          {isAdded ? "ADDED TO CART" : "ADD TO CART"}
        </button>
      </div>
    </article>
  );
}

export default function ProductSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLandingProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
          : 'http://localhost:5000';
        const res = await axios.get(`${baseUrl}/api/v1/products`);
        if (res.data.success && res.data.data) {
          const landingProds = res.data.data.filter((p: any) => p.showOnLandingPage === true);

          const mappedProds = landingProds.map((p: any) => ({
            id: p._id,
            name: p.name,
            images: p.images && p.images.length > 0 ? p.images : ["/products/suncream-1.jpg"],
            rating: p.starRating || 0,
            reviewCount: p.reviewsCount || 0,
            currentPrice: p.variants?.[0]?.price || 0,
            originalPrice: p.variants?.[0]?.oldPrice || p.variants?.[0]?.price || 0,
            currency: "₹",
            dealBadge: p.offerText || "",
            benefit: p.keyFeatures || ""
          }));
          setProducts(mappedProds);
        }
      } catch (err) {
        console.error("Failed to fetch landing products", err);
      }
    };
    fetchLandingProducts();
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
    <section ref={sectionRef} className="bg-white pt-6 md:pt-12 pb-12 md:pb-20 w-full">
      {/* Section Header */}
      <div className="text-center px-6">
        <h2
          className={`font-sans font-black text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] uppercase text-slate-900 mb-4 transition-all duration-600 ease-out motion-reduce:transition-none motion-reduce:transform-none ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          OUR PRODUCTS
        </h2>
        <div
          className={`w-20 h-1 bg-slate-900 mx-auto mt-4 mb-8 md:mb-12 transition-transform duration-500 delay-200 origin-center motion-reduce:transition-none motion-reduce:transform-none ${isVisible ? "scale-x-100" : "scale-x-0"
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
      <div className="flex justify-center mt-8 md:mt-12 px-6">
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
