"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star, StarHalf, ShoppingBag, Heart, ChevronRight,
  Shield, Truck, RotateCcw, Plus, Minus, Check,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  tagline: string;
  images: string[];
  rating: number;
  reviewCount: number;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  dealBadge: string;
  category: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  sizes: string[];
}

// Data will be fetched dynamically from backend

const TRUST_BADGES = [
  { Icon: Truck, label: "Free Delivery", sub: "On orders above ₹499" },
  { Icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
  { Icon: Shield, label: "100% Authentic", sub: "Genuine products only" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating))
      return <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
    if (i === Math.floor(rating) && rating % 1 !== 0)
      return <StarHalf key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
    return <Star key={i} className="w-4 h-4 fill-slate-200 text-slate-200" />;
  });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "how-to">("benefits");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/categories`)
        ]);
        
        const [prodJson, catJson] = await Promise.all([
          prodRes.json(),
          catRes.json()
        ]);
        
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
            tagline: p.description?.substring(0, 100) + "..." || "",
            images: p.images && p.images.length > 0 ? p.images : ["/products/suncream-1.jpg"],
            rating: p.starRating || 0,
            reviewCount: p.reviewsCount || 0,
            currentPrice: p.variants?.[0]?.price || 0,
            originalPrice: p.variants?.[0]?.oldPrice || p.variants?.[0]?.price || 0,
            currency: "₹",
            dealBadge: p.offerText || "",
            category: p.category || "all",
            benefits: p.keyFeatures ? p.keyFeatures.split(',').map((s: string) => s.trim()) : ["Premium Quality"],
            ingredients: p.description || "Refer to packaging",
            howToUse: "Follow instructions on packaging",
            sizes: p.variants && p.variants.length > 0 ? p.variants.map((v: any) => v.volume) : ["Standard"],
          }));
          setProducts(mapped);
          setProduct(mapped.find((p: Product) => p.id === id) || null);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProducts();
  }, [id]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 flex flex-col items-center justify-center text-center px-6">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="font-sans font-bold text-3xl text-slate-900 mb-2">Product Not Found</h1>
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

  return (
    <div className="min-h-screen bg-white pt-30">
      <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-xs font-bold">
        DEBUG: Rendering Product: {product.name} (ID: {id})
      </div>
      {/* ── Breadcrumb ── */}
      <nav
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center gap-2 text-xs font-sans text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-slate-700 transition-colors">Products</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700 font-semibold line-clamp-1">{product.name}</span>
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
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={i === 0}
                  className={`object-cover transition-opacity duration-500 ${i === activeImage ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
              {/* Deal Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {discount}% OFF
                </div>
              )}
              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
              >
                <Heart
                  size={18}
                  className={`transition-colors duration-200 ${wishlisted ? "fill-red-500 text-red-500" : "text-slate-400"
                    }`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${i === activeImage
                        ? "border-slate-900 shadow-md"
                        : "border-slate-200 hover:border-slate-400"
                      }`}
                  >
                    <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
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
            <h1 className="font-serif font-normal text-3xl md:text-4xl text-slate-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="font-sans text-slate-500 text-base leading-relaxed mb-5">
              {product.tagline}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5" aria-label={`${product.rating} out of 5 stars`}>
                {renderStars(product.rating)}
              </div>
              <span className="text-sm font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
              {product.reviewCount > 0 && (
                <span className="text-sm text-slate-400">({product.reviewCount} reviews)</span>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-6" />

            {/* Price */}
            <div className="flex items-end gap-3 mb-2">
              <span className="font-sans font-bold text-4xl text-slate-900">
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
                <p className="font-sans font-semibold text-sm text-slate-700 mb-3 uppercase tracking-[0.1em]">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, i) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(i)}
                      className={`px-5 py-2.5 rounded-xl font-sans font-semibold text-sm border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${i === selectedSize
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-400 bg-white"
                        }`}
                      aria-pressed={i === selectedSize}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-sans font-semibold text-sm text-slate-700 mb-3 uppercase tracking-[0.1em]">
                Quantity
              </p>
              <div className="inline-flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 text-center font-bold text-lg text-slate-900 select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
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
                    : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
              >
                {added ? (
                  <><Check size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={18} /> Add to Cart</>
                )}
              </button>
              <button
                aria-label="Buy now"
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Buy Now
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

      {/* ── Info Tabs ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 mb-8 gap-8">
          {([
            { key: "benefits", label: "Benefits" },
            { key: "ingredients", label: "Ingredients" },
            { key: "how-to", label: "How to Use" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-4 font-sans font-bold text-sm uppercase tracking-[0.12em] border-b-2 transition-all duration-200 focus:outline-none ${activeTab === key
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-2xl">
          {activeTab === "benefits" && (
            <ul className="space-y-3">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-blue-600" strokeWidth={3} />
                  </div>
                  <span className="font-sans text-base text-slate-700">{b}</span>
                </li>
              ))}
            </ul>
          )}
          {activeTab === "ingredients" && (
            <p className="font-sans text-base text-slate-600 leading-relaxed">
              {product.ingredients}
            </p>
          )}
          {activeTab === "how-to" && (
            <p className="font-sans text-base text-slate-600 leading-relaxed">
              {product.howToUse}
            </p>
          )}
        </div>
      </section>

      {/* ── Related Products ── */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-[0.12em] text-slate-900">
              You May Also Like
            </h2>
            <Link
              href="/products"
              className="font-sans font-bold text-sm text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="font-sans font-bold text-sm text-slate-900 line-clamp-2 mb-2">{p.name}</p>
                  <p className="font-bold text-base text-slate-900">{p.currency}{p.currentPrice}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
