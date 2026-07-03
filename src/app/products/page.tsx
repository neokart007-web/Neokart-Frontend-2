"use client";

import { useState, useEffect, Suspense, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { Star, StarHalf, SlidersHorizontal, X, ChevronLeft } from "lucide-react";

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
  { height: 15 }, { height: 25 }, { height: 40 }, { height: 80 },
  { height: 100 }, { height: 75 }, { height: 35 }, { height: 20 },
  { height: 45 }, { height: 25 }, { height: 15 }, { height: 10 },
  { height: 8 }, { height: 12 }, { height: 15 }, { height: 12 },
  { height: 10 }, { height: 15 }, { height: 20 }, { height: 15 }
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
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

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
      className="bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:shadow-lg hover:border-white/20 transition-all duration-300 group flex flex-col motion-reduce:transition-none"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
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
            <span className="text-sm text-slate-500 ml-1">({product.reviewCount})</span>
          </div>
          <h3 className="font-sans font-bold text-sm md:text-base text-white leading-tight mb-2 md:mb-3 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-2">
            <span className="font-bold text-lg md:text-xl text-white">{product.currency}{product.currentPrice}</span>
            <span className="text-xs md:text-sm line-through text-white/40">{product.currency}{product.originalPrice}</span>
          </div>
          <p className="font-bold text-[10px] uppercase tracking-wider text-red-500 mb-1">{product.dealBadge}</p>
          <p className="text-xs text-slate-400 line-clamp-1 mb-2">{product.benefit}</p>
        </div>
      </Link>
      <div className="px-4 pb-6">
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={`w-full text-white font-bold text-[10px] md:text-xs uppercase tracking-widest py-2 md:py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 motion-reduce:transition-none ${isAdded
            ? "bg-green-600 hover:bg-green-700"
            : "bg-[#593dab] hover:bg-[#4a3391]"
            }`}
        >
          {isAdded ? "ADDED TO CART" : "ADD TO CART"}
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
        <h2 className="font-sans font-bold text-xl tracking-wider uppercase text-white">FILTERS</h2>
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
                ? "bg-[#593dab] text-white"
                : "bg-[#121212] text-slate-300 border border-white/10 hover:bg-[#1a1a1a]"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="font-sans font-bold text-sm tracking-[0.15em] uppercase text-slate-400 mb-6 px-1">
          PRICE RANGE
        </p>

        <div className="px-2 mb-8">
          {/* Histogram */}
          <div className="h-20 flex items-end gap-1 mb-0 relative z-0">
            {HISTOGRAM.map((bar, i) => (
              <div
                key={i}
                style={{ height: `${bar.height}%` }}
                className="flex-1 rounded-full bg-blue-400"
              />
            ))}
          </div>

          {/* Slider track */}
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className="relative h-3 w-full cursor-pointer z-10 -mt-1"
          >
            {/* Unselected track (invisible or very faint to allow clicking) */}
            <div className="absolute inset-0 h-4 bg-transparent rounded-full -translate-y-0.5" />

            {/* Active track */}
            <div
              className="absolute h-3.5 bg-blue-600 rounded-full top-1/2 -translate-y-1/2"
              style={{ left: `${getPercent(pendingMin)}%`, right: `${100 - getPercent(pendingMax)}%` }}
            />

            {/* Min handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-grab"
              style={{ left: `${getPercent(pendingMin)}%` }}
            >
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full" />
            </div>

            {/* Max handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-grab"
              style={{ right: `${100 - getPercent(pendingMax)}%` }}
            >
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full" />
            </div>
          </div>
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

// ─── Pagination Component ─────────────────────────────────────────────────────

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-12 mb-4">
      <div className="flex items-center border border-slate-200 rounded overflow-hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 font-sans text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200 transition-colors"
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-4 py-2 font-sans text-sm border-r border-slate-200 transition-colors ${currentPage === p
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-500 hover:bg-slate-50"
              }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 font-sans text-sm bg-white text-blue-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Main Page Content ─────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { id: "all", label: "All Categories" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [pendingMin, setPendingMin] = useState(0);
  const [pendingMax, setPendingMax] = useState(PRICE_MAX);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

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

        if (catJson.success && catJson.data) {
          const activeBackendCats = catJson.data.filter((c: any) => c.status === 'ACTIVE');
          const dynamicCategories = [
            { id: "all", label: "All Categories" },
            ...activeBackendCats.map((c: any) => ({
              id: c.name.toLowerCase().replace(/\s+/g, '-'),
              label: c.name
            }))
          ];
          setCategories(dynamicCategories);

          if (prodJson.success && prodJson.data) {
            const activeCatNames = activeBackendCats.map((c: any) => c.name.toLowerCase());

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
              category: p.category ? p.category.toLowerCase().replace(/\s+/g, '-') : "all",
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
    } else if (category === "all") {
      setActiveCategory("all");
    }
    const search = searchParams.get("search");
    if (search !== null) {
      setSearchTerm(search);
    } else {
      setSearchTerm("");
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
    setSearchTerm("");
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (activeCategory === "all" || p.category.toLowerCase() === activeCategory.toLowerCase()) &&
          p.currentPrice >= minPrice &&
          p.currentPrice <= maxPrice &&
          (searchTerm === "" ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.benefit.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [activeCategory, minPrice, maxPrice, products, searchTerm]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, minPrice, maxPrice, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
    <div className="min-h-screen bg-[#0a0a0a] pt-30">
      <div className="flex min-h-[calc(100vh-5rem)]">

        {/* ── Desktop Sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:block w-72 xl:w-80 bg-[#0a0a0a] border-r border-white/10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto shrink-0">
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
            <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-[#0a0a0a] overflow-y-auto lg:hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <span className="font-bold text-xl uppercase tracking-wider text-white">Filters</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
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
          {/* Mobile Back to Home */}
          <Link
            href="/"
            className="md:hidden inline-flex items-center gap-2 text-slate-300 hover:text-white mb-5 transition-colors text-sm font-semibold bg-[#121212] border border-white/10 px-5 py-2.5 rounded-full shadow-sm"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>

          {/* Collection Banner */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] rounded-2xl overflow-hidden mb-8 bg-blue-50/50">
            <Image
              src="/images/shop-banner.png"
              alt="NEOKART Moisturizing Brightening Sunscreen"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Results Bar + Mobile Filter Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#121212] border border-white/10 rounded-xl px-5 py-4 mb-6 gap-4">
            <div>
              <p className="font-sans text-base text-slate-300">
                Showing{" "}
                <span className="font-bold text-white">{filtered.length}</span>
                {" "}of{" "}
                <span className="font-bold text-white">{products.length}</span>
                {" "}Products
              </p>
              {searchTerm && (
                <p className="font-sans text-sm text-slate-400 mt-1">
                  Search results for: <span className="font-bold text-white">&quot;{searchTerm}&quot;</span>
                  <button onClick={() => setSearchTerm("")} className="ml-3 text-blue-500 hover:underline text-xs">Clear search</button>
                </p>
              )}
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 font-sans font-bold text-sm text-white border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-7">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-serif text-2xl text-white mb-2">No products found</h3>
              <p className="font-sans text-base text-slate-400 mb-6">
                Try adjusting your filters or clearing them to see all products.
              </p>
              <button
                onClick={handleClear}
                className="bg-[#593dab] text-white font-bold text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#4a3391] transition-colors"
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
      <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
