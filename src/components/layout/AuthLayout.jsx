import React from 'react';

const AuthLayout = ({ children, imageUrl }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-[30%] relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Coffee" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      </div>

      <div className="flex-1 lg:w-[70%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-3xl px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;