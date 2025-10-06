import React from 'react';

const FormField = ({ label, children, error }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);

export default FormField;