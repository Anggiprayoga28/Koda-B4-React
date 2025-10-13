import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from './MenuCard';
import { getProducts } from '../../services/apiService';

const MenuSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        
        if (data && Array.isArray(data)) {
          setProducts(data.slice(0, 6));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  return (
    <section id="menu" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
            Special Menu <span className="text-orange-500 font-semibold">For You</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Best menu of the week and gets discounts of up to 30%, also you can have it as an affordable price
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {products.map((product) => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="cursor-pointer"
              >
                <MenuCard
                  title={product.name}
                  price={product.price.toLocaleString()}
                  description={product.description}
                  image={product.image}
                  rating={product.rating}
                  originalPrice={product.originalPrice}
                  isFlashSale={product.isFlashSale}
                  isBuy1Get1={product.isBuy1Get1}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;