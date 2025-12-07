import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, ShoppingCart, Star, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import MenuCard from "../components/landing/MenuCard";
import Pagination from "../components/admin/Pagination";
import { ProductImage } from "../components/landing/ProductImage";

import { getProductDetail, clearProductDetail } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";

const formatPrice = (price) => {
  return `IDR ${price?.toLocaleString("id-ID") || 0}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const {
    currentProduct: product,
    images,
    sizes,
    temperatures,
    reviews,
    recommendations,
    averageRating,
    totalReviews,
    detailLoading: loading,
    detailError: error,
  } = useSelector((state) => state.product);

  const { loading: cartLoading } = useSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedTemp, setSelectedTemp] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedTempId, setSelectedTempId] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }

    return () => {
      dispatch(clearProductDetail());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (sizes?.length > 0 && !selectedSizeId) {
      const defaultSize = sizes[0];
      setSelectedSize(defaultSize.name);
      setSelectedSizeId(defaultSize.id);
    }

    if (temperatures?.length > 0 && !selectedTempId) {
      const defaultTemp = temperatures[0];
      setSelectedTemp(defaultTemp.name);
      setSelectedTempId(defaultTemp.id);
    }
  }, [sizes, temperatures, selectedSizeId, selectedTempId]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Coffee Shop`;
    }
    return () => {
      document.title = "Coffee Shop";
    };
  }, [product]);

  useEffect(() => {
    setCurrentPage(1);
    setQuantity(1);
    setCurrentImage(0);
    setSelectedSizeId(null);
    setSelectedTempId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const productImages = useMemo(() => {
    if (images?.length > 0) {
      return images.map((img) => img.url).filter(Boolean);
    }

    if (product?.image_url) {
      return [product.image_url];
    }

    return ["https://www.svgrepo.com/show/508699/landscape-placeholder.svg"];
  }, [images, product]);

  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecommendations = recommendations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleQuantityChange = useCallback(
    (delta) => {
      if (!product) return;

      const newQuantity = quantity + delta;
      if (newQuantity < 1) return;
      if (product.stock && newQuantity > product.stock) {
        toast.warning(`Only ${product.stock} items available`);
        return;
      }
      setQuantity(newQuantity);
    },
    [product, quantity]
  );

  const handleSizeChange = useCallback((size) => {
    setSelectedSize(size.name);
    setSelectedSizeId(size.id);
  }, []);

  const handleTempChange = useCallback((temp) => {
    setSelectedTemp(temp.name);
    setSelectedTempId(temp.id);
  }, []);

  const calculateFinalPrice = useCallback(() => {
    if (!product) return 0;

    let price = product.price || 0;

    const selectedSizeObj = sizes.find((s) => s.id === selectedSizeId);
    if (selectedSizeObj?.priceAdjustment) {
      price += selectedSizeObj.priceAdjustment;
    }

    return price;
  }, [product, sizes, selectedSizeId]);

  const finalPrice = calculateFinalPrice();

  const handleRecommendationClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async () => {
    if (cartLoading) return;

    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!product) {
      toast.error("Product information not available");
      return;
    }

    const cartItem = {
      productId: product.id,
      quantity,
      sizeId: selectedSizeId,
      temperatureId: selectedTempId,
    };

    try {
      const result = await dispatch(addToCart(cartItem)).unwrap();
      toast.success(result.message || "Product added to cart!");
    } catch (error) {
      toast.error(error || "Failed to add to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      await handleAddToCart();
      setTimeout(() => {
        navigate("/cart");
      }, 500);
    } catch (error) {
      console.error("Buy now error:", error);
    }
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-#8E6447 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-#8E6447 text-white rounded-lg hover:bg-#7A5538 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <ProductImage
                  src={productImages[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentImage === index
                          ? "border-[#8E6447] ring-2 ring-[#C5A053]"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <ProductImage
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              {product.is_flash_sale && (
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium mb-3 w-fit">
                  ⚡ Flash Sale
                </div>
              )}

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              <div className="text-3xl font-bold text-#8E6447 mb-4">
                {formatPrice(finalPrice)}
                {product.is_flash_sale && product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through ml-3">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? "fill-#C5A053 text-#C5A053"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {totalReviews || 0} Review{totalReviews !== 1 ? "s" : ""}
                </span>
              </div>

              {product.stock !== undefined && (
                <div className="mb-4">
                  <span
                    className={`text-sm font-medium ${
                      product.stock > 10
                        ? "text-green-600"
                        : product.stock > 0
                          ? "text-#7A5538"
                          : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `Stock: ${product.stock} available`
                      : "Out of Stock"}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <em>
                    Note: Items may arrive less cold due to delivery time.
                    Product look may vary due to delivery.
                  </em>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 border-2 border-[#8E6447] text-[#0B0909] flex items-center justify-center hover:bg-#F9F6F0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={product.stock && quantity >= product.stock}
                    className="w-10 h-10 bg-[#8E6447] text-[#0B0909] flex items-center justify-center hover:bg-#7A5538 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleSizeChange(size)}
                        className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                          selectedSizeId === size.id
                            ? "bg-#F9F6F0 ring-2 ring-[#8E6447] text-[#0B0909]"
                            : "bg-white ring-2 ring-gray-300 text-gray-700 hover:ring-orange-300"
                        }`}
                      >
                        <div className="font-medium">{size.name}</div>
                        {size.priceAdjustment > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{formatPrice(size.priceAdjustment)}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {temperatures.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {temperatures.map((temp) => (
                      <button
                        key={temp.id}
                        onClick={() => handleTempChange(temp)}
                        className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                          selectedTempId === temp.id
                            ? "bg-#F9F6F0 ring-2 ring-[#8E6447] text-[#0B0909]"
                            : "bg-white ring-2 ring-gray-300 text-gray-700 hover:ring-orange-300"
                        }`}
                      >
                        {temp.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || cartLoading}
                  className="bg-[#8E6447] hover:bg-#7A5538 text-white py-3 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartLoading ? "Processing..." : "Buy Now"}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || cartLoading}
                  className="ring-2 ring-#8E6447 text-#8E6447 hover:bg-#F9F6F0 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{cartLoading ? "Adding..." : "Add to Cart"}</span>
                </button>
              </div>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="border-t border-gray-200 p-6 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Reviews ({totalReviews})
              </h3>
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div
                    key={`review-${index}-${review.user}`}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.user}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={`review-star-${i}`}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-#C5A053 text-#C5A053"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              You Might Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentRecommendations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRecommendationClick(item.id)}
                  className="cursor-pointer transform hover:scale-105 transition-transform"
                >
                  <MenuCard
                    title={item.name}
                    price={formatPrice(item.price)}
                    description={item.description}
                    image={item.imageUrl || item.image_url}
                    isFlashSale={item.isFlashSale || item.is_flash_sale}
                    isFavorite={item.is_favorite}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={recommendations.length}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;