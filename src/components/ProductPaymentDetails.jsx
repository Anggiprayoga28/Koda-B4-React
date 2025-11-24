import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useCart } from "../contexts/CartContext";
import Notification from "../components/ui/Notification";
import {
  getCart as getCartAPI,
  checkout as checkoutAPI,
} from "../services/apiService";

const ProductPaymentDetails = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { removeFromCart, clearCart } = useCart();

  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    fullName: "",
    address: "",
    delivery: "Dine in",
  });
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setNotification(null);
      setLoading(true);
      try {
        const result = await getCartAPI(); 
        console.log('Raw cart data from API:', result);
        
        const backendItems = result?.items || [];

        const mapped = backendItems.map((item) => {
          console.log('Mapping item:', item);
          
          const quantity = item.quantity ?? 1;
          
          const unitPrice = 
            item.unitPrice ?? 
            item.unit_price ?? 
            item.basePrice ?? 
            item.base_price ?? 
            item.price ?? 
            item.subtotal / quantity ?? 
            item.totalPrice / quantity ?? 
            item.total_price / quantity ?? 
            0;

          console.log('Extracted unitPrice:', unitPrice);

          return {
            cartId: item.cartId || item.cartID || item.id,
            productId: item.productId || item.product_id,
            name: item.name || item.product?.name || 'Unknown Product',
            quantity,
            size: item.size || "-",
            temp: item.temperature || item.temp || "-",
            image: item.imageUrl || item.image_url || item.image || "/placeholder-product.png",
            isFlashSale: item.isFlashSale || item.is_flash_sale || false,
            originalPrice: item.originalPrice || item.original_price || 0,
            price: unitPrice,
          };
        });

        console.log('Mapped cart:', mapped);
        setCart(mapped);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setNotification({
          type: "error",
          message: error.response?.data?.message || "Failed to load cart",
        });
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
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

  const handleBackToProduct = () => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.payment;
    setSearchParams(params);
    navigate("/product");
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeFromCart(cartId);
      setCart((prev) => prev.filter((item) => item.cartId !== cartId));
      showNotification("Item removed successfully");
    } catch (error) {
      console.error("Error removing item:", error);
      showNotification("Failed to remove item", "error");
    }
  };

  const calculateTotal = () => {
    const orderTotal =
      cart?.reduce((sum, item) => {
        const price = item.price ?? 0;
        const qty = item.quantity ?? 1;
        return sum + price * qty;
      }, 0) || 0;

    const delivery = 0;
    const tax = orderTotal * 0.1;
    return { orderTotal, delivery, tax, subTotal: orderTotal + delivery + tax };
  };

  const mapDeliveryMethod = (delivery) => {
    if (!delivery) return "dine_in";
    const lower = delivery.toLowerCase();
    if (lower.includes("door")) return "door_delivery";
    if (lower.includes("pick")) return "pick_up";
    return "dine_in";
  };

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    if (
      !customerInfo.fullName.trim() ||
      !customerInfo.email.trim() ||
      !customerInfo.address.trim() ||
      !customerInfo.delivery.trim()
    ) {
      showNotification("Please fill in all customer information", "error");
      return;
    }

    try {
      const payload = {
        email: customerInfo.email,
        fullName: customerInfo.fullName,
        address: customerInfo.address,
        deliveryMethod: mapDeliveryMethod(customerInfo.delivery),
        paymentMethodId: 1,
      };

      const result = await checkoutAPI(payload);

      showNotification(
        result?.message || "Checkout success, your order has been created!"
      );

      setCart([]);
      clearCart();

      setTimeout(() => {
        navigate("/history-order");
      }, 1500);
    } catch (error) {
      console.error("Checkout error:", error);
      showNotification(
        error.response?.data?.message || "Failed to checkout",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotal();

  return (
    <div className="bg-gray-50 min-h-screen">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-8">
          Payment Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">Your Order</h2>
              <button
                onClick={handleBackToProduct}
                className="bg-[#6B727C] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#A5A58D] flex items-center gap-2 text-sm sm:text-base"
              >
                + Add Menu
              </button>
            </div>

            {!cart || cart.length === 0 ? (
              <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={handleBackToProduct}
                  className="bg-[#6B727C] text-white px-6 py-2 rounded-lg hover:bg-[#A5A58D]"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                
                return (
                  <div
                    key={item.cartId}
                    className="bg-[#E8E8E84D] p-3 sm:p-4 mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      {item.isFlashSale && (
                        <span className="bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs rounded-xl inline-block mb-1 sm:mb-2">
                          FLASH SALE!
                        </span>
                      )}
                      <h3 className="font-bold text-base sm:text-lg mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#4F5665] text-sm sm:text-lg mb-1 sm:mb-2">
                        {item.quantity}pcs | {item.size} | {item.temp} |{" "}
                        {customerInfo.delivery}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {item.originalPrice > 0 && item.originalPrice !== item.price && (
                          <span className="text-red-600 line-through text-xs sm:text-sm">
                            IDR {(item.originalPrice * item.quantity).toLocaleString()}
                          </span>
                        )}
                        <span className="text-[#6B727C] text-lg sm:text-xl font-semibold">
                          IDR {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.cartId)}
                      className="text-red-500 hover:text-red-700 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0"
                    >
                      <img
                        src="/XCircle.svg"
                        alt="Remove"
                        className="w-full h-full"
                      />
                    </button>
                  </div>
                );
              })
            )}

            <div className="mt-6 sm:mt-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                Payment Info & Delivery
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg pl-10 text-sm sm:text-base"
                    />
                    <img
                      src="/mail.svg"
                      className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-3 sm:top-4 text-gray-400"
                      alt="mail"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Your Full Name"
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg pl-10 text-sm sm:text-base"
                    />
                    <img
                      src="/Profile.svg"
                      className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-3 sm:top-4 text-gray-400"
                      alt="profile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Your Address"
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg pl-10 text-sm sm:text-base"
                    />
                    <img
                      src="/Location.svg"
                      className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-3 sm:top-4 text-gray-400"
                      alt="location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {["Dine in", "Door Delivery", "Pick Up"].map((method) => (
                      <button
                        key={method}
                        onClick={() =>
                          setCustomerInfo({
                            ...customerInfo,
                            delivery: method,
                          })
                        }
                        className={`border-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-base ${
                          customerInfo.delivery === method
                            ? "border-[#6B727C] bg-white text-[#0B0909]"
                            : "border-gray-300 hover:border-gray-400"
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
                  <span className="font-semibold">
                    Idr. {totals.orderTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">
                    Idr. {totals.delivery.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    Idr. {Math.round(totals.tax).toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2 sm:pt-3 flex justify-between">
                  <span className="font-semibold text-sm sm:text-base">
                    Sub Total
                  </span>
                  <span className="text-base sm:text-lg font-semibold">
                    Idr. {Math.round(totals.subTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!cart || cart.length === 0}
                className="w-full bg-[#6B727C] text-white py-2.5 sm:py-3 rounded-lg hover:bg-[#A5A58D] transition mb-4 sm:mb-6 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>

              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                  We Accept
                </p>
                <div className="grid grid-cols-3 gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 flex items-center justify-center">
                    <img src="/BRI.svg" alt="BRI" className="h-4 sm:h-5" />
                  </div>
                  <div className="p-1.5 sm:p-2 flex items-center justify-center">
                    <img src="/dana.svg" alt="DANA" className="h-4 sm:h-5" />
                  </div>
                  <div className="p-1.5 sm:p-2 flex items-center justify-center">
                    <img src="/bca.svg" alt="BCA" className="h-4 sm:h-5" />
                  </div>
                  <div className="p-1.5 sm:p-2 flex items-center justify-center">
                    <img src="/gopay.svg" alt="gopay" className="h-4 sm:h-5" />
                  </div>
                  <div className="p-1.5 sm:p-2 flex items-center justify-center">
                    <img src="/ovo.svg" alt="OVO" className="h-4 sm:h-5" />
                  </div>
                  <div className="p-1.5 sm:p-2 flex items-center justify-center">
                    <img
                      src="/paypal.svg"
                      alt="PayPal"
                      className="h-4 sm:h-5"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  *Get Discount if you pay with Bank Central Asia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPaymentDetails;