import React from 'react';

/**
 * @param {ReactNode} children - Button content
 * @param {Function} onClick - Click handler
 * @param {string} type - Button type
 * @param {boolean} fullWidth - Full width flag
 * @param {string} className - Additional classes
 */

const Button = ({ children, onClick, variant = 'primary', type = 'button', fullWidth = true, className = '' }) => {
  const baseStyle = "py-4 transition-all shadow-sm text-base";
  const widthStyle = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-[#FF8906] text-black hover:from-orange-600 hover:to-orange-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    link: "text-orange-500 hover:text-orange-600 font-medium"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${widthStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;