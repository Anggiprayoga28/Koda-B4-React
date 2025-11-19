import React from 'react';

const HeroSection = () => (
  <section className="min-h-screen flex flex-col lg:flex-row">
    <div className="w-full lg:w-1/2 bg-gray-900 text-white flex items-center order-2 lg:order-1">
      <div className="px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 w-full">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-5 lg:mb-6 leading-tight">
          Start Your Day with<br />
          Coffee and Good<br />
          Meals
        </h1>
        <p className="text-gray-300 mb-6 sm:mb-8 lg:mb-10 text-base sm:text-lg max-w-lg">
          We provide high quality beans, good taste, and healthy meals made by love just for you. Start your day with us for a bigger smile!
        </p>
        <button className="bg-orange-500 w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-base sm:text-lg">
          Get Started
        </button>
        
        <div className="flex gap-8 sm:gap-12 lg:gap-16 mt-12 sm:mt-14 lg:mt-16">
          <div>
            <div className="text-4xl sm:text-5xl text-orange-400 mb-2">90+</div>
            <div className="text-gray-400 text-sm sm:text-base">Staff</div>
          </div>
          <div className="border-l border-gray-700 pl-8 sm:pl-12 lg:pl-16">
            <div className="text-4xl sm:text-5xl text-orange-400 mb-2">30+</div>
            <div className="text-gray-400 text-sm sm:text-base">Stores</div>
          </div>
          <div className="border-l border-gray-700 pl-8 sm:pl-12 lg:pl-16">
            <div className="text-4xl sm:text-5xl text-orange-400 mb-2">800+</div>
            <div className="text-gray-400 text-sm sm:text-base">Customer</div>
          </div>
        </div>
      </div>
    </div>

    <div className="w-full lg:w-1/2 relative h-64 sm:h-80 md:h-96 lg:h-auto order-1 lg:order-2">
      <img 
        src="/harlan.png" 
        alt="Coffee cups with different stages" 
        className="w-full h-full object-cover" 
      />
    </div>
  </section>
);

export default HeroSection;