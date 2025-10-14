import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Camera } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    photoUrl: '',
    createdAt: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    document.title = `My Profile - ${profileData.fullName || 'User'} | Coffee Shop`;
  }, [profileData.fullName]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const fullUser = users.find(u => u.email === currentUser.email);
    
    if (fullUser) {
      setProfileData({
        fullName: fullUser.fullName || '',
        email: fullUser.email || '',
        phone: fullUser.phone || '082116304338',
        address: fullUser.address || 'Griya Bandung Indah',
        password: fullUser.password || '',
        photoUrl: fullUser.photoUrl || '',
        createdAt: fullUser.createdAt || ''
      });
    }
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === profileData.email);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        photoUrl: profileData.photoUrl
      };
      
      localStorage.setItem('users', JSON.stringify(users));
      
      const currentUser = {
        id: users[userIndex].id,
        fullName: profileData.fullName,
        email: profileData.email,
        photoUrl: profileData.photoUrl
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      alert('Profile updated successfully!');
      setIsEditing(false);
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword.current || !newPassword.new || !newPassword.confirm) {
      alert('Please fill all password fields');
      return;
    }

    if (newPassword.current !== profileData.password) {
      alert('Current password is incorrect');
      return;
    }

    if (newPassword.new !== newPassword.confirm) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.new.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === profileData.email);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword.new;
      localStorage.setItem('users', JSON.stringify(users));
      
      setProfileData({ ...profileData, password: newPassword.new });
      setNewPassword({ current: '', new: '', confirm: '' });
      setShowPasswordModal(false);
      alert('Password changed successfully!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 py-6 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl font-light mb-6 md:mb-12">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">{profileData.fullName}</h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base">{profileData.email}</p>

              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mx-auto">
                  {profileData.photoUrl ? (
                    <img src={profileData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <img src='/Profile.svg' className="w-16 h-16 md:w-20 md:h-20 text-gray-500" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#FF8906] text-[#4F5665] p-2 rounded-full cursor-pointer hover:bg-orange-600 transition hidden">
                  <Camera className="w-5 h-5" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="hidden" 
                  />
                </label>
              </div>

              <button 
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="w-full bg-[#FF8906] text-black py-3 rounded-lg hover:bg-orange-600 transition mb-4 font-medium"
              >
                Upload New Photo
              </button>

              <p className="text-base md:text-lg text-gray-500">
                Since {formatDate(profileData.createdAt)}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <div className="space-y-5 md:space-y-6">
                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 disabled:bg-gray-50 disabled:text-gray-600 text-sm md:text-base"
                    />
                    <img src='/Profile.svg' className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">Email</label>
                  <div className="relative">
                    <input 
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 bg-gray-50 text-gray-600 text-sm md:text-base"
                    />
                    <img src='/mail.svg' className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">Phone</label>
                  <div className="relative">
                    <input 
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 disabled:bg-gray-50 disabled:text-gray-600 text-sm md:text-base"
                    />
                    <img src='/PhoneCall.svg' className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-base md:text-lg font-medium">Password</label>
                    <button 
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="text-orange-500 text-sm md:text-base hover:underline"
                    >
                      Set New Password
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value="**********"
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 pr-10 bg-gray-50 text-gray-600 text-sm md:text-base"
                    />
                    <img src='/Password.svg' className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">Address</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 disabled:bg-gray-50 disabled:text-gray-600 text-sm md:text-base"
                    />
                    <img src='/Location.svg' className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6 md:mt-8">
                {isEditing ? (
                  <>
                    <button 
                      type="submit"
                      className="flex-1 bg-[#FF8906] text-black py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                      Submit
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[#FF8906] text-black py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-base md:text-lg font-medium mb-2">Current Password</label>
                <input 
                  type="password"
                  value={newPassword.current}
                  onChange={(e) => setNewPassword({...newPassword, current: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-medium mb-2">New Password</label>
                <input 
                  type="password"
                  value={newPassword.new}
                  onChange={(e) => setNewPassword({...newPassword, new: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-medium mb-2">Confirm New Password</label>
                <input 
                  type="password"
                  value={newPassword.confirm}
                  onChange={(e) => setNewPassword({...newPassword, confirm: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={handlePasswordChange}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Change Password
              </button>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword({ current: '', new: '', confirm: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;