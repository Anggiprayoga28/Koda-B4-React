import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection = () => (
  <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="flex justify-center order-1">
          <img 
            src="/viezh.png" 
            alt="Customer" 
            className="h-64 sm:h-72 lg:h-80 w-auto object-cover rounded-lg" 
          />
        </div>
        <div className="order-2">
          <div className="text-xs sm:text-sm text-#C5A053 mb-2 tracking-wider">TESTIMONIAL</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Viezh Robert</h2>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            "Wow... I am very happy to spend my whole day here. The Wi-fi is good, and the coffee and meals taste so good. I like it here!! Very recommended!"
          </p>
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 sm:w-5 sm:h-5 fill-#C5A053 text-#C5A053" />
            ))}
            <span className="ml-2 text-base sm:text-lg font-semibold">5.0</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialSection;