import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import SearchFilter from '../components/admin/SearchFilter';
import DataTable from '../components/admin/DataTable';
import Pagination from '../components/admin/Pagination';
import ActionButton from '../components/admin/ActionButton';
import ProductFormModal from '../components/admin/ProductFormModal';
import { getProducts } from '../services/apiService';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    document.title = 'Product List - Admin Panel | Coffee Shop';
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products from database');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveProduct = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = selectedProduct 
        ? `${API_BASE_URL}/products/${selectedProduct.id}` 
        : `${API_BASE_URL}/products`;
      
      const method = selectedProduct ? 'PUT' : 'POST';

      const response = await axios({
        method: method,
        url: endpoint,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        showNotification(
          selectedProduct 
            ? 'Product updated successfully!' 
            : 'Product created successfully!',
          'success'
        );
        setIsModalOpen(false);
        fetchProducts(); 
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification(
        error.response?.data?.message || 'Failed to save product',
        'error'
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        showNotification('Product deleted successfully!', 'success');
        fetchProducts(); 
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification(
        error.response?.data?.message || 'Failed to delete product',
        'error'
      );
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toLocaleString('id-ID') : price;
  };

  const columns = [
    {
      header: <input type="checkbox" className="rounded" />,
      render: () => <input type="checkbox" className="rounded" />
    },
    {
      header: "Image",
      render: (product) => (
        <img 
          src={product.image || '/placeholder.png'} 
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
      )
    },
    { 
      header: "Product Name", 
      accessor: "name",
      render: (product) => (
        <div>
          <div className="font-medium">{product.name}</div>
          {(product.isFlashSale || product.is_flash_sale) && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
              FLASH SALE
            </span>
          )}
        </div>
      )
    },
    { 
      header: "Category", 
      render: (product) => (
        <span className="text-sm capitalize">
          {product.category || 'N/A'}
        </span>
      )
    },
    { 
      header: "Price", 
      render: (product) => (
        <div>
          <div className="font-semibold text-orange-600">
            IDR {formatPrice(product.price)}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-xs text-gray-400 line-through">
              IDR {formatPrice(product.originalPrice || product.original_price)}
            </div>
          )}
        </div>
      )
    },
    { 
      header: "Description", 
      render: (product) => (
        <span className="text-xs text-gray-600 line-clamp-2">
          {product.description?.substring(0, 50) || 'No description'}
          {product.description?.length > 50 ? '...' : ''}
        </span>
      )
    },
    { 
      header: "Stock", 
      render: (product) => (
        <span className={`text-sm font-medium ${
          product.stock > 10 ? 'text-green-600' : 
          product.stock > 0 ? 'text-orange-600' : 
          'text-red-600'
        }`}>
          {product.stock !== undefined ? product.stock : 'N/A'}
        </span>
      )
    },
    {
      header: "Rating",
      render: (product) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm">{product.rating || '5.0'}</span>
        </div>
      )
    },
    {
      header: "Action",
      render: (product) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => {
              setSelectedProduct(product);
              setIsModalOpen(true);
            }}
            className="text-orange-500 hover:text-orange-600 transition-colors"
            title="Edit Product"
          >
            <img src='/edit-admin.svg' className="w-7 h-7" alt="Edit" />
          </button>
          <button 
            onClick={() => handleDeleteProduct(product.id)}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Delete Product"
          >
            <img src='/trash-admin.svg' className="w-7 h-7" alt="Delete" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Product List">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products from database...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Product List">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Product List">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="mb-6">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          placeholder="Search by product name, category, or description..."
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {products.length !== filteredProducts.length && ` of ${products.length} total`}
        </div>
        <ActionButton 
          onClick={() => { 
            setSelectedProduct(null); 
            setIsModalOpen(true); 
          }} 
        >
          + Add Product
        </ActionButton>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'No products found matching your search' : 'No products available'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm 
              ? 'Try adjusting your search term' 
              : 'Click "Add Product" to create your first product'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <DataTable
              columns={columns}
              data={currentProducts}
              emptyMessage="No products found"
            />
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredProducts.length}
            />
          )}
        </>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </AdminLayout>
  );
};

export default ProductListPage;