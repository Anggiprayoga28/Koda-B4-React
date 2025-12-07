import React from 'react';

/**
 * @param {string} text - Main text
 * @param {string} linkText - Link text
 * @param {Function} onClick - Click handler
 */

const LinkText = ({ text, linkText, onClick }) => (
  <p className="text-center text-gray-600 mt-6 text-sm">
    {text}{' '}
    <button onClick={onClick} className="text-#8E6447 hover:text-#7A5538 font-semibold">
      {linkText}
    </button>
  </p>
);

export default LinkText;