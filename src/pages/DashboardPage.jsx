import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    onProgress: { count: 0, change: 11.01 },
    shipping: { count: 0, change: 4.01 },
    done: { count: 0, change: 2.01 }
  });
  const [topProducts, setTopProducts] = useState([]);
  const [dateRange, setDateRange] = useState('16 - 23 January 2023');

  useEffect(() => {
    document.title = 'Dashboard - Coffee Shop Admin';
  }, []);

  useEffect(() => {
    const loadDashboardData = () => {
      const ordersData = localStorage.getItem('orders');
      let orders = [];

      if (ordersData) {
        try {
          orders = JSON.parse(ordersData);
        } catch (error) {
          console.error('Error parsing orders:', error);
          orders = [];
        }
      }

      if (!Array.isArray(orders)) {
        orders = [];
      }

      const onProgress = orders.filter(o => o && o.status === 'On Progress').length;
      const shipping = orders.filter(o => o && o.status === 'Sending Goods').length;
      const done = orders.filter(o => o && o.status === 'Finish Order').length;

      setStats({
        onProgress: { count: onProgress, change: 11.01 },
        shipping: { count: shipping, change: 4.01 },
        done: { count: done, change: 2.01 }
      });

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

      const topProductsList = Object.entries(productSales)
        .map(([name, data]) => ({ 
          name, 
          sold: data.count, 
          revenue: data.revenue 
        }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);

      setTopProducts(topProductsList);
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#6FC276] rounded-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-white p-3 rounded-full">
              <img src='/public/icons/glass-orange.svg' className="w-6 h-6" />
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium opacity-90">Order On Progress</p>
            <div className="flex items-end gap-2 mt-1">
              <h2 className="text-4xl font-bold">{stats.onProgress.count}</h2>
              <span className="text-sm font-medium mb-1">+{stats.onProgress.change}%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#6C69D4] rounded-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-white p-3 rounded-full">
              <img src='/public/icons/truck-orange.svg' className="w-6 h-6" />
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium opacity-90">Order Shipping</p>
            <div className="flex items-end gap-2 mt-1">
              <h2 className="text-4xl font-bold">{stats.shipping.count}</h2>
              <span className="text-sm font-medium mb-1">+{stats.shipping.change}%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#C56FBC] rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-white p-3 rounded-full">
              <img src='/public/icons/user-check.svg' className="w-6 h-6" />
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium opacity-90">Order Done</p>
            <div className="flex items-end gap-2 mt-1">
              <h2 className="text-4xl font-bold">{stats.done.count}</h2>
              <span className="text-sm font-medium mb-1">+{stats.done.change}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total Penjualan</h3>
            <p className="text-sm text-gray-500">1000 cup (16 - 23 January 2023)</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-sm font-medium text-gray-700">{dateRange}</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
            <text x="10" y="20" className="text-xs fill-gray-400">300c</text>
            <text x="10" y="60" className="text-xs fill-gray-400">250c</text>
            <text x="10" y="100" className="text-xs fill-gray-400">200c</text>
            <text x="10" y="140" className="text-xs fill-gray-400">150c</text>
            <text x="10" y="180" className="text-xs fill-gray-400">100c</text>
            
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#86efac" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#86efac" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            <path
              d="M 50 150 L 100 140 L 150 145 L 200 130 L 250 135 L 300 125 L 350 130 L 400 120 L 450 115 L 500 100 L 550 90 L 600 80 L 650 70"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
            />
            
            <path
              d="M 50 150 L 100 140 L 150 145 L 200 130 L 250 135 L 300 125 L 350 130 L 400 120 L 450 115 L 500 100 L 550 90 L 600 80 L 650 70 L 650 200 L 50 200 Z"
              fill="url(#chartGradient)"
            />
            
            <text x="50" y="195" className="text-xs fill-gray-400">16 Jan</text>
            <text x="130" y="195" className="text-xs fill-gray-400">17 Jan</text>
            <text x="210" y="195" className="text-xs fill-gray-400">18 Jan</text>
            <text x="290" y="195" className="text-xs fill-gray-400">19 Jan</text>
            <text x="370" y="195" className="text-xs fill-gray-400">20 Jan</text>
            <text x="450" y="195" className="text-xs fill-gray-400">21 Jan</text>
            <text x="530" y="195" className="text-xs fill-gray-400">22 Jan</text>
            <text x="610" y="195" className="text-xs fill-gray-400">23 Jan</text>
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Produk Terlaris</h3>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-sm font-medium text-gray-700">{dateRange}</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">No</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nama Produk</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Terjual</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Keuntungan</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-4 px-4 text-sm text-gray-800">{product.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{product.sold} Cup</td>
                    <td className="py-4 px-4 text-sm font-semibold text-green-600">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    Belum ada data penjualan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;