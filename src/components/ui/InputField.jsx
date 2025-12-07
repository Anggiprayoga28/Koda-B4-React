import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * @param {string} type - Input type
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {Function} onChange - Change handler
 * @param {string} name - Input name
 * @param {boolean} disabled - Disabled state
 * @param {string} label - Input label
 * @param {ReactNode} rightElement - Right side element
 */

const InputField = ({ 
  icon: Icon, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name,
  disabled = false,
  label,
  rightElement
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-12' : 'px-4'} ${type === 'password' || rightElement ? 'pr-12' : 'pr-4'} py-4 ${
            disabled ? 'bg-gray-50 text-gray-600' : 'bg-gray-50'
          } border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E6447] focus:border-transparent transition-all text-gray-700 placeholder-gray-400 disabled:cursor-not-allowed text-base`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        {rightElement && type !== 'password' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;