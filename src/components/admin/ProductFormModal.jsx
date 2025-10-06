import React, { useState, useEffect } from 'react';
import { X, Trash2, Image as ImageIcon } from 'lucide-react';

const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
    sizes: [],
    stock: ''
  });

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        images: product.image ? [product.image] : [],
        sizes: product.sizes || ['R', 'L', 'XL'],
        stock: product.stock?.toString() || '200'
      });
      setPreviewImages(product.image ? [product.image] : []);
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        images: [],
        sizes: [],
        stock: ''
      });
      setPreviewImages([]);
    }
  }, [product, isOpen]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newImages]);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    setFormData({ ...formData, images: newImages });
  };

  const toggleSize = (size) => {
    const newSizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in product name and price');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold text-gray-900">
          {product ? 'Edit Product' : 'Add Product'}
        </h2>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-600 transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-8 py-6 space-y-6 pb-24">
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Photo Product
          </label>
          
          <div className="flex gap-3 mb-4">
            {previewImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <label className="cursor-pointer">
            <span className="inline-block bg-orange-500 text-white px-8 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Upload
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Product name
          </label>
          <input
            type="text"
            placeholder="Enter Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Price
          </label>
          <input
            type="number"
            placeholder="Enter Product Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400"
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
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Product Size
          </label>
          <div className="flex gap-3">
            {['R', 'L', 'XL', '250 gr', '500gr'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  formData.sizes.includes(size)
                    ? 'bg-orange-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Stock
          </label>
          <div className="relative">
            <select
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 appearance-none bg-white text-gray-900 cursor-pointer"
            >
              <option value="">Enter Product Stock</option>
              <option value="50">50 Stock</option>
              <option value="100">100 Stock</option>
              <option value="200">200 Stock</option>
              <option value="500">500 Stock</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-full max-w-lg bg-white border-t border-gray-200 px-8 py-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-base"
        >
          {product ? 'Edit Save' : 'Save Product'}
        </button>
      </div>
    </div>
  );
};

export default ProductFormModal;