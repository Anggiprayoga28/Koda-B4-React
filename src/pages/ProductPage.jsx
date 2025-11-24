import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
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
  const [promos, setPromo] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [categories, setCategories] = useState({
    favorite: searchParams.get("favorite") === "true",
    coffee: searchParams.get("coffee") === "true",
    nonCoffee: searchParams.get("nonCoffee") === "true",
    food: searchParams.get("food") === "true",
    addon: searchParams.get("addon") === "true",
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice")) || 30000,
    parseInt(searchParams.get("maxPrice")) || 75000,
  ]);
  const [promoIndex, setPromoIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [promoScrollProgress, setPromoScrollProgress] = useState(0);
  const promoScrollRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [productsPerPage, setProductsPerPage] = useState(
    window.innerWidth < 1024 ? 6 : 9
  );

  const [productImages, setProductImages] = useState({});

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
      const newPerPage = mobile ? 6 : 9;
      if (newPerPage !== productsPerPage) {
        setProductsPerPage(newPerPage);
        setCurrentPage(1);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [productsPerPage]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/products`, {
          params: { limit: 1000 },
        });

        if (response.data.success && response.data.data) {
          const data = response.data.data;
          setProducts(data);

          data.forEach((p) => {
            if (!p.id) return;
            if (productImages[p.id]) return;

            axios
              .get(`${API_BASE_URL}/products/${p.id}/detail`)
              .then((res) => {
                if (res.data && res.data.success && res.data.data) {
                  const detail = res.data.data;
                  const imgs = Array.isArray(detail.images)
                    ? detail.images
                    : [];
                  if (imgs.length > 0) {
                    const first = imgs[0];
                    const url =
                      first.url ||
                      first.image_url ||
                      first.imageUrl ||
                      first.ImageURL;
                    if (url) {
                      setProductImages((prev) => ({
                        ...prev,
                        [p.id]: url,
                      }));
                    }
                  }
                }
              })
              .catch((err) => {
                console.error("Error fetching product image for id", p.id, err);
              });
          });
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

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const params = {};

    if (searchTerm) params.search = searchTerm;
    if (categories.favorite) params.favorite = "true";
    if (categories.coffee) params.coffee = "true";
    if (categories.nonCoffee) params.nonCoffee = "true";
    if (categories.food) params.food = "true";
    if (categories.addon) params.addon = "true";
    if (sortBy) params.sort = sortBy;
    if (priceRange[0] !== 30000) params.minPrice = priceRange[0].toString();
    if (priceRange[1] !== 75000) params.maxPrice = priceRange[1].toString();
    if (currentPage > 1) params.page = currentPage.toString();

    setSearchParams(params);
  }, [
    searchTerm,
    categories,
    sortBy,
    priceRange,
    currentPage,
    setSearchParams,
  ]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const hasActiveCategory = Object.values(categories).some((v) => v);
    if (hasActiveCategory) {
      filtered = filtered.filter((p) => {
        if (categories.favorite && (p.is_favorite || p.isFavorite)) return true;
        if (categories.coffee && p.category_id === 1) return true;
        if (categories.nonCoffee && p.category_id === 2) return true;
        if (categories.food && p.category_id === 3) return true;
        if (categories.addon && p.category_id === 4) return true;
        return false;
      });
    }

    if (sortBy === "buy1get1") {
      filtered = filtered.filter((p) => p.is_buy1get1 || p.isBuy1Get1);
    } else if (sortBy === "flashsale") {
      filtered = filtered.filter((p) => p.is_flash_sale || p.isFlashSale);
    } else if (sortBy === "cheap") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    return filtered;
  }, [products, searchTerm, categories, sortBy, priceRange]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategories({
      favorite: false,
      coffee: false,
      nonCoffee: false,
      food: false,
      addon: false,
    });
    setSortBy("");
    setPriceRange([30000, 75000]);
    setCurrentPage(1);
    setSearchParams({});
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    categories.favorite,
    categories.coffee,
    categories.nonCoffee,
    categories.food,
    categories.addon,
    sortBy,
  ]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePromoScroll = (e) => {
    const container = e.target;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
    setPromoScrollProgress(progress);
  };

  const nextPromo = () => {
    if (promos.length > 3) {
      setPromoIndex((prev) => (prev + 1) % Math.max(1, promos.length - 3));
    }
  };

  const prevPromo = () => {
    if (promos.length > 3) {
      setPromoIndex(
        (prev) =>
          (prev - 1 + Math.max(1, promos.length - 3)) %
          Math.max(1, promos.length - 3)
      );
    }
  };

  if (isPaymentMode) {
    return <ProductPaymentDetails />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div
        className="relative h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-start px-4 sm:px-8 lg:px-16"
        style={{
          backgroundImage: "url(/cover-product.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <h1 className="relative text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-xl leading-tight font-bold">
          We Provide Good Coffee and Healthy Meals
        </h1>
      </div>

      <div className="w-full bg-white py-6 sm:py-8 lg:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-light">
            Today <span className="text-orange-500 font-semibold">Promo</span>
          </h2>
          <div className="hidden lg:flex gap-2 sm:gap-3">
            <button
              onClick={prevPromo}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
            </button>
            <button
              onClick={nextPromo}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-orange-500 rounded-full flex items-center justify-center hover:bg-[#A5A58D] transition text-white"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        <div
          ref={promoScrollRef}
          onScroll={handlePromoScroll}
          className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8"
        >
          <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 pb-4 max-w-7xl mx-auto">
            {promos.map((promo, idx) => (
              <div
                key={idx}
                className={`${promo.bgColor} rounded-2xl p-4 sm:p-5 lg:p-6 flex items-center gap-3 sm:gap-4 min-w-[280px] sm:min-w-[320px] lg:min-w-0 flex-shrink-0`}
              >
                {idx % 2 === 0 ? (
                  <>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center flex-shrink-0">
                      <img src="/mother.svg" className="w-full" alt="promo" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm mb-1 sm:mb-1.5 leading-tight font-semibold">
                        {promo.title}
                      </h3>
                      <p className="text-xs mb-1.5 sm:mb-2.5 leading-snug line-clamp-2">
                        {promo.description}
                      </p>
                      <button className="text-xs text:white bg-black bg-opacity-20 px-3 py-1 rounded">
                        {promo.code}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm mb-1 sm:mb-1.5 leading-tight font-semibold">
                        {promo.title}
                      </h3>
                      <p className="text-xs leading-snug line-clamp-2">
                        {promo.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center flex-shrink-0">
                      <img src="/father.png" className="w-full" alt="promo" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:hidden px-4 sm:px-6 mt-4">
          <div className="flex gap-2 items-center justify-center">
            {[0, 1, 2, 3].map((idx) => {
              const totalDots = Math.min(4, promos.length || 1);
              const isActive =
                Math.floor((promoScrollProgress / 100) * totalDots) === idx;
              return (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? "w-12 bg-orange-500" : "w-2 bg-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 sm:mb-6 lg:mb-8">
          Our <span className="text-orange-500 font-semibold">Product</span>
        </h2>

        <div className="lg:hidden mb-4 sm:mb-6 flex gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Find Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 pl-10 text-sm sm:text-base"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-orange-500 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:bg-[#A5A58D] transition flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex gap-6 lg:gap-8">
          <div className="hidden lg:block w-64 bg-black text-white rounded-lg p-6 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Filter</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-orange-500 hover:underline"
              >
                Reset Filter
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">Search</label>
              <input
                type="text"
                placeholder="Search Your Product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded bg-white text-black"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-3">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.favorite}
                    onChange={(e) =>
                      setCategories({
                        ...categories,
                        favorite: e.target.checked,
                      })
                    }
                    className="rounded cursor-pointer"
                  />
                  <span className="text-sm">Favorite Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.coffee}
                    onChange={(e) =>
                      setCategories({
                        ...categories,
                        coffee: e.target.checked,
                      })
                    }
                    className="rounded cursor-pointer"
                  />
                  <span className="text-sm">Coffee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.nonCoffee}
                    onChange={(e) =>
                      setCategories({
                        ...categories,
                        nonCoffee: e.target.checked,
                      })
                    }
                    className="rounded cursor-pointer"
                  />
                  <span className="text-sm">Non Coffee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.food}
                    onChange={(e) =>
                      setCategories({
                        ...categories,
                        food: e.target.checked,
                      })
                    }
                    className="rounded cursor-pointer"
                  />
                  <span className="text-sm">Foods</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.addon}
                    onChange={(e) =>
                      setCategories({
                        ...categories,
                        addon: e.target.checked,
                      })
                    }
                    className="rounded cursor-pointer"
                  />
                  <span className="text-sm">Add-On</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-3">Sort By</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "buy1get1"}
                    onChange={() => setSortBy("buy1get1")}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Buy 1 get 1</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "flashsale"}
                    onChange={() => setSortBy("flashsale")}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Flash sale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "cheap"}
                    onChange={() => setSortBy("cheap")}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Cheap</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-3">Range Price</label>
              <input
                type="range"
                min="30000"
                max="75000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([30000, parseInt(e.target.value)])
                }
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs mt-2">
                <span>IDR {priceRange[0].toLocaleString()}</span>
                <span>IDR {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {showFilter && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setShowFilter(false)}
              />
              <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-black text-white z-50 p-6 overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Filter</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-orange-500 hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search Your Product"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white text-black"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-3">Category</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categories.favorite}
                        onChange={(e) =>
                          setCategories({
                            ...categories,
                            favorite: e.target.checked,
                          })
                        }
                        className="rounded cursor-pointer"
                      />
                      <span className="text-sm">Favorite Product</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categories.coffee}
                        onChange={(e) =>
                          setCategories({
                            ...categories,
                            coffee: e.target.checked,
                          })
                        }
                        className="rounded cursor-pointer"
                      />
                      <span className="text-sm">Coffee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categories.nonCoffee}
                        onChange={(e) =>
                          setCategories({
                            ...categories,
                            nonCoffee: e.target.checked,
                          })
                        }
                        className="rounded cursor-pointer"
                      />
                      <span className="text-sm">Non Coffee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categories.food}
                        onChange={(e) =>
                          setCategories({
                            ...categories,
                            food: e.target.checked,
                          })
                        }
                        className="rounded cursor-pointer"
                      />
                      <span className="text-sm">Foods</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categories.addon}
                        onChange={(e) =>
                          setCategories({
                            ...categories,
                            addon: e.target.checked,
                          })
                        }
                        className="rounded cursor-pointer"
                      />
                      <span className="text-sm">Add-On</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-3">Sort By</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort-mobile"
                        checked={sortBy === "buy1get1"}
                        onChange={() => setSortBy("buy1get1")}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Buy 1 get 1</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort-mobile"
                        checked={sortBy === "flashsale"}
                        onChange={() => setSortBy("flashsale")}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Flash sale</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort-mobile"
                        checked={sortBy === "cheap"}
                        onChange={() => setSortBy("cheap")}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Cheap</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-3">Range Price</label>
                  <input
                    type="range"
                    min="30000"
                    max="75000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([30000, parseInt(e.target.value)])
                    }
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-xs mt-2">
                    <span>IDR {priceRange[0].toLocaleString()}</span>
                    <span>IDR {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilter(false)}
                  className="w-full mt-4 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-[#A5A58D] transition text-sm font-semibold"
                >
                  Apply Filter
                </button>
              </div>
            </>
          )}

          <div className="flex-1">
            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No products found with current filter.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <MenuCard
                        title={product.name}
                        price={product.price.toLocaleString("id-ID")}
                        description={product.description}
                        image={
                          productImages[product.id] ||
                          product.image_url ||
                          product.image
                        }
                        isFlashSale={
                          product.is_flash_sale || product.isFlashSale
                        }
                      />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      itemsPerPage={productsPerPage}
                      totalItems={filteredProducts.length}
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
