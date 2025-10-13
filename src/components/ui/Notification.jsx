import React from 'react';

/**
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success|error)
 */

const Notification = ({ message, type }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white font-medium`}>
    {message}
  </div>
);

export default Notification;