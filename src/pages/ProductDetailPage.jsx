import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import MenuCard from '../components/landing/MenuCard';
import Pagination from '../components/admin/Pagination';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedTemp, setSelectedTemp] = useState('Ice');
  const [currentImage, setCurrentImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 3;

  useEffect(() => {
    let isMounted = true;
    
    const fetchProductData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const productResponse = await axios.get(`${API_BASE_URL}/products/${id}`);
        
        if (!productResponse.data.success || !productResponse.data.data) {
          throw new Error('Product not found');
        }
        
        if (isMounted) {
          const productData = productResponse.data.data;
          setProduct(productData);
        }
        
        const allProductsResponse = await axios.get(`${API_BASE_URL}/products`, {
          params: { limit: 1000 }
        });
        
        if (allProductsResponse.data.success && allProductsResponse.data.data && isMounted) {
          let recommendations = allProductsResponse.data.data.filter(p => p.id !== parseInt(id));
          
          const productData = productResponse.data.data;
          if (productData.category_id) {
            const sameCategory = recommendations.filter(p => p.category_id === productData.category_id);
            const otherCategory = recommendations.filter(p => p.category_id !== productData.category_id);
            recommendations = [...sameCategory, ...otherCategory];
          }
          
          setAllRecommendations(recommendations);
        }
        
      } catch (err) {
        console.error('Error fetching product:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductData();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Coffee Shop`;
    }
    
    return () => {
      document.title = 'Coffee Shop';
    };
  }, [product]);

  useEffect(() => {
    setCurrentPage(1);
    setQuantity(1);
    setSelectedSize('Regular');
    setSelectedTemp('Ice');
    setCurrentImage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const productImages = useMemo(() => {
    if (!product) return ['/placeholder.png'];
    
    const images = [];
    
    if (product.image_url || product.image) {
      images.push(product.image_url || product.image);
    } else {
      images.push('/placeholder.png');
    }
    
    while (images.length < 4) {
      images.push(`/coffee${images.length}.png`);
    }
    
    return images;
  }, [product?.image_url, product?.image]);

  const totalPages = Math.ceil(allRecommendations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecommendations = allRecommendations.slice(indexOfFirstItem, indexOfLastItem);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    try {
      addToCart(product, quantity, selectedSize, selectedTemp);
      navigate('/product?payment=true');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      addToCart(product, quantity, selectedSize, selectedTemp);
      navigate('/product?payment=true');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const handleRecommendationClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toLocaleString('id-ID') : price;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The product you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/product')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-10">
            <div>
              <div className="mb-4 overflow-hidden bg-gray-100 rounded-lg">
                <img
                  src={productImages[currentImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder.png';
                  }}
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={`img-${index}`}
                    onClick={() => setCurrentImage(index)}
                    className={`overflow-hidden rounded-lg transition-all ${
                      currentImage === index 
                        ? 'ring-2 ring-[#FF8906]' 
                        : 'ring-2 ring-transparent hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              {(product.isFlashSale || product.is_flash_sale) && (
                <span className="inline-block bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-full mb-2">
                  FLASH SALE {discountPercentage > 0 && `${discountPercentage}%`}
                </span>
              )}
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {product.category && (
                <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 text-sm rounded-full mb-3">
                  {product.category}
                </span>
              )}

              <div className="flex items-baseline gap-3 mb-3">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    IDR {formatPrice(product.originalPrice || product.original_price)}
                  </span>
                )}
                <span className="text-3xl font-bold text-orange-500">
                  IDR {formatPrice(product.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={`star-${i}`}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5) 
                          ? 'fill-orange-400 text-orange-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`} 
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium">
                    {product.rating || '5.0'}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">
                  {product.reviewCount || product.review_count || '200+'} Review
                </span>
              </div>

              {product.stock !== undefined && (
                <div className="mb-4">
                  <span className={`text-sm font-medium ${
                    product.stock > 10 ? 'text-green-600' : 
                    product.stock > 0 ? 'text-orange-600' : 
                    'text-red-600'
                  }`}>
                    {product.stock > 0 ? `Stock: ${product.stock} available` : 'Out of Stock'}
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {product.description || 'Delicious coffee made with premium ingredients.'}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-9 h-9 border-2 border-[#FF8906] text-[#0B0909] flex items-center justify-center hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={product.stock && quantity >= product.stock}
                    className="w-9 h-9 bg-[#FF8906] text-[#0B0909] flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Regular', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 text-sm font-medium rounded transition-colors ${
                        selectedSize === size
                          ? 'bg-white ring-2 ring-[#FF8906] text-[#0B0909]'
                          : 'bg-white ring-2 ring-gray-300 text-gray-700 hover:ring-orange-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hot/Ice?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Ice', 'Hot'].map((temp) => (
                    <button
                      key={temp}
                      onClick={() => setSelectedTemp(temp)}
                      className={`py-2 px-4 text-sm font-medium rounded transition-colors ${
                        selectedTemp === temp
                          ? 'ring-2 ring-[#FF8906] text-[#0B0909]'
                          : 'ring-2 ring-gray-300 text-gray-700 hover:ring-orange-300'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-[#FF8906] hover:bg-orange-600 text-black py-3 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="ring-2 ring-orange-500 text-orange-500 hover:bg-orange-50 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Recommendation <span className="text-gray-500">For You</span>
          </h2>
          
          {currentRecommendations.length > 0 ? (
            <>
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
                      image={item.image_url || item.image}
                      isFlashSale={item.isFlashSale || item.is_flash_sale}
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
                  totalItems={allRecommendations.length}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No recommendations available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;