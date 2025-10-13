import React from 'react';

/**
 * @param {string} text - Main text
 * @param {string} linkText - Link text
 * @param {Function} onClick - Click handler
 */

const LinkText = ({ text, linkText, onClick }) => (
  <p className="text-center text-gray-600 mt-6 text-sm">
    {text}{' '}
    <button onClick={onClick} className="text-orange-500 hover:text-orange-600 font-semibold">
      {linkText}
    </button>
  </p>
);

export default LinkText;