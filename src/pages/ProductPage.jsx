import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { getProducts, getPromos } from '../services/apiService';
import MenuCard from '../components/landing/MenuCard';
import Pagination from '../components/admin/Pagination';
import Notification from '../components/ui/Notification';

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const { createOrder } = useOrders();
  
  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [categories, setCategories] = useState({
    favorite: searchParams.get('favorite') === 'true',
    coffee: searchParams.get('coffee') === 'true',
    nonCoffee: searchParams.get('nonCoffee') === 'true',
    food: searchParams.get('food') === 'true',
    addon: searchParams.get('addon') === 'true'
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice')) || 5000,
    parseInt(searchParams.get('maxPrice')) || 50000
  ]);
  const [promoIndex, setPromoIndex] = useState(0);
  const [showPayment, setShowPayment] = useState(searchParams.get('payment') === 'true');
  const [showFilter, setShowFilter] = useState(false);
  const [promoScrollProgress, setPromoScrollProgress] = useState(0);
  const promoScrollRef = React.useRef(null);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    fullName: '',
    address: '',
    delivery: 'Dine in'
  });
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [notification, setNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const productsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && productsPerPage === 9) {
        setCurrentPage(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [productsPerPage]);

  useEffect(() => {
    document.title = 'Our Products - Coffee Shop | Best Coffee & Food';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, promosData] = await Promise.all([
          getProducts(),
          getPromos()
        ]);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setPromos(Array.isArray(promosData) ? promosData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setProducts([]);
        setPromos([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchParams.get('payment') === 'true') {
      setShowPayment(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = {};
    
    if (searchTerm) params.search = searchTerm;
    if (categories.favorite) params.favorite = 'true';
    if (categories.coffee) params.coffee = 'true';
    if (categories.nonCoffee) params.nonCoffee = 'true';
    if (categories.food) params.food = 'true';
    if (categories.addon) params.addon = 'true';
    if (sortBy) params.sort = sortBy;
    if (priceRange[0] !== 5000) params.minPrice = priceRange[0].toString();
    if (priceRange[1] !== 50000) params.maxPrice = priceRange[1].toString();
    if (currentPage > 1) params.page = currentPage.toString();
    if (showPayment) params.payment = 'true';
    
    setSearchParams(params);
  }, [searchTerm, categories, sortBy, priceRange, currentPage, showPayment, setSearchParams]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handlePromoScroll = (e) => {
    const container = e.target;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const progress = (scrollLeft / scrollWidth) * 100;
    setPromoScrollProgress(progress);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    const hasActiveCategory = Object.values(categories).some(v => v);
    if (hasActiveCategory) {
      filtered = filtered.filter(p => {
        if (categories.favorite && p.isFavorite) return true;
        if (categories.coffee && p.category === 'coffee') return true;
        if (categories.nonCoffee && p.category === 'non-coffee') return true;
        if (categories.food && p.category === 'food') return true;
        if (categories.addon && p.category === 'addon') return true;
        return false;
      });
    }
    if (sortBy === 'buy1get1') {
      filtered = filtered.filter(p => p.isBuy1Get1);
    } else if (sortBy === 'flashsale') {
      filtered = filtered.filter(p => p.isFlashSale);
    } else if (sortBy === 'cheap') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    return filtered;
  }, [products, searchTerm, categories, sortBy, priceRange]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategories({ favorite: false, coffee: false, nonCoffee: false, food: false, addon: false });
    setSortBy('');
    setPriceRange([5000, 50000]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const nextPromo = () => {
    if (promos.length > 0) {
      setPromoIndex((prev) => (prev + 1) % (promos.length - 2));
    }
  };
  
  const prevPromo = () => {
    if (promos.length > 0) {
      setPromoIndex((prev) => (prev - 1 + (promos.length - 2)) % (promos.length - 2));
    }
  };

  const calculateTotal = () => {
    const orderTotal = getCartTotal();
    const delivery = 0;
    const tax = orderTotal * 0.1;
    return { orderTotal, delivery, tax, subTotal: orderTotal + delivery + tax };
  };

  const handleCheckout = () => {
    if (!customerInfo.email || !customerInfo.fullName || !customerInfo.address) {
      showNotification('Please fill in all customer information', 'error');
      return;
    }

    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }

    const totals = calculateTotal();
    
    const newOrder = createOrder({
      items: cart,
      customerInfo: customerInfo,
      orderTotal: totals.orderTotal,
      delivery: totals.delivery,
      tax: totals.tax,
      total: totals.subTotal,
      userId: user ? user.id : null
    });

    clearCart();

    navigate('/history-order', { 
      state: { 
        orderId: newOrder.orderId,
        message: 'Order placed successfully!',
        fromCheckout: true
      } 
    });
  };

  const handleBackToProduct = () => {
    setShowPayment(false);
    const params = Object.fromEntries(searchParams.entries());
    delete params.payment;
    setSearchParams(params);
  };

  if (showPayment) {
    const totals = calculateTotal();
    
    return (
      <div className="bg-gray-50 min-h-screen">
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-8">Payment Details</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">Your Order</h2>
                <button 
                  onClick={handleBackToProduct}
                  className="bg-[#FF8906] text-[#0B132A] px-4 sm:px-6 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 text-sm sm:text-base"
                >
                  + Add Menu
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button 
                    onClick={handleBackToProduct}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="bg-[#E8E8E84D] p-3 sm:p-4 mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      {item.isFlashSale && (
                        <span className="bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs rounded-xl inline-block mb-1 sm:mb-2">FLASH SALE!</span>
                      )}
                      <h3 className="font-bold text-base sm:text-lg mb-1 truncate">{item.name}</h3>
                      <p className="text-[#4F5665] text-sm sm:text-lg mb-1 sm:mb-2">
                        {item.quantity}pcs | {item.size} | {item.temp} | {customerInfo.delivery}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="text-red-600 line-through text-xs sm:text-sm">IDR {item.originalPrice.toLocaleString()}</span>
                        <span className="text-[#FF8906] text-lg sm:text-xl font-semibold">IDR {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-red-500 hover:text-red-700 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0"
                    >
                      <img src="/public/icons/XCircle.svg" alt="X" className="w-full h-full" />
                    </button>
                  </div>
                ))
              )}

              <div className="mt-6 sm:mt-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Payment Info & Delivery</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="Enter Your Email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg pl-10 text-sm sm:text-base"
                      />
                      <img src='/public/icons/mail.svg' className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-3 sm:top-4 text-gray-400" alt="mail" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Enter Your Full Name"
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg pl-10 text-sm sm:text-base"
                      />
                      <img src='/public/icons/Profile.svg' className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-3 sm:top-4 text-gray-400" alt="profile" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Enter Your Address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg pl-10 text-sm sm:text-base"
                      />
                      <img src='/public/icons/Location.svg' className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-3 sm:top-4 text-gray-400" alt="location" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      {['Dine in', 'Door Delivery', 'Pick Up'].map((method) => (
                        <button 
                          key={method}
                          onClick={() => setCustomerInfo({...customerInfo, delivery: method})}
                          className={`border-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-base ${
                            customerInfo.delivery === method 
                              ? 'border-[#FF8906] bg-white text-[#0B0909]'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl mb-4 sm:mb-6">Total</h3>
              <div className="bg-[#E8E8E84D] p-4 sm:p-6 sticky top-4">  
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Order</span>
                    <span className="font-semibold">Idr. {totals.orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold">Idr. {totals.delivery.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">Idr. {Math.round(totals.tax).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 sm:pt-3 flex justify-between">
                    <span className="font-semibold text-sm sm:text-base">Sub Total</span>
                    <span className="text-base sm:text-lg font-semibold">Idr. {Math.round(totals.subTotal).toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#FF8906] text-[#0B0909] py-2.5 sm:py-3 rounded-lg hover:bg-orange-600 transition mb-4 sm:mb-6 text-sm sm:text-base font-semibold"
                >
                  Checkout
                </button>

                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">We Accept</p>
                  <div className="grid grid-cols-3 gap-2 mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 flex items-center justify-center">
                      <img src="/public/BRI.svg" alt="BRI" className="h-4 sm:h-5" />
                    </div>
                    <div className="p-1.5 sm:p-2 flex items-center justify-center">
                      <img src="/public/dana.svg" alt="DANA" className="h-4 sm:h-5" />
                    </div>
                    <div className="p-1.5 sm:p-2 flex items-center justify-center">
                      <img src="/public/bca.svg" alt="BCA" className="h-4 sm:h-5" />
                    </div>
                    <div className="p-1.5 sm:p-2 flex items-center justify-center">
                      <img src="/public/gopay.svg" alt="gopay" className="h-4 sm:h-5" />
                    </div>
                    <div className="p-1.5 sm:p-2 flex items-center justify-center">
                      <img src="/public/ovo.svg" alt="OVO" className="h-4 sm:h-5" />
                    </div>
                    <div className="p-1.5 sm:p-2 flex items-center justify-center">
                      <img src="/public/paypal.svg" alt="PayPal" className="h-4 sm:h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">*Get Discount if you pay with Bank Central Asia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-start px-4 sm:px-8 lg:px-16" style={{ backgroundImage: 'url(/public/cover-product.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <h1 className="relative text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-xl leading-tight font-bold">
          We Provide Good Coffee and Healthy Meals
        </h1>
      </div>

      <div className="w-full bg-white py-6 sm:py-8 lg:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-light">
            Today <span className="text-orange-500 font-semibold">Promo</span>
          </h2>
          <div className="hidden lg:flex gap-2 sm:gap-3">
            <button onClick={prevPromo} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
            </button>
            <button onClick={nextPromo} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition text-white">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={promoScrollRef}
          onScroll={handlePromoScroll}
          className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8"
        >
          <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 pb-4">
            {promos.map((promo, idx) => (
              <div 
                key={idx} 
                className={`${promo.bgColor} rounded-2xl p-4 sm:p-5 lg:p-6 flex items-center gap-3 sm:gap-4 min-w-[280px] sm:min-w-[320px] lg:min-w-0 flex-shrink-0`}
              >
                {idx % 2 === 0 ? (
                  <>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center flex-shrink-0">
                      <img src='/public/mother.svg' className="w-full" alt="promo" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm mb-1 sm:mb-1.5 leading-tight font-semibold">{promo.title}</h3>
                      <p className="text-xs mb-1.5 sm:mb-2.5 leading-snug line-clamp-2">{promo.description}</p>
                      <button className="text-xs text-white bg-black bg-opacity-20 px-3 py-1 rounded">{promo.code}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm mb-1 sm:mb-1.5 leading-tight font-semibold">{promo.title}</h3>
                      <p className="text-xs leading-snug line-clamp-2">{promo.description}</p>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center flex-shrink-0">
                      <img src='/public/father.png' className="w-full" alt="promo" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:hidden px-4 sm:px-6 mt-4">
          <div className="flex gap-2 items-center">
            {[0, 1, 2, 3].map((idx) => {
              const isActive = Math.floor((promoScrollProgress / 100) * 4) === idx;
              return (
                <div 
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-12 bg-orange-500' : 'w-2 bg-gray-300'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

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
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="bg-orange-500 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex gap-6 lg:gap-8">
          <div className="hidden lg:block w-64 bg-black text-white rounded-lg p-6 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Filter</h3>
              <button onClick={resetFilters} className="text-sm text-orange-500 hover:underline">Reset Filter</button>
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-2">Search</label>
              <input type="text" placeholder="Search Your Product" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-black" />
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-3">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categories.favorite} onChange={(e) => setCategories({...categories, favorite: e.target.checked})} className="rounded cursor-pointer" />
                  <span className="text-sm">Favorite Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categories.coffee} onChange={(e) => setCategories({...categories, coffee: e.target.checked})} className="rounded cursor-pointer" />
                  <span className="text-sm">Coffee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categories.nonCoffee} onChange={(e) => setCategories({...categories, nonCoffee: e.target.checked})} className="rounded cursor-pointer" />
                  <span className="text-sm">Non Coffee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categories.food} onChange={(e) => setCategories({...categories, food: e.target.checked})} className="rounded cursor-pointer" />
                  <span className="text-sm">Foods</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categories.addon} onChange={(e) => setCategories({...categories, addon: e.target.checked})} className="rounded cursor-pointer" />
                  <span className="text-sm">Add-On</span>
                </label>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-3">Sort By</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="sort" checked={sortBy === 'buy1get1'} onChange={() => setSortBy('buy1get1')} className="cursor-pointer" />
                  <span className="text-sm">Buy 1 get 1</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="sort" checked={sortBy === 'flashsale'} onChange={() => setSortBy('flashsale')} className="cursor-pointer" />
                  <span className="text-sm">Flash sale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="sort" checked={sortBy === 'cheap'} onChange={() => setSortBy('cheap')} className="cursor-pointer" />
                  <span className="text-sm">Cheap</span>
                </label>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-3">Range Price</label>
              <input type="range" min="5000" max="50000" value={priceRange[1]} onChange={(e) => setPriceRange([5000, parseInt(e.target.value)])} className="w-full accent-orange-500" />
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
              <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 lg:hidden overflow-y-auto shadow-2xl">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Filter</h3>
                    <button onClick={() => setShowFilter(false)} className="text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Category</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={categories.favorite} onChange={(e) => setCategories({...categories, favorite: e.target.checked})} className="rounded cursor-pointer w-4 h-4" />
                        <span className="text-sm">Favorite Product</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={categories.coffee} onChange={(e) => setCategories({...categories, coffee: e.target.checked})} className="rounded cursor-pointer w-4 h-4" />
                        <span className="text-sm">Coffee</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={categories.nonCoffee} onChange={(e) => setCategories({...categories, nonCoffee: e.target.checked})} className="rounded cursor-pointer w-4 h-4" />
                        <span className="text-sm">Non Coffee</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={categories.food} onChange={(e) => setCategories({...categories, food: e.target.checked})} className="rounded cursor-pointer w-4 h-4" />
                        <span className="text-sm">Foods</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={categories.addon} onChange={(e) => setCategories({...categories, addon: e.target.checked})} className="rounded cursor-pointer w-4 h-4" />
                        <span className="text-sm">Add-On</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Sort By</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort-mobile" checked={sortBy === 'buy1get1'} onChange={() => setSortBy('buy1get1')} className="cursor-pointer w-4 h-4" />
                        <span className="text-sm">Buy 1 get 1</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort-mobile" checked={sortBy === 'flashsale'} onChange={() => setSortBy('flashsale')} className="cursor-pointer w-4 h-4" />
                        <span className="text-sm">Flash sale</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort-mobile" checked={sortBy === 'cheap'} onChange={() => setSortBy('cheap')} className="cursor-pointer w-4 h-4" />
                        <span className="text-sm">Cheap</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Range Price</label>
                    <input type="range" min="5000" max="50000" value={priceRange[1]} onChange={(e) => setPriceRange([5000, parseInt(e.target.value)])} className="w-full accent-orange-500" />
                    <div className="flex justify-between text-xs mt-2">
                      <span>IDR {priceRange[0].toLocaleString()}</span>
                      <span>IDR {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={resetFilters}
                      className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setShowFilter(false)}
                      className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <p className="text-gray-500 text-base sm:text-lg">Tidak ada produk yang sesuai dengan filter Anda</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentProducts.map((product) => (
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

                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-12">
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