import React from 'react';
import { Plus } from 'lucide-react';

/**
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button text/content
 * @param {string} [props.variant='primary'] - Button style variant (primary|secondary|danger)
 */
const ActionButton = ({ onClick, icon: Icon = Plus, children, variant = "primary" }) => {
  const variants = {
    primary: "bg-[#8E6447] text-[#0B132A] hover:bg-#7A5538",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold ${variants[variant]}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
};

export default ActionButton;