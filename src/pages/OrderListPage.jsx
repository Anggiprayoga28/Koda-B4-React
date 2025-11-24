import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import SearchFilter from '../components/admin/SearchFilter';
import DataTable from '../components/admin/DataTable';
import Pagination from '../components/admin/Pagination';
import ActionButton from '../components/admin/ActionButton';
import StatusBadge from '../components/admin/StatusBadge';
import OrderFormModal from '../components/admin/OrderFormModals';
import OrderDetailSidebar from '../components/admin/OrderDetailSidebar';
import { getOrders, updateOrderStatus, deleteOrder, createOrder } from '../services/apiService';

const OrderListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    document.title = 'Order List - Admin Panel | Coffee Shop';
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders from database');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== 'All') params.status = statusFilter;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchTerm, statusFilter, currentPage, setSearchParams]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'finish order' || statusLower === 'done' || statusLower === 'completed') return 'success';
    if (statusLower === 'on progress' || statusLower === 'sending goods' || statusLower === 'processing') return 'warning';
    if (statusLower === 'pending' || statusLower === 'cancelled') return 'danger';
    return 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filteredOrders = orders.filter(order => {
    const orderId = (order.order_id || order.orderId || order.id || '').toString();
    const matchSearch = orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    
    try {
      const orderId = selectedOrder.id || selectedOrder.order_id || selectedOrder.orderId;
      await updateOrderStatus(orderId, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      showNotification('Order status updated successfully!', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification(
        error.response?.data?.message || 'Failed to update order status',
        'error'
      );
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      await createOrder(orderData);
      setIsAddModalOpen(false);
      showNotification('Order created successfully!', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      showNotification(
        error.response?.data?.message || 'Failed to create order',
        'error'
      );
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await deleteOrder(orderId);
      showNotification('Order deleted successfully!', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification(
        error.response?.data?.message || 'Failed to delete order',
        'error'
      );
    }
  };

  const columns = [
    {
      header: <input type="checkbox" className="rounded" />,
      render: () => <input type="checkbox" className="rounded" />
    },
    { 
      header: "No. Order", 
      render: (order) => `#${order.order_id || order.orderId || order.id}` 
    },
    { 
      header: "Date", 
      render: (order) => formatDate(order.order_date || order.orderDate || order.created_at) 
    },
    {
      header: "Order",
      render: (order) => {
        const items = order.items || order.order_items || [];
        return (
          <ul className="list-disc list-inside">
            {items.slice(0, 2).map((item, idx) => (
              <li key={idx}>
                {item.name || item.product_name || 'Item'} {item.size || ''} {item.quantity || 1}×
              </li>
            ))}
            {items.length > 2 && (
              <li className="text-gray-400 text-xs">+{items.length - 2} more</li>
            )}
          </ul>
        );
      }
    },
    {
      header: "Status",
      render: (order) => (
        <StatusBadge status={order.status} variant={getStatusVariant(order.status)} />
      )
    },
    { 
      header: "Total", 
      render: (order) => `IDR ${Math.round(order.total || order.total_amount || 0).toLocaleString()}` 
    },
    {
      header: "Action",
      render: (order) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => handleViewDetail(order)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="View Details"
          >
            <FileText className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleViewDetail(order)}
            className="text-orange-500 hover:text-orange-600 transition-colors"
            title="Edit Order"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDeleteOrder(order.id || order.order_id || order.orderId)}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Delete Order"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const StatusFilterDropdown = () => (
    <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
    >
      <option value="All">All</option>
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="On Progress">On Progress</option>
      <option value="Sending Goods">Sending Goods</option>
      <option value="completed">Completed</option>
      <option value="Finish Order">Finish Order</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );

  if (loading) {
    return (
      <AdminLayout title="Order List">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading orders from database...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Order List">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Order List">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        placeholder="Enter Order Number"
        extraFilters={<StatusFilterDropdown />}
      />

      <div className="mt-6">
        <ActionButton onClick={() => setIsAddModalOpen(true)}>
          + Add Order
        </ActionButton>
      </div>

      <div className="mt-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm ? 'No orders found matching your search' : 'No orders available'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm 
                ? 'Try adjusting your search term' 
                : 'Click "Add Order" to create your first order'}
            </p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentOrders}
              onRowClick={handleViewDetail}
              emptyMessage="No orders found"
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredOrders.length}
              />
            )}
          </>
        )}
      </div>

      <OrderDetailSidebar
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      <OrderFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveOrder}
      />
    </AdminLayout>
  );
};

export default OrderListPage;