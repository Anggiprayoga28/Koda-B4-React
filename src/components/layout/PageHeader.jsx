import React from 'react';
import Logo from '../ui/Logo';

/**
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle
 */

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-10">
    <div className=" flex mb-8">
      <Logo />
    </div>
    <h1 className="text-3xl text-[#8E6447] mb-2">{title}</h1>
    {subtitle && <p className="text-gray-500 text-base">{subtitle}</p>}
  </div>
);

export default PageHeader;