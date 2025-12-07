import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getProducts } from '../../services/apiService';

const OrderFormModal = ({ isOpen, onClose, onSave, order = null }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
    size: 'Medium',
    notes: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!order;

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      if (order) {
        setFormData({
          product_id: order.product_id || '',
          quantity: order.quantity || 1,
          size: order.size || 'Medium',
          notes: order.notes || ''
        });
      } else {
        setFormData({
          product_id: '',
          quantity: 1,
          size: 'Medium',
          notes: ''
        });
      }
    }
  }, [isOpen, order]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product_id) {
      setError('Please select a product');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">
            {isEditMode ? 'Edit Order' : 'Add New Order'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product <span className="text-red-500">*</span>
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - IDR {product.price?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Add special instructions..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Order' : 'Create Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;