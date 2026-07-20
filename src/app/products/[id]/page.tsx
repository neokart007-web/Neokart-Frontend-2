"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingBag, ChevronRight,
  Shield, Truck, RotateCcw, Plus, Minus, Check,
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { cldOptimize } from "../../../lib/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  tagline: string;
  images: string[];
  currentPrice: number;
  originalPrice: number;
  currency: string;
  dealBadge: string;
  category: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  sizes: string[];
  showInFlashSale: boolean;
}

// Data will be fetched dynamically from backend

const TRUST_BADGES = [
  { Icon: Truck, label: "Free Delivery", sub: "On orders above ₹499" },
  { Icon: RotateCcw, label: "Easy Replacement", sub: "Replacement policy" },
  { Icon: Shield, label: "100% Authentic", sub: "Genuine products only" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAllThumbs, setShowAllThumbs] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
          : 'http://localhost:5000';

        const [prodRes, catRes] = await Promise.all([
          axios.get(`${baseUrl}/api/v1/products`),
          axios.get(`${baseUrl}/api/v1/categories`)
        ]);

        const prodJson = prodRes.data;
        const catJson = catRes.data;

        let activeCatNames: string[] = [];
        if (catJson.success && catJson.data) {
          activeCatNames = catJson.data
            .filter((c: any) => c.status === 'ACTIVE')
            .map((c: any) => c.name.toLowerCase());
        }

        if (prodJson.success && prodJson.data) {
          const activeProducts = prodJson.data.filter((p: any) =>
            activeCatNames.includes((p.category || "").toLowerCase())
          );

          const mapped = activeProducts.map((p: any) => ({
            id: p._id,
            name: p.name,
            tagline: p.description || "",
            images: p.images && p.images.length > 0 ? p.images : ["/products/suncream-1.jpg"],
            currentPrice: p.variants?.[0]?.price || 0,
            originalPrice: p.variants?.[0]?.oldPrice || p.variants?.[0]?.price || 0,
            currency: "₹",
            dealBadge: p.offerText || "",
            category: p.category || "all",
            benefits: p.keyFeatures ? p.keyFeatures.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean) : ["Premium Quality"],
            ingredients: p.description || "Refer to packaging",
            howToUse: "Follow instructions on packaging",
            sizes: p.variants && p.variants.length > 0 ? p.variants.map((v: any) => v.volume) : ["Standard"],
            showInFlashSale: p.showInFlashSale === true,
          }));
          const found = mapped.find((p: any) => p.id === id) || null;
          setProduct(found);
          setAllProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProducts();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const savedUser = localStorage.getItem("heedy_user");
    if (!savedUser) {
      router.push("/sign-in");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.currentPrice,
      currency: product.currency,
      size: product.sizes?.[selectedSize],
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Reset qty when variant changes
  const handleSizeChange = (i: number) => {
    setSelectedSize(i);
    setQty(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black pt-24 flex flex-col items-center justify-center text-center px-6">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="font-sans font-bold text-3xl text-white mb-2">Product Not Found</h1>
        <p className="text-slate-500 mb-8">We couldn&apos;t find the product you&apos;re looking for.</p>
        <Link
          href="/products"
          className="bg-slate-900 text-white font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-slate-800 transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const discount = Math.round((1 - product.currentPrice / product.originalPrice) * 100);
  // Prefer the percentage stated in the deal text (offerText); fall back to the computed one.
  const dealBadgeMatch = product.dealBadge.match(/(\d+)\s*%/);
  const badgeDiscount = dealBadgeMatch ? Number(dealBadgeMatch[1]) : discount;

  // Related products: always show other items from the same category.
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .filter((p) => p.category.toLowerCase() === product.category.toLowerCase())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-black pt-30">

      {/* ── Breadcrumb ── */}
      <nav
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center gap-2 text-xs font-sans text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* ── Main Section ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
              {product.images.map((src, i) => (
                <Image
                  key={i}
                  src={cldOptimize(src, 1000)}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={i === 0}
                  unoptimized
                  className={`object-cover transition-opacity duration-500 ${i === activeImage ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
              {/* Deal Badge */}
              {badgeDiscount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {badgeDiscount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className={`flex gap-3 ${showAllThumbs ? "flex-wrap" : "flex-nowrap md:flex-wrap overflow-hidden"}`}>
                {product.images.map((src, i) => {
                  const isFourth = i === 3;
                  const isExtra = i > 3;
                  const hasMore = product.images.length > 4;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveImage(i);
                        if (isFourth && hasMore && !showAllThumbs) {
                          setShowAllThumbs(true);
                        }
                      }}
                      aria-label={`View image ${i + 1}`}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${i === activeImage ? "border-slate-900 shadow-md" : "border-slate-200 hover:border-slate-400"
                        } ${!showAllThumbs && isExtra && hasMore ? "hidden md:block" : ""}`}
                    >
                      <Image src={cldOptimize(src, 200)} alt={`Thumbnail ${i + 1}`} fill sizes="80px" unoptimized className="object-cover" />
                      {!showAllThumbs && isFourth && hasMore && (
                        <div className="absolute inset-0 bg-black/40 flex md:hidden items-center justify-center text-white backdrop-blur-[1px]">
                          <Plus size={28} strokeWidth={2.5} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="font-sans font-semibold text-xs tracking-[0.2em] uppercase text-blue-600 mb-3">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="font-sans font-bold text-3xl md:text-4xl text-white leading-tight mb-3">
              {product.name}
            </h1>

            {/* Tagline */}
            <div className="mb-5">
              <p className={`font-sans text-slate-500 text-base leading-relaxed whitespace-pre-wrap transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                {product.tagline}
              </p>
              {product.tagline && product.tagline.length > 150 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-blue-600 font-semibold text-sm mt-1 hover:text-blue-800 transition-colors inline-block"
                >
                  {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>


            {/* Divider */}
            <div className="h-px bg-slate-100 mb-6" />

            {/* Price */}
            <div className="flex items-end gap-3 mb-2">
              <span className="font-sans font-bold text-4xl text-white">
                {product.currency}{product.currentPrice}
              </span>
              <span className="font-sans text-lg text-slate-400 line-through mb-0.5">
                {product.currency}{product.originalPrice}
              </span>
            </div>
            <p className="font-bold text-xs uppercase tracking-wider text-red-500 mb-6">
              {product.dealBadge} — You save {product.currency}{product.originalPrice - product.currentPrice}
            </p>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <div className="mb-6">
                <p className="font-sans font-semibold text-sm text-slate-200 mb-3 uppercase tracking-[0.1em]">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, i) => {
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(i)}
                        className={`px-5 py-2.5 rounded-xl font-sans font-semibold text-sm border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative ${i === selectedSize
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-600 text-slate-300 hover:border-slate-400 bg-black"
                          }`}
                        aria-pressed={i === selectedSize}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans font-semibold text-sm text-slate-200 uppercase tracking-[0.1em]">
                  Quantity
                </p>
              </div>
              <div className="inline-flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-12 h-12 flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 text-center font-bold text-lg text-white select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-12 h-12 flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${added
                  ? "bg-green-500 text-white"
                  : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                  }`}
              >
                {added ? (
                  <><Check size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={18} /> Add to Cart</>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              {TRUST_BADGES.map(({ Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Icon size={16} className="text-white" />
                  </div>
                  <p className="font-sans font-bold text-xs text-slate-900 leading-tight">{label}</p>
                  <p className="font-sans text-[10px] text-slate-400 leading-tight">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="font-sans font-bold text-xl md:text-2xl text-white">
              Related Products
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {relatedProducts.map((rp) => {
              const rpDiscount =
                rp.originalPrice > rp.currentPrice && rp.originalPrice > 0
                  ? Math.round(((rp.originalPrice - rp.currentPrice) / rp.originalPrice) * 100)
                  : 0;
              return (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}`}
                  className="group bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <div className="relative aspect-square bg-[#1a1a1a] overflow-hidden">
                    <Image
                      src={cldOptimize(rp.images[0], 500)}
                      alt={rp.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {rpDiscount > 0 && (
                      <span className="absolute top-2.5 left-2.5 bg-amber-400 text-black text-[11px] font-black px-2 py-0.5 rounded-full">
                        {rpDiscount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    {rp.category && (
                      <p className="font-sans font-semibold text-[9px] md:text-[10px] uppercase tracking-wider text-[#a78bda] mb-1">
                        {rp.category}
                      </p>
                    )}
                    <h3 className="font-sans font-bold text-xs md:text-sm text-white leading-snug line-clamp-2 mb-2">
                      {rp.name}
                    </h3>
                    <div className="mt-auto flex items-baseline gap-1.5">
                      <span className="font-sans font-black text-sm md:text-base text-white">
                        {rp.currency}{rp.currentPrice}
                      </span>
                      {rp.originalPrice > rp.currentPrice && (
                        <span className="font-sans text-[10px] md:text-[11px] text-white/40 line-through">
                          {rp.currency}{rp.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
