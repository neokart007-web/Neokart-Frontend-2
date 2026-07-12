"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { cldOptimize } from "../../lib/image";

// ─── Data ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  images: string[];
  currentPrice: number;
  originalPrice: number;
  currency: string;
  dealBadge: string;
  benefit: string;
  category: string;
  categoryLabel: string;
}

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { id: "under-50", label: "Under ₹50", min: 0, max: 50 },
  { id: "50-100", label: "₹50 - ₹100", min: 50, max: 100 },
  { id: "100-200", label: "₹100 - ₹200", min: 100, max: 200 },
  { id: "200-500", label: "₹200 - ₹500", min: 200, max: 500 },
  { id: "over-500", label: "Over ₹500", min: 500, max: Infinity },
];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
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

  return (
    <article className="bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 group flex flex-col">
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col flex-grow outline-none focus-visible:ring-2 focus-visible:ring-[#593dab] focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
          <Image
            src={cldOptimize(product.images[0], 800)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
          {product.dealBadge && (
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full">
              {product.dealBadge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {product.categoryLabel && (
            <p className="font-sans font-semibold text-[10px] md:text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
              {product.categoryLabel}
            </p>
          )}
          <h3 className="font-sans font-bold text-sm md:text-base text-white leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* Price + Cart */}
      <div className="px-4 pb-4 pt-2 mt-auto flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-sans font-bold text-lg md:text-xl text-white truncate">
            {product.currency}{product.currentPrice}
          </span>
          {product.originalPrice > product.currentPrice && (
            <span className="font-sans text-[11px] md:text-xs text-white/40 line-through">
              {product.currency}{product.originalPrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#593dab] focus:ring-offset-2 focus:ring-offset-[#121212] ${isAdded
            ? "bg-green-600 hover:bg-green-700"
            : "bg-black/60 hover:bg-[#593dab] border border-white/10"
            }`}
        >
          <ShoppingBag className="w-[18px] h-[18px]" />
        </button>
      </div>
    </article>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterSidebarProps {
  categories: { id: string; label: string; count: number }[];
  selectedCategories: string[];
  selectedPriceRanges: string[];
  onToggleCategory: (id: string) => void;
  onTogglePriceRange: (id: string) => void;
}

function FilterSidebar({
  categories, selectedCategories, selectedPriceRanges, onToggleCategory, onTogglePriceRange,
}: FilterSidebarProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Categories */}
      <div>
        <h2 className="font-sans font-bold text-lg text-white mb-1">Categories</h2>
        <div className="border-b border-white/10 mb-4" />
        <div className="flex flex-col gap-3.5">
          {categories.length === 0 && (
            <p className="text-sm text-slate-500">No categories yet.</p>
          )}
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => onToggleCategory(cat.id)}
                className="w-4 h-4 rounded accent-[#593dab] cursor-pointer"
              />
              <span className="font-sans text-sm text-slate-300 group-hover:text-white transition-colors">
                {cat.label} <span className="text-slate-500">({cat.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h2 className="font-sans font-bold text-lg text-white mb-1">Price Range</h2>
        <div className="border-b border-white/10 mb-4" />
        <div className="flex flex-col gap-3.5">
          {PRICE_RANGES.map((range) => (
            <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(range.id)}
                onChange={() => onTogglePriceRange(range.id)}
                className="w-4 h-4 rounded accent-[#593dab] cursor-pointer"
              />
              <span className="font-sans text-sm text-slate-300 group-hover:text-white transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Content ─────────────────────────────────────────────────────────

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("popularity");
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          setCategories(
            activeBackendCats.map((c: any) => ({
              id: c.name.toLowerCase().replace(/\s+/g, '-'),
              label: c.name,
            }))
          );

          if (prodJson.success && prodJson.data) {
            const activeCatNames = activeBackendCats.map((c: any) => c.name.toLowerCase());
            const activeProducts = prodJson.data.filter((p: any) =>
              activeCatNames.includes((p.category || "").toLowerCase())
            );

            const mappedProds: Product[] = activeProducts.map((p: any) => ({
              id: p._id,
              name: p.name,
              images: p.images && p.images.length > 0 ? p.images : ["/products/suncream-1.jpg"],
              currentPrice: p.variants?.[0]?.price || 0,
              originalPrice: p.variants?.[0]?.oldPrice || p.variants?.[0]?.price || 0,
              currency: "₹",
              dealBadge: p.offerText || "",
              benefit: p.keyFeatures || "",
              category: p.category ? p.category.toLowerCase().replace(/\s+/g, '-') : "",
              categoryLabel: p.category || "",
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

  // Sync category/search from URL
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) setSelectedCategories([category]);
    const search = searchParams.get("search");
    setSearchTerm(search !== null ? search : "");
  }, [searchParams]);

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const togglePriceRange = (id: string) =>
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  // Category counts based on all products
  const categoriesWithCounts = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        count: products.filter((p) => p.category === c.id).length,
      })),
    [categories, products]
  );

  const matchesPrice = (price: number) => {
    if (selectedPriceRanges.length === 0) return true;
    return selectedPriceRanges.some((id) => {
      const range = PRICE_RANGES.find((r) => r.id === id);
      return range ? price >= range.min && price < range.max : true;
    });
  };

  const filtered = useMemo(() => {
    const result = products.filter(
      (p) =>
        (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
        matchesPrice(p.currentPrice) &&
        (searchTerm === "" ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.benefit.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    switch (sortBy) {
      case "price-asc":
        return [...result].sort((a, b) => a.currentPrice - b.currentPrice);
      case "price-desc":
        return [...result].sort((a, b) => b.currentPrice - a.currentPrice);
      default:
        return result;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, selectedCategories, selectedPriceRanges, searchTerm, sortBy]);

  // Close drawer on escape + lock scroll
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const sidebarProps: FilterSidebarProps = {
    categories: categoriesWithCounts,
    selectedCategories,
    selectedPriceRanges,
    onToggleCategory: toggleCategory,
    onTogglePriceRange: togglePriceRange,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 md:pt-28">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex gap-8">

        {/* ── Desktop Sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="bg-[#121212] border border-white/10 rounded-2xl sticky top-24">
            <FilterSidebar {...sidebarProps} />
          </div>
        </aside>

        {/* ── Mobile Drawer ────────────────────────────────────────── */}
        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-[#121212] overflow-y-auto lg:hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 pt-6">
                <span className="font-bold text-xl text-white">Filters</span>
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
        <main className="flex-1 min-w-0 pb-16">
          {/* Top bar: count + sort */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 font-sans font-semibold text-sm text-white border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <p className="font-sans text-base md:text-lg text-slate-300">
                Showing <span className="font-bold text-white">{filtered.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="hidden sm:inline font-sans text-sm text-slate-400">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#121212] border border-white/10 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#593dab] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#121212]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {searchTerm && (
            <p className="font-sans text-sm text-slate-400 mb-4">
              Search results for: <span className="font-bold text-white">&quot;{searchTerm}&quot;</span>
              <button onClick={() => setSearchTerm("")} className="ml-3 text-[#a78bda] hover:underline text-xs">Clear search</button>
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-sans font-bold text-2xl text-white mb-2">No products found</h3>
              <p className="font-sans text-base text-slate-400 mb-6">
                Try adjusting your filters or clearing them to see all products.
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedPriceRanges([]);
                  setSearchTerm("");
                }}
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
