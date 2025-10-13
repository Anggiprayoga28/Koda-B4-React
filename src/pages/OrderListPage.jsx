import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Edit, Trash2 } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import AdminLayout from '../components/admin/AdminLayout';
import SearchFilter from '../components/admin/SearchFilter';
import DataTable from '../components/admin/DataTable';
import Pagination from '../components/admin/Pagination';
import ActionButton from '../components/admin/ActionButton';
import StatusBadge from '../components/admin/StatusBadge';
import OrderFormModal from '../components/admin/OrderFormModal';
import OrderDetailSidebar from '../components/admin/OrderDetailSidebar';

const OrderListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, createOrder, updateOrderStatus, deleteOrder } = useOrders();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    document.title = 'Order List - Admin Panel | Coffee Shop';
  }, []);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== 'All') params.status = statusFilter;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchTerm, statusFilter, currentPage, setSearchParams]);

  const getStatusVariant = (status) => {
    if (status === 'Finish Order' || status === 'Done') return 'success';
    if (status === 'On Progress' || status === 'Sending Goods') return 'warning';
    if (status === 'Pending') return 'danger';
    return 'default';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleUpdateStatus = (newStatus) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.orderId, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleSaveOrder = (orderData) => {
    createOrder(orderData);
    setIsAddModalOpen(false);
    alert('Order created successfully!');
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
      alert('Order deleted successfully!');
    }
  };

  const columns = [
    {
      header: <input type="checkbox" className="rounded" />,
      render: () => <input type="checkbox" className="rounded" />
    },
    { 
      header: "No. Order", 
      render: (order) => `#${order.orderId}` 
    },
    { 
      header: "Date", 
      render: (order) => formatDate(order.orderDate) 
    },
    {
      header: "Order",
      render: (order) => (
        <ul className="list-disc list-inside">
          {order.items.slice(0, 2).map((item, idx) => (
            <li key={idx}>{item.name} {item.size} {item.quantity}×</li>
          ))}
        </ul>
      )
    },
    {
      header: "Status",
      render: (order) => (
        <StatusBadge status={order.status} variant={getStatusVariant(order.status)} />
      )
    },
    { 
      header: "Total", 
      render: (order) => `IDR ${Math.round(order.total).toLocaleString()}` 
    },
    {
      header: "Action",
      render: (order) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => handleViewDetail(order)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FileText className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleViewDetail(order)}
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDeleteOrder(order.orderId)}
            className="text-red-500 hover:text-red-600 transition-colors"
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
      <option value="On Progress">On Progress</option>
      <option value="Sending Goods">Sending Goods</option>
      <option value="Finish Order">Finish Order</option>
      <option value="Pending">Pending</option>
      <option value="Waiting">Waiting</option>
    </select>
  );

  return (
    <AdminLayout title="Order List">
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
          Add Order
        </ActionButton>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={currentOrders}
          onRowClick={handleViewDetail}
          emptyMessage="No orders found"
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredOrders.length}
        />
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