import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import FormModal from './FormModal';
import FormField from './FormField';

const UserFormModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    photoUrl: '',
    userType: 'Normal User'
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        address: user.address || '',
        photoUrl: user.photoUrl || '',
        userType: user.userType || 'Normal User'
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        photoUrl: '',
        userType: 'Normal User'
      });
    }
  }, [user, isOpen]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!user && !formData.password) {
      alert('Password is required for new users');
      return;
    }

    onSave(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? user.fullName : 'Insert User'}
      onSubmit={handleSubmit}
      submitText={user ? 'Update' : 'Add User'}
      maxWidth="max-w-md"
    >
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Image User
        </label>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="User" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </div>

        <label className="cursor-pointer">
          <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
            Upload
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      <FormField
        label="Full Name"
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Enter Full Name"
        icon={User}
        required
      />

      <FormField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Enter Your Email"
        icon={Mail}
        required
      />

      <FormField
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="Enter Your Number"
        icon={Phone}
        required
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-base font-semibold text-gray-900">
            Password {!user && <span className="text-red-500">*</span>}
          </label>
          {user && (
            <button className="text-orange-500 text-sm font-medium hover:underline">
              Set New Password
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
          <Lock className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <FormField
        label="Address"
        type="text"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        placeholder="Enter Your Address"
        icon={MapPin}
        required
      />

      {!user && (
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Type of User
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'Normal User' })}
              className={`px-6 py-3 rounded-lg font-medium border-2 transition-colors ${
                formData.userType === 'Normal User'
                  ? 'border-orange-500 bg-orange-50 text-orange-500'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
              }`}
            >
              Normal User
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'Admin' })}
              className={`px-6 py-3 rounded-lg font-medium border-2 transition-colors ${
                formData.userType === 'Admin'
                  ? 'border-orange-500 bg-orange-50 text-orange-500'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      )}
    </FormModal>
  );
};

export default UserFormModal;