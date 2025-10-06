import React from 'react';
import Logo from '../ui/Logo';

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-10">
    <div className=" flex mb-8">
      <Logo />
    </div>
    <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
    {subtitle && <p className="text-gray-500 text-base">{subtitle}</p>}
  </div>
);

export default PageHeader;