import React from 'react';
import { User, Camera } from 'lucide-react';

const ProfileCard = ({ profileData, onPhotoUpload, formatDate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <h2 className="text-2xl font-semibold mb-2">{profileData.fullName}</h2>
      <p className="text-gray-600 mb-6">{profileData.email}</p>

      <div className="relative inline-block mb-6">
        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 mx-auto">
          {profileData.photoUrl ? (
            <img src={profileData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <User className="w-20 h-20 text-gray-500" />
            </div>
          )}
        </div>
        <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition">
          <Camera className="w-5 h-5" />
          <input 
            type="file" 
            accept="image/*" 
            onChange={onPhotoUpload}
            className="hidden" 
          />
        </label>
      </div>

      <button 
        onClick={() => document.querySelector('input[type="file"]').click()}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition mb-4"
      >
        Upload New Photo
      </button>

      <p className="text-sm text-gray-500">
        Since {formatDate(profileData.createdAt)}
      </p>
    </div>
  );
};

export default ProfileCard;