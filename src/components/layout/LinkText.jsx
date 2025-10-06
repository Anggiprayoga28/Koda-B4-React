import React from 'react';

const LinkText = ({ text, linkText, onClick }) => (
  <p className="text-center text-gray-600 mt-6 text-sm">
    {text}{' '}
    <button onClick={onClick} className="text-orange-500 hover:text-orange-600 font-semibold">
      {linkText}
    </button>
  </p>
);

export default LinkText;