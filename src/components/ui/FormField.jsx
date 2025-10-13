import React from 'react';

/**
 * @param {string} label - Field label
 * @param {ReactNode} children - Input component
 * @param {string} error - Error message
 */

const FormField = ({ label, children, error }) => (
  <div>
    <label className="block text-sm text-gray-800 mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);

export default FormField;