import React from 'react';
import { Plus } from 'lucide-react';

const ActionButton = ({ onClick, icon: Icon = Plus, children, variant = "primary" }) => {
  const variants = {
    primary: "bg-[#FF8906] text-[#0B132A] hover:bg-orange-600",
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