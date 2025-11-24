import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetail } from "../services/apiService";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Order #${orderId} - Coffee Shop`;
  }, [orderId]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetail(orderId);
        if (!data) {
          setOrder(null);
          return;
        }

        const mapped = {
          orderId: data.orderNumber,
          orderDate: data.orderDate,
          status: data.statusDisplay || data.status,
          total: data.total,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          taxAmount: data.taxAmount,
          customerInfo: {
            fullName: data.fullName,
            address: data.address,
            delivery: data.deliveryMethod,
            phone: data.phone,
          },
          items: (data.items || []).map((item) => ({
            ...item,
            temp: item.temperature,
            image: item.imageUrl,
            originalPrice: item.unitPrice,
            price: item.totalPrice,
          })),
        };

        setOrder(mapped);
      } catch (error) {
        console.error("Error fetching order detail:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [orderId]);

  const handleBack = () => {
    navigate("/history-order");
  };

  const formatDate = (dateString) => {
    return dateString || "";
  };

  const getStatusColor = (status) => {
    if (status === "Done" || status === "Finish Order") {
      return "bg-green-100 text-green-700";
    }
    if (status === "Sending Goods") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-orange-100 text-orange-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Order not found</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Order #{order.orderId}
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">
          {formatDate(order.orderDate)}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 order-1 lg:order-1">
            <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm p-0 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                Order Information
              </h2>

              <div className="space-y-0">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src="/Profile.svg" className="w-5 h-5" />
                    <span className="text-sm md:text-base">Full Name</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {order.customerInfo.fullName}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src="/Map.svg" className="w-5 h-5" />
                    <span className="text-sm md:text-base">Delivery Address</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base text-right max-w-xs">
                    {order.customerInfo.address}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src="/Truck.svg" className="w-5 h-5" />
                    <span className="text-sm md:text-base">
                      Delivery Method
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {order.customerInfo.delivery}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src="/Phone.svg" className="w-5 h-5" />
                    <span className="text-sm md:text-base">Phone</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {order.customerInfo.phone || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm p-0 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold">
                  Order Summary
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
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
                    <span className="text-orange-500">
                      IDR {order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBack}
                className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
              >
                Back to History
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Ordered Items
          </h2>
          <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div
                key={`${item.productId}-${index}`}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "/placeholder-product.png"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity}x • {item.size || "-"} •{" "}
                      {item.temp || item.temperature || "-"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    IDR {item.totalPrice?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {order.items.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No items in this order
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
