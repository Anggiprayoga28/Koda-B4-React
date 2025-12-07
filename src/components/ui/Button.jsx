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
    primary: "bg-[#6B727C] text-black hover:from-#7A5538 hover:to-#6B4E39",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    link: "text-#8E6447 hover:text-#7A5538 font-medium"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${widthStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;