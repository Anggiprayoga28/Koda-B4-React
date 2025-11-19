import React from 'react';
import { Check } from 'lucide-react';

const AboutSection = () => (
  <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl sm:text-4xl mb-4 sm:mb-6">
            We Provide <span className="text-[#8E6447]">Good Coffee</span> and <span className="text-[#8E6447]">Healthy Meals</span>
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            You can explore the menu that we provide with fun and have their own taste and make your day better.
          </p>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 text-sm sm:text-base">High quality beans</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 text-sm sm:text-base">Healthy meals, you can request the ingredients</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 text-sm sm:text-base">Chat with our staff to get better experience for ordering</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 text-sm sm:text-base">Free member card with a minimum amount of IDR 200,000</span>
            </div>
          </div>
        </div>
        <div className="relative w-full order-1 md:order-2">
          <img 
            src="/about.png" 
            alt="Barista"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;