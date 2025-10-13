import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

/**
 * useOrders Hook
 * @returns {Object} Order context value
 * @description Provides order state and functions to child components
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};


export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(Array.isArray(parsedOrders) ? parsedOrders : []);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);


  const createOrder = (orderData) => {
    const newOrder = {
      orderId: `ORD${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: 'On Progress',
      ...orderData
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder;
  };


  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };


  const updateOrder = (orderId, updates) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
  };


  const getOrderById = (orderId) => {
    return orders.find(order => order.orderId === orderId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };


  const getOrdersByUser = (userId) => {
    return orders.filter(order => order.userId === userId);
  };


  const getOrderStats = () => {
    const onProgress = orders.filter(o => o.status === 'On Progress').length;
    const shipping = orders.filter(o => o.status === 'Sending Goods').length;
    const done = orders.filter(o => o.status === 'Finish Order').length;

    return {
      onProgress: { count: onProgress, change: 11.01 },
      shipping: { count: shipping, change: 4.01 },
      done: { count: done, change: 2.01 }
    };
  };


  const getTopProducts = () => {
    const productSales = {};
    
    orders.forEach(order => {
      if (!order || !order.items || !Array.isArray(order.items)) return;

      order.items.forEach(item => {
        if (!item || !item.name) return;

        const itemName = item.name;
        const quantity = parseInt(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;

        if (!productSales[itemName]) {
          productSales[itemName] = { count: 0, revenue: 0 };
        }

        productSales[itemName].count += quantity;
        productSales[itemName].revenue += price * quantity;
      });
    });

    return Object.entries(productSales)
      .map(([name, data]) => ({ 
        name, 
        sold: data.count, 
        revenue: data.revenue 
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    getOrderById,
    getOrdersByStatus,
    getOrdersByUser,
    getOrderStats,
    getTopProducts
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};