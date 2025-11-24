import React, { useState, useEffect } from 'react';
import { X, Camera, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Upload } from 'lucide-react';

const UserFormModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'user'
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || user.phone_number || '',
        password: '',
        address: user.address || '',
        role: user.role || 'user'
      });
      setPreviewPhoto(user.photo || user.photo_url || user.photoUrl || '');
      setPhotoFile(null);
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        role: 'user'
      });
      setPreviewPhoto('');
      setPhotoFile(null);
    }
  }, [user, isOpen]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPreviewPhoto(user ? (user.photo || user.photo_url || user.photoUrl || '') : '');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10,15}$/.test(phone.replace(/[\s-]/g, ''));
  };

  const handleSubmit = async () => {
    if (!formData.full_name.trim()) {
      alert('Please enter full name');
      return;
    }

    if (!formData.email.trim()) {
      alert('Please enter email');
      return;
    }

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!formData.phone.trim()) {
      alert('Please enter phone number');
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert('Please enter a valid phone number (10-15 digits)');
      return;
    }

    if (!user && !formData.password) {
      alert('Password is required for new users');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (!formData.address.trim()) {
      alert('Please enter address');
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

      await onSave(submitData);
      
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        role: 'user'
      });
      setPhotoFile(null);
      setPreviewPhoto('');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'Failed to save user. Please try again.');
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

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {user ? user.full_name || user.fullName || 'Edit User' : 'Add User'}
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
              User Photo
            </label>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {previewPhoto ? (
                  <img src={previewPhoto} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <label className="cursor-pointer inline-block">
                  <span className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm">
                    <Upload className="w-4 h-4" />
                    {previewPhoto ? 'Change Photo' : 'Upload Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
              <User className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading || !!user} 
              />
              <Mail className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
            </div>
            {user && (
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
              <Phone className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-base font-semibold text-gray-900">
                Password {!user && <span className="text-red-500">*</span>}
              </label>
              {user && (
                <span className="text-xs text-gray-500">Leave blank to keep current</span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={user ? "Enter new password (optional)" : "Enter Password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
              <Lock className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                placeholder="Enter Full Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                disabled={loading}
              />
              <MapPin className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
            </div>
          </div>

          {!user && (
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                User Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium border-2 transition-colors ${
                    formData.role === 'user'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                  }`}
                >
                  Normal User
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium border-2 transition-colors ${
                    formData.role === 'admin'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 right-0 w-full max-w-md bg-white border-t border-gray-200 px-8 py-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (user ? 'Update User' : 'Add User')}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserFormModal;