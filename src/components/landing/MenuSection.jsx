import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from './MenuCard';
import { getFavoriteProducts } from '../../services/apiService';

const MenuSection = () => {
  const navigate = useNavigate();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavoriteProducts();
  }, []);

  const fetchFavoriteProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getFavoriteProducts();
      
      console.log('Favorite products from backend:', data);
      
      setFavoriteProducts(data.slice(0, 6));
    } catch (err) {
      console.error('Error fetching favorite products:', err);
      setError('Failed to load favorite products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleSeeMore = () => {
    navigate('/product?favorite=true');
  };

  if (loading) {
    return (
      <section id="menu" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
              Here is People's <span className="text-orange-500 font-semibold">Favorite</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Let's choose and have a bit taste of people's favorite. It might be yours too!
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
              Here is People's <span className="text-orange-500 font-semibold">Favorite</span>
            </h2>
          </div>
          
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchFavoriteProducts}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
            Here is People's <span className="text-orange-500 font-semibold">Favorite</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Let's choose and have a bit taste of people's favorite. It might be yours too!
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No favorite products available yet</p>
            <button 
              onClick={() => navigate('/product')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
              {favoriteProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product.id)}
                  className="cursor-pointer transform transition-transform hover:scale-105"
                >
                  <MenuCard
                    title={product.name}
                    price={product.price?.toLocaleString() || '0'}
                    originalPrice={(product.price * 1.3).toFixed(0)}
                    description={product.description || ''}
                    image={product.image_url || '/default-product.png'}
                    isFlashSale={product.is_flash_sale || false}
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleSeeMore}
                className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                See More
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MenuSection;