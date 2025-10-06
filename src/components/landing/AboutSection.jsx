import React from 'react';
import { Check } from 'lucide-react';

const AboutSection = () => (
  <section id="about" className="py- bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 items-center">
        <div>
          <h2 className="text-4xl mb-6">
            We Provide <span className="text-[#8E6447]">Good Coffee</span> and <span className="text-[#8E6447]">Healthy Meals</span>
          </h2>
          <p className="text-gray-600 mb-8">
            You can explore the menu that we provide with fun and have their own taste and make your day better.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">High quality beans</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">Healthy meals, you can request the ingredients</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">Chat with our staff to get better experience for ordering</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">Free member card with a minimum amount of IDR 200,000</span>
            </div>
          </div>
        </div>
        <div className="relative w-3xl">
          <img 
            src="/public/barista.png" 
            alt="Barista" 
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;