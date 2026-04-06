import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Package, Flame, Heart, X, CheckCircle } from "lucide-react";
import ItemCard, { ItemCardSkeleton } from "../components/ItemCard";
import PaymentModal from "../components/PaymentModal";
import { itemsAPI, usersAPI } from "../services/api";
import { useWishlist } from "../contexts/WishlistContext";
import "./Marketplace.css";

export default function Marketplace() {
  const { wishlist: globalWishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialFilter = searchParams.get("category") || "All";

  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchased, setPurchased] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("purchased") || "[]");
    } catch {
      return [];
    }
  });

  const [checkoutItem, setCheckoutItem] = useState(null);

  // Fancy Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsData = await itemsAPI.getItems();
        setItems(Array.isArray(itemsData) ? itemsData : []);
      } catch (err) {
        console.error("Marketplace fetch error:", err);
        setError("Failed to load marketplace data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter !== "All") params.set("category", filter);
    setSearchParams(params, { replace: true });
  }, [search, filter, setSearchParams]);

  // Sync state if URL params change externally
  useEffect(() => {
    const querySearch = searchParams.get("search") || "";
    const queryFilter = searchParams.get("category") || "All";

    if (search !== querySearch) setSearch(querySearch);
    if (filter !== queryFilter) setFilter(queryFilter);
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("purchased", JSON.stringify(purchased));
  }, [purchased]);

  // Derived Values
  const categories = useMemo(() => ["All", ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || item.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);


  const handleBuy = (item) => {
    if (purchased.includes(item._id)) return;
    setCheckoutItem(item);
  };

  const handlePaymentSuccess = (item) => {
    setPurchased((prev) => [...prev, item._id]);
    setCheckoutItem(null);
    showToast(`Order placed for ${item.title}!`, "success");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="card p-10 text-center max-w-md animate-in fade-in zoom-in duration-300" style={{ borderColor: 'var(--color-danger-light)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            <X size={32} />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>Oops! Something broke.</h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary w-full">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] font-sans pb-20" style={{ background: 'var(--color-bg-secondary)' }}>

      {/* ── Awesome Hero Area ── */}
      <div className="px-4 pt-6 md:px-10 lg:px-12 max-w-[1600px] mx-auto">
        <div className="market-hero animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
              Discover exactly what you've been looking for.
            </h1>
            <p className="text-lg md:text-xl text-blue-100 font-medium mb-10 max-w-2xl leading-relaxed opacity-90">
              Explore thousands of unique products listed by your community. Buy, rent, or lend effortlessly with our secure platform.
            </p>

            {/* Premium Search Input */}
            <div className="relative max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center shadow-2xl focus-within:bg-white/15 transition-all">
              <div className="pl-4 pr-3 text-white/70">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="Search smartphones, laptops, clothing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder:text-white/60 focus:outline-none font-medium text-lg py-3 pr-4"
              />
              {search && (
                <button onClick={() => setSearch('')} className="pr-4 text-white/50 hover:text-white outline-none transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Quick stats floating in hero */}
          <div className="absolute top-10 right-10 hidden lg:flex flex-col gap-4 z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-48 shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-300">
                <Package size={24} />
              </div>
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Items</p>
                <p className="text-white font-black text-2xl">{loading ? '...' : items.length}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-48 shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-300">
                <Heart size={24} />
              </div>
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Wishlisted</p>
                <p className="text-white font-black text-2xl">{globalWishlist.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Marketplace Body ── */}
      <div className="px-4 md:px-10 lg:px-12 max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 items-start">

        {/* Sticky Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 z-20">
          <div className="card text-left p-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <SlidersHorizontal size={20} style={{ color: 'var(--color-primary)' }} />
              <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Categories</h2>
            </div>

            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 filter-scroll">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex-shrink-0 text-left px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-between group
                        ${filter === cat
                      ? 'btn-primary shadow-md'
                      : 'bg-transparent hover:bg-gray-50'}`}
                  style={filter === cat ? {} : { color: 'var(--color-text-secondary)' }}
                >
                  <span>{cat}</span>
                  {filter === cat && <CheckCircle size={16} className="opacity-80" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid Area */}
        <main className="flex-1 w-full min-w-0">

          {/* Results Header */}
          <div className="card mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 animate-in fade-in duration-500">
            <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Showing <span className="font-black" style={{ color: 'var(--color-text-primary)' }}>{filteredItems.length}</span> results
              {filter !== "All" && <span> for <span className="font-black px-3 py-1 rounded-full text-sm ml-1" style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}>{filter}</span></span>}
              {search && <span> matching <span className="italic" style={{ color: 'var(--color-text-secondary)' }}>"{search}"</span></span>}
            </p>

            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
              <Flame size={16} style={{ color: 'var(--color-warning)' }} /> Currently Trending
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {loading ? (
              // Skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`skel-${i}`} style={{ animationDelay: `${i * 100}ms` }} className="stagger-item">
                  <ItemCardSkeleton />
                </div>
              ))
            ) : filteredItems.length > 0 ? (
              // Items
              filteredItems.map((item, i) => (
                <div key={item._id} style={{ animationDelay: `${Math.min(i * 50, 800)}ms` }} className="stagger-item h-full">
                  <ItemCard
                    item={item}
                    onBuy={handleBuy}
                    isBought={purchased.includes(item._id)}
                  />
                </div>
              ))
            ) : (
              // Not found state
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 group hover:scale-110 transition-transform" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <Search size={40} style={{ color: 'var(--color-border-hover)' }} />
                </div>
                <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>No matching items found</h3>
                <p className="max-w-md font-medium" style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your search criteria or selecting a different category from the filters.</p>
                {(search || filter !== "All") && (
                  <button
                    onClick={() => { setSearch(''); setFilter('All'); }}
                    className="btn btn-outline mt-6"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Global Toast Message */}
      {toast && (
        <div className={`fixed bottom-6 top-auto left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-white flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300`} style={{ background: toast.type === "success" ? 'var(--color-text-primary)' : 'var(--color-primary)' }}>
          {toast.type === "success" ? <CheckCircle size={18} style={{ color: 'var(--color-success)' }} /> : <Heart size={18} fill="currentColor" />}
          {toast.message}
        </div>
      )}

      {/* Payment Checkout Modal */}
      <PaymentModal
        item={checkoutItem}
        isOpen={!!checkoutItem}
        onClose={() => setCheckoutItem(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
