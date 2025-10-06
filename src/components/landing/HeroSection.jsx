import React from 'react';

const HeroSection = () => (
  <section className="min-h-screen flex">
    <div className="w-1/2 bg-gray-900 text-white flex items-center">
      <div className="px-16 py-20">
        <h1 className="text-6xl mb-6 leading-tight">
          Start Your Day with<br />
          Coffee and Good<br />
          Meals
        </h1>
        <p className="text-gray-300 mb-10 text-lg max-w-lg">
          We provide high quality beans, good taste, and healthy meals made by love just for you. Start your day with us for a bigger smile!
        </p>
        <button className="bg-orange-500 px-10 py-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg">
          Get Started
        </button>
        
        <div className="flex gap-16 mt-16">
          <div>
            <div className="text-5xl text-orange-400 mb-2">90+</div>
            <div className="text-gray-400">Staff</div>
          </div>
          <div className="border-l border-gray-700 pl-16">
            <div className="text-5xl text-orange-400 mb-2">30+</div>
            <div className="text-gray-400">Stores</div>
          </div>
          <div className="border-l border-gray-700 pl-16">
            <div className="text-5xl text-orange-400 mb-2">800+</div>
            <div className="text-gray-400">Customer</div>
          </div>
        </div>
      </div>
    </div>

    <div className="w-1/2 relative">
      <img 
        src="/coffe-landing.png" 
        alt="Coffee cups with different stages" 
        className="w-full h-full object-cover" 
      />
    </div>
  </section>
);

export default HeroSection;