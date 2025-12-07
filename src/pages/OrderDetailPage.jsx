import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getOrderDetail, clearCurrentOrder } from "../redux/slices/checkoutSlice";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { currentOrder, loading, error } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view order details");
      navigate("/login", { state: { from: `/order/${orderId}` } });
    }
  }, [isAuthenticated, navigate, orderId]);

  useEffect(() => {
    document.title = `Order #${orderId} - Coffee Shop`;
  }, [orderId]);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      dispatch(getOrderDetail(orderId));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [orderId, isAuthenticated, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleBack = () => {
    navigate("/history-order");
  };

  const formatDate = (dateString) => {
    return dateString || "";
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    
    if (["done", "completed", "delivered", "finished", "finish order"].includes(statusLower)) {
      return "bg-green-100 text-green-700";
    }
    if (["shipping", "shipped", "in_delivery", "sending goods"].includes(statusLower)) {
      return "bg-blue-100 text-blue-700";
    }
    if (["pending", "processing", "in_progress", "on progress"].includes(statusLower)) {
      return "bg-#F9F6F0 text-#6B4E39";
    }
    if (["cancelled", "canceled", "failed"].includes(statusLower)) {
      return "bg-red-100 text-red-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  if (loading && !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-#8E6447 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!loading && !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The order you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-#8E6447 text-white rounded-lg hover:bg-#7A5538 transition font-semibold"
          >
            Back to Order History
          </button>
        </div>
      </div>
    );
  }

  const order = {
    orderId: currentOrder.orderNumber,
    orderDate: currentOrder.orderDate,
    status: currentOrder.statusDisplay || currentOrder.status,
    total: currentOrder.total,
    subtotal: currentOrder.subtotal,
    deliveryFee: currentOrder.deliveryFee,
    taxAmount: currentOrder.taxAmount,
    paymentMethod: currentOrder.paymentMethod,
    customerInfo: {
      fullName: currentOrder.fullName,
      address: currentOrder.address,
      delivery: currentOrder.deliveryMethod,
      phone: currentOrder.phone,
    },
    items: (currentOrder.items || []).map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      temperature: item.temperature,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      imageUrl: item.imageUrl,
      isFlashSale: item.isFlashSale,
    })),
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Order History</span>
          </button>
          
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Order #{order.orderId}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {formatDate(order.orderDate)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm p-0 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                Order Information
              </h2>

              <div className="space-y-0">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm md:text-base">Full Name</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {order.customerInfo.fullName}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm md:text-base">Delivery Address</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base text-right max-w-xs">
                    {order.customerInfo.address}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span className="text-sm md:text-base">Delivery Method</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {order.customerInfo.delivery}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm md:text-base">Payment Method</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {order.paymentMethod || "Cash"}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm md:text-base">Phone</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {order.customerInfo.phone || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm p-0 md:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold">Order Summary</h2>
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    IDR {order.subtotal?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-gray-900">
                    IDR {order.deliveryFee?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    IDR {order.taxAmount?.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between text-base md:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-#8E6447">
                      IDR {order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBack}
                className="mt-6 w-full bg-#8E6447 text-white py-3 rounded-lg font-semibold hover:bg-#7A5538 transition"
              >
                Back to History
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Ordered Items</h2>
          <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm divide-y divide-gray-200">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.imageUrl || "/placeholder-product.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      {item.isFlashSale && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          ⚡
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity}x • {item.size || "-"} • {item.temperature || "-"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        @ IDR {item.unitPrice?.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      IDR {item.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium">No items in this order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;