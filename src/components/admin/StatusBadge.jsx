import React from 'react';

/**
 * @param {Object} props - Component props
 * @param {string} props.status - Status text to display
 * @param {string} [props.variant='default'] - Badge color variant (success|warning|danger|default)
 */
const StatusBadge = ({ status, variant = "default" }) => {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    danger: 'bg-red-100 text-red-700',
    default: 'bg-gray-100 text-gray-700'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;