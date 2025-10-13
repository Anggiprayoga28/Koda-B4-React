import React from 'react';

const MapSection = () => (
  <section className="py-12 sm:py-16 lg:py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-4xl mb-3 sm:mb-4 px-4">
          Visit Our Store in the <span className="text-orange-500">Spot on the Map</span> Below
        </h2>
        <p className="text-gray-600 text-sm sm:text-base px-4">
          You can explore the menu that we provide with fun and have their own taste and make your day better
        </p>
      </div>
      <div className="relative h-64 sm:h-80 lg:h-96 bg-white rounded-lg overflow-hidden">
        <img 
          src="/public/huge.svg" 
          alt="Map" 
          className="w-full h-full object-cover opacity-50" 
        />
      </div>
    </div>
  </section>
);

export default MapSection;