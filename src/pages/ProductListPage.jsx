import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import SearchFilter from '../components/admin/SearchFilter';
import DataTable from '../components/admin/DataTable';
import Pagination from '../components/admin/Pagination';
import ActionButton from '../components/admin/ActionButton';
import ProductFormModal from '../components/admin/ProductFormModal';
import { getProducts } from '../services/apiService';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    document.title = 'Product List - Admin Panel | Coffee Shop';
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveProduct = (formData) => {
    console.log('Saved product:', formData);
    alert('Product saved successfully!');
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', productId);
      alert('Product deleted successfully!');
    }
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
          src={product.image} 
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      )
    },
    { header: "Product Name", accessor: "name" },
    { 
      header: "Price", 
      render: (product) => `IDR ${product.price.toLocaleString()}` 
    },
    { 
      header: "Description", 
      render: (product) => (
        <span className="text-xs text-gray-600">
          {product.description.substring(0, 50)}...
        </span>
      )
    },
    { header: "Size", render: () => "R, L, XL, 250gr" },
    { 
      header: "Method", 
      render: (product) => 
        product.category === 'coffee' ? 'Deliver, Dine In' : 
        product.category === 'food' ? 'Dine In' : 'Deliver'
    },
    { header: "Stock", render: () => "200" },
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
          >
            <img src='/edit-admin.svg' className="w-7 h-7" />
          </button>
          <button 
            onClick={() => handleDeleteProduct(product.id)}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <img src='/trash-admin.svg' className="w-7 h-7" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Product List">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Product List">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Product List">
      <div>
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          placeholder="Enter Product Name"
        />
      </div>

      <div className="mt-6">
        <ActionButton 
          onClick={() => { 
            setSelectedProduct(null); 
            setIsModalOpen(true); 
          }} 
        >
          Add Product
        </ActionButton>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={currentProducts}
          emptyMessage="No products found"
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredProducts.length}
        />
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </AdminLayout>
  );
};

export default ProductListPage;