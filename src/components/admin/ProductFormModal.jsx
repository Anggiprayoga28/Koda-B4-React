import React, { useState, useEffect } from 'react';
import { X, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    stock: '',
    is_flash_sale: false,
    is_favorite: false,
    is_buy1get1: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        category_id: product.category_id?.toString() || '',
        stock: product.stock?.toString() || '',
        is_flash_sale: product.is_flash_sale || product.isFlashSale || false,
        is_favorite: product.is_favorite || product.isFavorite || false,
        is_buy1get1: product.is_buy1get1 || product.isBuy1Get1 || false
      });
      setPreviewImage(product.image_url || product.image || '');
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        category_id: '1',
        stock: '',
        is_flash_sale: false,
        is_favorite: false,
        is_buy1get1: false
      });
      setPreviewImage('');
      setImageFile(null);
    }
  }, [product, isOpen]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage(product ? (product.image_url || product.image || '') : '');
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast('Please enter product name');
      return;
    }

    if (!formData.price || formData.price < 1000) {
      toast('Price must be at least IDR 1,000');
      return;
    }

    if (!formData.stock || formData.stock < 0) {
      toast('Please enter valid stock');
      return;
    }

    if (!formData.category_id) {
      toast('Please select a category');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('category_id', formData.category_id);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);
      submitData.append('is_flash_sale', formData.is_flash_sale.toString());
      submitData.append('is_favorite', formData.is_favorite.toString());
      submitData.append('is_buy1get1', formData.is_buy1get1.toString());

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await onSave(submitData);
      
      setFormData({
        name: '',
        price: '',
        description: '',
        category_id: '1',
        stock: '',
        is_flash_sale: false,
        is_favorite: false,
        is_buy1get1: false
      });
      setImageFile(null);
      setPreviewImage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 transition-colors p-1"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 pb-32">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Product Image
            </label>
            
            {previewImage && (
              <div className="relative mb-4 inline-block">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <label className="cursor-pointer inline-block">
              <span className="inline-flex items-center gap-2 bg-#8E6447 text-white px-6 py-2.5 rounded-lg hover:bg-#7A5538 transition-colors font-medium">
                <Upload className="w-4 h-4" />
                {previewImage ? 'Change Image' : 'Upload Image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Max 5MB (JPG, PNG, WebP)</p>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-#8E6447 text-gray-900"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-#8E6447 bg-white text-gray-900"
              disabled={loading}
            >
              <option value="">Select Category</option>
              <option value="1">Coffee</option>
              <option value="2">Non Coffee</option>
              <option value="3">Foods</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Price (IDR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Product Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-#8E6447 text-gray-900"
              min="1000"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Product Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-#8E6447 text-gray-900"
              min="0"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Description
            </label>
            <textarea
              placeholder="Enter Product Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-#8E6447 text-gray-900 resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Product Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_flash_sale}
                  onChange={(e) => setFormData({ ...formData, is_flash_sale: e.target.checked })}
                  className="w-5 h-5 text-#8E6447 rounded focus:ring-#8E6447"
                  disabled={loading}
                />
                <span className="text-gray-700">Flash Sale</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_favorite}
                  onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
                  className="w-5 h-5 text-#8E6447 rounded focus:ring-#8E6447"
                  disabled={loading}
                />
                <span className="text-gray-700">Favorite Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_buy1get1}
                  onChange={(e) => setFormData({ ...formData, is_buy1get1: e.target.checked })}
                  className="w-5 h-5 text-#8E6447 rounded focus:ring-#8E6447"
                  disabled={loading}
                />
                <span className="text-gray-700">Buy 1 Get 1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 right-0 w-full max-w-lg bg-white border-t border-gray-200 px-8 py-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-#8E6447 text-white py-3.5 rounded-lg font-semibold hover:bg-#7A5538 transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Save Product')}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFormModal;