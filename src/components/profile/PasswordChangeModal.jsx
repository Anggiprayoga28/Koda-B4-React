import React from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

const PasswordChangeModal = ({ 
  show, 
  newPassword, 
  setNewPassword, 
  onSubmit, 
  onCancel 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        
        <div className="space-y-4">
          <InputField 
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={newPassword.current}
            onChange={(e) => setNewPassword({...newPassword, current: e.target.value})}
          />

          <InputField 
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword.new}
            onChange={(e) => setNewPassword({...newPassword, new: e.target.value})}
          />

          <InputField 
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={newPassword.confirm}
            onChange={(e) => setNewPassword({...newPassword, confirm: e.target.value})}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button variant="primary" onClick={onSubmit}>
            Change Password
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;