import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection = () => (
  <section className="py-20 bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <img 
          src="/public/viezh.png" 
          alt="Customer" 
          className="h-80 w-5xl object-cover justify-center" 
        />
        <div>
          <div className="text-sm text-orange-400 mb-2">TESTIMONIAL</div>
          <h2 className="text-4xl font-bold mb-6">Viezh Robert</h2>
          <p className="text-gray-300 mb-6">
            "Wow... I am very happy to spend my whole day here. The Wi-fi is good, and the coffee and meals taste so good. I like it here!! Very recommended!"
          </p>
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-orange-400 text-orange-400" />
            ))}
            <span className="ml-2 text-lg font-semibold">5.0</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialSection;