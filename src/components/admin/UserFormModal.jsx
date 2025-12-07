import React, { useState, useEffect } from 'react';
import { X, Camera, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Upload } from 'lucide-react';

const UserFormModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'customer'
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && isOpen) {
      console.log('Loading user data into form:', user);
      setFormData({
        full_name: user.full_name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || user.phone_number || '',
        password: '',
        address: user.address || '',
        role: user.role || 'customer'
      });
      setPreviewPhoto(user.photo || user.photo_url || user.photoUrl || '');
    } else if (!user && isOpen) {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        role: 'customer'
      });
      setPreviewPhoto('');
      setPhotoFile(null);
    }
    setErrors({});
  }, [user, isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select an image file' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image size must be less than 5MB' }));
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name || formData.full_name.trim().length < 3) {
      newErrors.full_name = 'Please enter full name (min 3 characters)';
    }

    if (!formData.email) {
      newErrors.email = 'Please enter email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Please enter phone number';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = 'Please enter address (min 5 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('full_name', formData.full_name.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('address', formData.address.trim());
      submitData.append('role', formData.role);

      if (formData.password) {
        submitData.append('password', formData.password);
      }

      if (photoFile) {
        submitData.append('photo', photoFile);
      }

      console.log('Submitting form data');
      await onSave(submitData);
      handleClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      role: 'customer'
    });
    setPhotoFile(null);
    setPreviewPhoto('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                {previewPhoto ? (
                  <img src={previewPhoto} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-#8E6447 text-white p-2 rounded-full cursor-pointer hover:bg-#7A5538 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.photo && (
              <p className="mt-2 text-sm text-red-500">{errors.photo}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">Max 5MB</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-#8E6447 focus:border-transparent ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
            </div>
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={user ? true : false}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-#8E6447 focus:border-transparent ${
                  user ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter email address"
              />
            </div>
            {user && (
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
            )}
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-#8E6447 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {!user && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-#8E6447 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={user ? 'Enter new password (optional)' : 'Enter password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {user && (
              <p className="mt-1 text-sm text-gray-500">Leave blank to keep current password</p>
            )}
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-#8E6447 focus:border-transparent resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
                rows="3"
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#8E6447 focus:border-transparent"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-#8E6447 text-white rounded-lg hover:bg-#7A5538 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
