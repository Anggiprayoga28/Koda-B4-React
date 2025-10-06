import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, X, Mail, User, MapPin } from 'lucide-react';
import { products } from '../data/products';
import { promos } from '../data/promos';
import MenuCard from '../components/landing/MenuCard';
import Pagination from '../components/admin/Pagination';
import Notification from '../components/ui/Notification';

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
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
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(searchParams.get('payment') === 'true');
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    fullName: '',
    address: '',
    delivery: 'Dine in'
  });
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [notification, setNotification] = useState(null);
  const productsPerPage = 9;

  useEffect(() => {
    if (searchParams.get('payment') === 'true') {
      const tempCart = JSON.parse(sessionStorage.getItem('tempCart') || '[]');
      if (tempCart.length > 0) {
        setCart(tempCart);
        setShowPayment(true);
      }
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
  }, [searchTerm, categories, sortBy, priceRange]);

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

  const nextPromo = () => setPromoIndex((prev) => (prev + 1) % (promos.length - 2));
  const prevPromo = () => setPromoIndex((prev) => (prev - 1 + (promos.length - 2)) % (promos.length - 2));

  const removeFromCart = (cartId) => {
    const updatedCart = cart.filter(item => item.cartId !== cartId);
    setCart(updatedCart);
    sessionStorage.setItem('tempCart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const totals = calculateTotal();
    
    const newOrder = {
      orderId: `ORD${Date.now()}`,
      orderDate: new Date().toISOString(),
      items: cart,
      customerInfo: customerInfo,
      orderTotal: totals.orderTotal,
      delivery: totals.delivery,
      tax: totals.tax,
      total: totals.subTotal,
      status: 'On Progress',
      userId: currentUser ? currentUser.id : null
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    sessionStorage.removeItem('tempCart');

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
        <Helmet>
          <title>Checkout - Coffee Shop</title>
          <meta name="description" content="Complete your order checkout" />
        </Helmet>

        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}

        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Payment Details</h1>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Your Order</h2>
                <button 
                  onClick={handleBackToProduct}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                >
                  + Add Menu
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
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
                  <div key={item.cartId} className="bg-white rounded-lg p-4 mb-4 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
                    <div className="flex-1">
                      {item.isFlashSale && (
                        <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded inline-block mb-2">FLASH SALE!</span>
                      )}
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.quantity}pcs | {item.size} | {item.temp} | {customerInfo.delivery}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 line-through text-sm">IDR {item.originalPrice.toLocaleString()}</span>
                        <span className="text-orange-500 font-bold text-xl">IDR {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ))
              )}

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6">Payment Info & Delivery</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="Enter Your Email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10"
                      />
                      <Mail className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10"
                      />
                      <User className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10"
                      />
                      <MapPin className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Dine in', 'Door Delivery', 'Pick Up'].map((method) => (
                        <button 
                          key={method}
                          onClick={() => setCustomerInfo({...customerInfo, delivery: method})}
                          className={`border-2 px-4 py-3 rounded-lg font-medium ${
                            customerInfo.delivery === method 
                              ? 'border-orange-500 bg-orange-50 text-orange-500'
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
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <h3 className="text-xl font-semibold mb-6">Total</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order</span>
                    <span className="font-semibold">Idr. {totals.orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold">Idr. {totals.delivery.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">Idr. {Math.round(totals.tax).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Sub Total</span>
                    <span className="font-bold text-lg">Idr. {Math.round(totals.subTotal).toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition mb-6"
                >
                  Checkout
                </button>

                <div>
                  <p className="text-sm text-gray-600 mb-3">We Accept</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="border rounded p-2 flex items-center justify-center">
                      <span className="">
                        <img src="/public/BRI.svg" alt="BRI" />
                      </span>
                    </div>
                    <div className="border rounded p-2 flex items-center justify-center">
                      <span>
                        <img src="/public/dana.svg" alt="DANA" />
                      </span>
                    </div>
                    <div className="border rounded p-2 flex items-center justify-center">
                      <span>
                        <img src="/public/bca.svg" alt="BCA" />
                      </span>
                    </div>
                    <div className="border rounded p-2 flex items-center justify-center">
                      <span>
                        <img src="/public/gopay.svg" alt="gopay" />
                      </span>
                    </div>
                    <div className="border rounded p-2 flex items-center justify-center">
                      <span>
                        <img src="/public/ovo.svg" alt="OVO" />
                      </span>
                    </div>
                    <div className="border rounded p-2 flex items-center justify-center">
                      <span>
                        <img src="/public/paypal.svg" alt="PayPal" />
                      </span>
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
      <Helmet>
        <title>Our Products - Coffee Shop | Best Coffee & Food</title>
        <meta name="description" content="Browse our selection of premium coffee, non-coffee drinks, and delicious food items." />
      </Helmet>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="relative h-96 flex items-center justify-start px-16" style={{ backgroundImage: 'url(/public/cover-product.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <h1 className="relative text-white text-5xl font-bold max-w-xl leading-tight">We Provide Good Coffee and Healthy Meals</h1>
      </div>

      <div className="w-full bg-white py-12">
        <div className="flex items-center justify-between mb-8 px-8">
          <h2 className="text-5xl font-light">Today <span className="text-orange-500 font-semibold">Promo</span></h2>
          <div className="flex gap-3">
            <button onClick={prevPromo} className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button onClick={nextPromo} className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition text-white">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 px-8">
          {promos.slice(promoIndex, promoIndex + 3).map((promo, idx) => (
            <div key={idx} className={`${promo.bgColor} rounded-2xl p-6 flex items-center gap-4`}>
              <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                <img src='/public/mother.svg' className="w-full" alt="promo" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1.5 leading-tight">{promo.title}</h3>
                <p className="text-xs mb-2.5 leading-snug">{promo.description}</p>
                <button className="text-xs font-semibold bg-white px-3.5 py-1.5 rounded-md hover:bg-gray-50 transition">{promo.code}</button>
              </div>
            </div>
          ))}
          {promos.slice(promoIndex + 3, promoIndex + 4).map((promo, idx) => (
            <div key={idx} className={`${promo.bgColor} rounded-2xl p-6 flex items-center gap-4`}>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1.5 leading-tight">{promo.title}</h3>
                <p className="text-xs leading-snug">{promo.description}</p>
              </div>
              <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                <img src='/public/father.png' className="w-full" alt="promo" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-4xl font-light mb-8">Our <span className="text-orange-500 font-semibold">Product</span></h2>
        <div className="flex gap-8">
          <div className="w-64 bg-black text-white rounded-lg p-6 h-fit sticky top-4">
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
          
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Tidak ada produk yang sesuai dengan filter Anda</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={productsPerPage}
                    totalItems={filteredProducts.length}
                  />
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