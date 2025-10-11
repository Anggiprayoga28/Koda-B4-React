import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { products } from '../data/products';
import MenuCard from '../components/landing/MenuCard';
import Pagination from '../components/admin/Pagination';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedTemp, setSelectedTemp] = useState('Ice');
  const [currentImage, setCurrentImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const product = products.find(p => p.id === parseInt(id)) || products[0];

  useEffect(() => {
    document.title = `${product.name} - Coffee Shop`;
  }, [product.name]);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [id]);
  
  const productImages = [
    product.image,
    '/public/coffee1.png',
    '/public/coffee2.png',
    '/public/coffee3.png'
  ];

  const allRecommendations = products.filter(p => p.id !== product.id);

  const totalPages = Math.ceil(allRecommendations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecommendations = allRecommendations.slice(indexOfFirstItem, indexOfLastItem);

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleBuyNow = () => {
    const cartItem = {
      ...product,
      quantity: quantity,
      size: selectedSize,
      temp: selectedTemp,
      cartId: Date.now()
    };
    
    const tempCart = JSON.parse(sessionStorage.getItem('tempCart') || '[]');
    tempCart.push(cartItem);
    sessionStorage.setItem('tempCart', JSON.stringify(tempCart));
    
    navigate('/product?payment=true');
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity: quantity,
      size: selectedSize,
      temp: selectedTemp,
      cartId: Date.now()
    };
    
    const tempCart = JSON.parse(sessionStorage.getItem('tempCart') || '[]');
    tempCart.push(cartItem);
    sessionStorage.setItem('tempCart', JSON.stringify(tempCart));
    
    navigate('/product?payment=true');
  };

  const handleRecommendationClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-10">
            <div>
              <div className="mb-4 overflow-hidden bg-gray-100">
                <img
                  src={productImages[currentImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`overflow-hidden transition-all ${
                      currentImage === index 
                        ? 'border-2 border-[#FF8906]' 
                        : 'border-2 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              {product.isFlashSale && (
                <span className="inline-block bg-red-600 text-white px-3 py-1 text-xs rounded-full mb-2">
                  FLASH SALE!
                </span>
              )}
              
              <h1 className="text-3xl lg:text-4xl text-gray-900 mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-sm text-red-600 line-through">
                  IDR {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-2xl text-orange-500">
                  IDR {product.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">200+ Review</span>
                <span className="text-gray-400">|</span>
                <button className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600">
                  <span>Recommendation</span>
                  <span role="img" aria-label="thumbs up">
                    <img src="/public/thumbsUp.png" alt="Thumbs Up" className="w-4 h-4" />
                  </span>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-9 h-9 border-2 border-[#FF8906] text-[#0B0909] flex items-center justify-center hover:bg-orange-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-9 h-9 bg-[#FF8906] text-[#0B0909] flex items-center justify-center hover:bg-orange-500 transition-colors"
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
                      className={`py-2 px-4 text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-white border-2 border-[#FF8906] text-[#0B0909]'
                          : 'border-2 border-gray-300 text-gray-700 hover:border-orange-300'
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
                      className={`py-2 px-4 text-sm font-medium transition-colors ${
                        selectedTemp === temp
                          ? 'border-2 border-[#FF8906] text-[#0B0909]'
                          : 'border-2 border-gray-300 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#FF8906] hover:bg-orange-600 text-black py-2.5 font-medium transition-colors"
                >
                  Buy
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-2.5 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>add to cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl text-gray-900 mb-8">
            Recommendation <span className="text-gray-500">For You</span>
          </h2>
          
          {currentRecommendations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">
                {currentRecommendations.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleRecommendationClick(item.id)}
                    className="cursor-pointer"
                  >
                    <MenuCard
                      title={item.name}
                      price={item.price.toLocaleString()}
                      description={item.description}
                      image={item.image}
                      isFlashSale={item.isFlashSale === true}
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
            <div className="text-center py-8">
              <p className="text-gray-500">No recommendations available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;