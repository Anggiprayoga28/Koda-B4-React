import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import axios from "axios";

import MenuCard from "../components/landing/MenuCard";
import Pagination from "../components/admin/Pagination";
import Notification from "../components/ui/Notification";
import ProductPaymentDetails from "../components/ProductPaymentDetails";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ProductPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isPaymentMode = searchParams.get("payment") === "true";
  const [notification, setNotification] = useState(null);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const [promos, setPromo] = useState([]);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoScrollProgress, setPromoScrollProgress] = useState(0);
  const promoScrollRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    searchParams.get("category_id") || ""
  );
  const [isFavorite, setIsFavorite] = useState(
    searchParams.get("is_favorite") === "true"
  );
  const [isFlashSale, setIsFlashSale] = useState(
    searchParams.get("is_flash_sale") === "true"
  );
  const [isBuy1Get1, setIsBuy1Get1] = useState(
    searchParams.get("is_buy1get1") === "true"
  );
  const [priceRange, setPriceRange] = useState({
    min: parseInt(searchParams.get("min_price")) || 0,
    max: parseInt(searchParams.get("max_price")) || 100000,
  });
  const [showFilter, setShowFilter] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const categoryMap = {
    coffee: 1,
    nonCoffee: 2,
    food: 3,
    addon: 4,
  };

  useEffect(() => {
    document.title = "Our Products - Coffee Shop | Best Coffee & Food";
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      const newLimit = mobile ? 6 : 9;
      if (newLimit !== pagination.limit) {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pagination.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };

        if (debouncedSearchTerm) params.search = debouncedSearchTerm;
        if (selectedCategoryId) params.category_id = selectedCategoryId;
        if (isFavorite) params.is_favorite = true;
        if (isFlashSale) params.is_flash_sale = true;
        if (isBuy1Get1) params.is_buy1get1 = true;
        if (priceRange.min > 0) params.min_price = priceRange.min;
        if (priceRange.max < 100000) params.max_price = priceRange.max;

        const hasFilters = debouncedSearchTerm || selectedCategoryId || isFavorite || 
                          isFlashSale || isBuy1Get1 || 
                          priceRange.min > 0 || priceRange.max < 100000;
        
        const endpoint = hasFilters ? '/products/filter' : '/products';
        
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          params,
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
          setProducts(response.data.data || []);
          
          if (response.data.meta) {
            setPagination({
              page: response.data.meta.page || 1,
              limit: response.data.meta.limit || pagination.limit,
              totalItems: response.data.meta.total_items || 0,
              totalPages: response.data.meta.total_pages || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        showNotification(
          error.response?.data?.message || "Failed to load products",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    debouncedSearchTerm, 
    selectedCategoryId,
    isFavorite,
    isFlashSale,
    isBuy1Get1,
    priceRange,
    pagination.page,
    pagination.limit
  ]);

  useEffect(() => {
    const params = {};

    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (selectedCategoryId) params.category_id = selectedCategoryId;
    if (isFavorite) params.is_favorite = "true";
    if (isFlashSale) params.is_flash_sale = "true";
    if (isBuy1Get1) params.is_buy1get1 = "true";
    if (priceRange.min > 0) params.min_price = priceRange.min.toString();
    if (priceRange.max < 100000) params.max_price = priceRange.max.toString();
    if (pagination.page > 1) params.page = pagination.page.toString();

    setSearchParams(params);
  }, [
    debouncedSearchTerm,
    selectedCategoryId,
    isFavorite,
    isFlashSale,
    isBuy1Get1,
    priceRange,
    pagination.page,
    setSearchParams,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedCategoryId("");
    setIsFavorite(false);
    setIsFlashSale(false);
    setIsBuy1Get1(false);
    setPriceRange({ min: 0, max: 100000 });
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams({});
  };

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/promos`);
        if (response.data.success && response.data.data) {
          setPromo(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    };
    fetchPromo();
  }, []);

  useEffect(() => {
    if (promos.length === 0) return;
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promos.length]);

  const nextPromo = () => {
    setPromoIndex((prev) => (prev + 1) % promos.length);
  };

  const prevPromo = () => {
    setPromoIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const handleScroll = (e) => {
    if (!promoScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setPromoScrollProgress(progress);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCategoryChange = (categoryKey, checked) => {
    if (checked) {
      setSelectedCategoryId(categoryMap[categoryKey]);
    } else {
      setSelectedCategoryId("");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const isSearching = searchTerm !== debouncedSearchTerm;

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-#8E6447 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isPaymentMode) {
    return <ProductPaymentDetails />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-12">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Promo Section */}
        {promos.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative">
                <div
                  ref={promoScrollRef}
                  onScroll={handleScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {promos.map((promo, index) => (
                    <div
                      key={promo.id}
                      className={`min-w-full snap-start p-8 transition-opacity duration-300 ${
                        index === promoIndex ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        backgroundColor: promo.bg_color || "#8E6447",
                        color: promo.text_color || "#FFFFFF",
                        transform: `translateX(-${promoIndex * 100}%)`,
                      }}
                    >
                      <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                          {promo.title}
                        </h2>
                        <p className="text-sm sm:text-base mb-4 opacity-90">
                          {promo.description}
                        </p>
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                          <code className="font-mono font-semibold">
                            {promo.code}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {promos.length > 1 && (
                  <>
                    <button
                      onClick={prevPromo}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition flex items-center justify-center"
                      aria-label="Previous promo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextPromo}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition flex items-center justify-center"
                      aria-label="Next promo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {promos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setPromoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === promoIndex
                              ? "bg-white w-8"
                              : "bg-white/50"
                          }`}
                          aria-label={`Go to promo ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter & Products Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filter</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-#8E6447 hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Search with loading indicator */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#8E6447 focus:border-transparent"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-#8E6447"></div>
                    </div>
                  )}
                </div>
                {searchTerm && (
                  <p className="text-xs text-gray-500 mt-1">
                    {isSearching ? "Typing..." : `Searching for "${debouncedSearchTerm}"`}
                  </p>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Category</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={isFavorite}
                      onChange={(e) => setIsFavorite(e.target.checked)}
                      className="rounded text-#8E6447 focus:ring-#8E6447"
                    />
                    <span className="text-sm">Favorite Products</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategoryId === "1"}
                      onChange={(e) => handleCategoryChange('coffee', e.target.checked)}
                      className="rounded text-#8E6447 focus:ring-#8E6447"
                    />
                    <span className="text-sm">Coffee</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategoryId === "2"}
                      onChange={(e) => handleCategoryChange('nonCoffee', e.target.checked)}
                      className="rounded text-#8E6447 focus:ring-#8E6447"
                    />
                    <span className="text-sm">Non Coffee</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategoryId === "3"}
                      onChange={(e) => handleCategoryChange('food', e.target.checked)}
                      className="rounded text-#8E6447 focus:ring-#8E6447"
                    />
                    <span className="text-sm">Foods</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategoryId === "4"}
                      onChange={(e) => handleCategoryChange('addon', e.target.checked)}
                      className="rounded text-#8E6447 focus:ring-#8E6447"
                    />
                    <span className="text-sm">Add-On</span>
                  </label>
                </div>
              </div>

              {/* Special Offers */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Special Offers</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={isBuy1Get1}
                      onChange={(e) => setIsBuy1Get1(e.target.checked)}
                      className="rounded text-#8E6447 focus:ring-#8E6447"
                    />
                    <span className="text-sm">Buy 1 Get 1</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={isFlashSale}
                      onChange={(e) => setIsFlashSale(e.target.checked)}
                      className="rounded text-#8E6447 focus:ring-#8E6447"
                    />
                    <span className="text-sm">Flash Sale</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Price Range
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
                    }
                    className="w-full accent-#8E6447"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>IDR {priceRange.min.toLocaleString()}</span>
                    <span>IDR {priceRange.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilter(true)}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-#8E6447 text-white rounded-full shadow-lg flex items-center justify-center z-30 hover:bg-#7A5538 transition"
          >
            <SlidersHorizontal className="w-6 h-6" />
          </button>

          {/* Mobile Filter Drawer */}
          {isMobile && showFilter && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={() => setShowFilter(false)}
              />
              <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Filter</h3>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search with loading indicator (Mobile) */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#8E6447"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-#8E6447"></div>
                        </div>
                      )}
                    </div>
                    {searchTerm && (
                      <p className="text-xs text-gray-500 mt-1">
                        {isSearching ? "Typing..." : `Searching for "${debouncedSearchTerm}"`}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Category</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFavorite}
                          onChange={(e) => setIsFavorite(e.target.checked)}
                          className="rounded text-#8E6447"
                        />
                        <span className="text-sm">Favorite Products</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategoryId === "1"}
                          onChange={(e) => handleCategoryChange('coffee', e.target.checked)}
                          className="rounded text-#8E6447"
                        />
                        <span className="text-sm">Coffee</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategoryId === "2"}
                          onChange={(e) => handleCategoryChange('nonCoffee', e.target.checked)}
                          className="rounded text-#8E6447"
                        />
                        <span className="text-sm">Non Coffee</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategoryId === "3"}
                          onChange={(e) => handleCategoryChange('food', e.target.checked)}
                          className="rounded text-#8E6447"
                        />
                        <span className="text-sm">Foods</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategoryId === "4"}
                          onChange={(e) => handleCategoryChange('addon', e.target.checked)}
                          className="rounded text-#8E6447"
                        />
                        <span className="text-sm">Add-On</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Special Offers</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBuy1Get1}
                          onChange={(e) => setIsBuy1Get1(e.target.checked)}
                          className="rounded text-#8E6447"
                        />
                        <span className="text-sm">Buy 1 Get 1</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFlashSale}
                          onChange={(e) => setIsFlashSale(e.target.checked)}
                          className="rounded text-#8E6447"
                        />
                        <span className="text-sm">Flash Sale</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Price Range</label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="5000"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
                      }
                      className="w-full accent-#8E6447"
                    />
                    <div className="flex justify-between text-xs mt-2">
                      <span>IDR {priceRange.min.toLocaleString()}</span>
                      <span>IDR {priceRange.max.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={resetFilters}
                      className="flex-1 px-4 py-2.5 border border-#8E6447 text-#8E6447 rounded-lg hover:bg-#F9F6F0 transition"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="flex-1 px-4 py-2.5 bg-#8E6447 text-white rounded-lg hover:bg-#7A5538 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-#8E6447"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    {debouncedSearchTerm 
                      ? `No results for "${debouncedSearchTerm}". Try different keywords.`
                      : "Try adjusting your filters or search term"
                    }
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-#8E6447 text-white rounded-lg hover:bg-#7A5538 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="cursor-pointer transform transition hover:scale-105"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <MenuCard
                        title={product.name}
                        price={product.price.toLocaleString("id-ID")}
                        description={product.description}
                        image={product.image_url || product.imageUrl}
                        isFlashSale={product.is_flash_sale || product.isFlashSale}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={pagination.limit}
                      totalItems={pagination.totalItems}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;