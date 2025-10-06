import React from 'react';
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

const ProfileForm = ({ profileData, setProfileData, isEditing, setIsEditing, onSubmit, onPasswordClick }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm p-8">
      <div className="space-y-6">
        <InputField 
          label="Full Name"
          icon={User}
          type="text"
          placeholder="Enter your full name"
          value={profileData.fullName}
          onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
          disabled={!isEditing}
        />

        <InputField 
          label="Email"
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          value={profileData.email}
          disabled={true}
        />

        <InputField 
          label="Phone"
          icon={Phone}
          type="tel"
          placeholder="Enter your phone number"
          value={profileData.phone}
          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
          disabled={!isEditing}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Password</label>
            <button 
              type="button"
              onClick={onPasswordClick}
              className="text-orange-500 text-sm font-medium hover:underline"
            >
              Set New Password
            </button>
          </div>
          <InputField 
            icon={Lock}
            type="password"
            value="**********"
            disabled={true}
          />
        </div>

        <InputField 
          label="Address"
          icon={MapPin}
          type="text"
          placeholder="Enter your address"
          value={profileData.address}
          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
          disabled={!isEditing}
        />
      </div>

      <div className="flex gap-4 mt-8">
        {isEditing ? (
          <>
            <Button type="submit" variant="primary">
              Submit
            </Button>
            <Button 
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button 
            type="button"
            variant="primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;