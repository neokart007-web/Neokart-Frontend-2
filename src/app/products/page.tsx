"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Star, StarHalf, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

// ─── Data ────────────────────────────────────────────────────────────────────

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
  category: string;
}

// Categories and Products will be fetched dynamically



const HISTOGRAM = [
  { height: 30 }, { height: 100 }, { height: 60 }, { height: 20 },
  { height: 45 }, { height: 80 }, { height: 35 }, { height: 15 },
  { height: 55 }, { height: 40 },
];
const PRICE_MAX = 1200;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating))
      return <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
    if (i === Math.floor(rating) && rating % 1 !== 0)
      return <StarHalf key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
    return <Star key={i} className="w-4 h-4 fill-slate-200 text-slate-200" />;
  });

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setImgIdx((p) => (p + 1) % product.images.length),
      4000
    );
    return () => clearInterval(t);
  }, [product.images.length]);

  return (
    <article
      aria-label={product.name}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow duration-300 group flex flex-col motion-reduce:transition-none"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
          {product.images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`${product.name} image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 group-hover:scale-105 group-hover:transition-transform motion-reduce:transition-none ${i === imgIdx ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.images.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-3 flex flex-col flex-grow text-center">
          <div className="flex justify-center gap-0.5 mb-2" aria-label={`${product.rating} out of 5 stars`}>
            {renderStars(product.rating)}
            <span className="text-sm text-slate-400 ml-1">({product.reviewCount})</span>
          </div>
          <h3 className="font-sans font-bold text-base text-slate-900 leading-tight mb-3 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-bold text-xl text-slate-900">{product.currency}{product.currentPrice}</span>
            <span className="text-sm line-through text-slate-400">{product.currency}{product.originalPrice}</span>
          </div>
          <p className="font-bold text-[10px] uppercase tracking-wider text-red-600 mb-1">{product.dealBadge}</p>
          <p className="text-xs text-slate-500 line-clamp-1 mb-2">{product.benefit}</p>
        </div>
      </Link>
      <div className="px-4 pb-6">
        <button
          aria-label={`Add ${product.name} to cart`}
          className="w-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-full hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 motion-reduce:transition-none"
        >
          ADD TO CART
        </button>
      </div>
    </article>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterSidebarProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  minPrice: number;
  maxPrice: number;
  pendingMin: number;
  pendingMax: number;
  onCategoryChange: (id: string) => void;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  onApply: () => void;
  onClear: () => void;
}

function FilterSidebar({
  categories, activeCategory, pendingMin, pendingMax,
  onCategoryChange, onMinChange, onMaxChange, onApply, onClear,
}: FilterSidebarProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const getPercent = (val: number) => (val / PRICE_MAX) * 100;

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const val = Math.round(pct * PRICE_MAX);
      const midpoint = (pendingMin + pendingMax) / 2;
      if (val < midpoint) onMinChange(Math.min(val, pendingMax - 1));
      else onMaxChange(Math.max(val, pendingMin + 1));
    },
    [pendingMin, pendingMax, onMinChange, onMaxChange]
  );

  return (
    <aside aria-label="Product filters" className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-sans font-bold text-xl tracking-wider uppercase text-slate-900">FILTERS</h2>
        <button onClick={onClear} className="font-sans font-semibold text-sm text-blue-500 hover:text-blue-700 transition-colors">
          CLEAR
        </button>
      </div>

      {/* Category */}
      <div>
        <p className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-slate-400 mb-4">
          SHOP BY CATEGORY
        </p>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              aria-pressed={activeCategory === cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-5 py-3 rounded-xl font-sans font-medium text-sm text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeCategory === cat.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-slate-400 mb-4">
          PRICE RANGE
        </p>

        {/* Histogram */}
        <div className="h-16 flex items-end gap-[3px] mb-4">
          {HISTOGRAM.map((bar, i) => {
            const barPrice = (i / HISTOGRAM.length) * PRICE_MAX;
            const isActive = barPrice >= pendingMin && barPrice <= pendingMax;
            return (
              <div
                key={i}
                style={{ height: `${bar.height}%` }}
                className={`flex-1 rounded-t-sm transition-colors duration-200 ${isActive ? "bg-blue-500" : "bg-blue-200"}`}
              />
            );
          })}
        </div>

        {/* Slider track */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-2 bg-slate-200 rounded-full mb-5 cursor-pointer"
        >
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{ left: `${getPercent(pendingMin)}%`, right: `${100 - getPercent(pendingMax)}%` }}
          />
          {/* Min handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md border border-slate-300 cursor-grab"
            style={{ left: `${getPercent(pendingMin)}%` }}
          />
          {/* Max handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md border border-slate-300 cursor-grab"
            style={{ right: `${100 - getPercent(pendingMax)}%` }}
          />
        </div>

        {/* Min/Max inputs */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-sans font-semibold text-[10px] tracking-wider uppercase text-slate-400 mb-1">MIN (₹)</p>
            <input
              type="number"
              aria-label="Minimum price"
              value={pendingMin}
              min={0}
              max={pendingMax - 1}
              onChange={(e) => onMinChange(Math.min(Number(e.target.value), pendingMax - 1))}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-center font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-slate-400 mt-5 font-bold">—</span>
          <div className="flex-1">
            <p className="font-sans font-semibold text-[10px] tracking-wider uppercase text-slate-400 mb-1">MAX (₹)</p>
            <input
              type="number"
              aria-label="Maximum price"
              value={pendingMax}
              min={pendingMin + 1}
              max={PRICE_MAX}
              onChange={(e) => onMaxChange(Math.max(Number(e.target.value), pendingMin + 1))}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-center font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Apply */}
        <button
          onClick={onApply}
          className="mt-4 w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 motion-reduce:transition-none"
        >
          APPLY FILTER
        </button>
      </div>
    </aside>
  );
}

// ─── Main Page Content ─────────────────────────────────────────────────────────

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string, label: string }[]>([{ id: "all", label: "All Categories" }]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [pendingMin, setPendingMin] = useState(0);
  const [pendingMax, setPendingMax] = useState(PRICE_MAX);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

        if (catJson.success && catJson.data) {
          const activeCats = catJson.data.filter((c: any) => c.status === 'ACTIVE');
          const mappedCats = activeCats.map((c: any) => ({
            id: c.name,
            label: c.name,
          }));
          setCategories([{ id: "all", label: "All Categories" }, ...mappedCats]);

          if (prodJson.success && prodJson.data) {
            const activeCatNames = activeCats.map((c: any) => c.name.toLowerCase());
            
            const activeProducts = prodJson.data.filter((p: any) => 
              activeCatNames.includes((p.category || "").toLowerCase())
            );

            const mappedProds = activeProducts.map((p: any) => ({
              id: p._id,
              name: p.name,
              images: p.images && p.images.length > 0 ? p.images : ["/products/suncream-1.jpg"],
              rating: p.starRating || 0,
              reviewCount: p.reviewsCount || 0,
              currentPrice: p.variants?.[0]?.price || 0,
              originalPrice: p.variants?.[0]?.oldPrice || p.variants?.[0]?.price || 0,
              currency: "₹",
              dealBadge: p.offerText || "",
              benefit: p.keyFeatures || "",
              category: p.category || "all",
            }));
            setProducts(mappedProds);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && categories.some(c => c.id === category)) {
      setActiveCategory(category);
    }
  }, [searchParams, categories]);

  const handleApply = () => {
    setMinPrice(pendingMin);
    setMaxPrice(pendingMax);
    setDrawerOpen(false);
  };

  const handleClear = () => {
    setActiveCategory("all");
    setPendingMin(0);
    setPendingMax(PRICE_MAX);
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (activeCategory === "all" || p.category.toLowerCase() === activeCategory.toLowerCase()) &&
          p.currentPrice >= minPrice &&
          p.currentPrice <= maxPrice
      ),
    [activeCategory, minPrice, maxPrice, products]
  );

  // Close drawer on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const sidebarProps: FilterSidebarProps = {
    categories, activeCategory, minPrice, maxPrice, pendingMin, pendingMax,
    onCategoryChange: setActiveCategory,
    onMinChange: setPendingMin,
    onMaxChange: setPendingMax,
    onApply: handleApply,
    onClear: handleClear,
  };

  return (
    <div className="min-h-screen bg-white pt-30">
      <div className="flex min-h-[calc(100vh-5rem)]">

        {/* ── Desktop Sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:block w-72 xl:w-80 bg-slate-50 border-r border-slate-200 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto shrink-0">
          <FilterSidebar {...sidebarProps} />
        </aside>

        {/* ── Mobile Drawer ────────────────────────────────────────── */}
        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-white overflow-y-auto lg:hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <span className="font-bold text-xl uppercase tracking-wider text-slate-900">Filters</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar {...sidebarProps} />
            </div>
          </>
        )}

        {/* ── Main Content ─────────────────────────────────────────── */}
        <main className="flex-1 p-5 md:p-8 overflow-hidden">
          {/* Collection Banner */}
          <div className="relative w-full h-48 md:h-64 lg:h-72 rounded-2xl overflow-hidden mb-8">
            <Image
              src="/images/collection-banner.jpg"
              alt="HEEDY curated collection banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <p className="font-sans font-semibold text-xs tracking-[0.3em] uppercase text-blue-300 mb-3">
                CURATED FOR YOU
              </p>
              <h1 className="font-serif font-normal text-4xl md:text-5xl text-white leading-tight">
                Our Collection
              </h1>
            </div>
          </div>

          {/* Results Bar + Mobile Filter Toggle */}
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-5 py-4 mb-6 gap-4">
            <p className="font-sans text-base text-slate-600">
              Showing{" "}
              <span className="font-bold text-slate-900">{filtered.length}</span>
              {" "}of{" "}
              <span className="font-bold text-slate-900">{products.length}</span>
              {" "}Products
            </p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 font-sans font-bold text-sm text-slate-700 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-serif text-2xl text-slate-900 mb-2">No products found</h3>
              <p className="font-sans text-base text-slate-500 mb-6">
                Try adjusting your filters or clearing them to see all products.
              </p>
              <button
                onClick={handleClear}
                className="bg-slate-900 text-white font-bold text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:bg-slate-800 transition-colors"
              >
                CLEAR FILTERS
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Main Page Wrapper ───────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
