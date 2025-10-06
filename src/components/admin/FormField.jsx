import React from 'react';

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  required = false,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-base font-semibold text-gray-900 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
        />
        {Icon && <Icon className="w-5 h-5 absolute left-3 top-4 text-gray-400" />}
      </div>
    </div>
  );
};

export default FormField;