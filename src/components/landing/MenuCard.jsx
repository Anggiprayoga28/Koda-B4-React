import React from 'react';
import { ShoppingCart } from 'lucide-react';

const MenuCard = ({ title, price, description, image, isFlashSale }) => {
  return (
    <div className="relative overflow-hidden sm:w-[280px] md:w-[300px] min-h-[420px] mx-auto">
      <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
        {isFlashSale && (
          <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-full z-10">
            FLASH SALE!
          </span>
        )}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[90%] sm:w-[90%] md:w-[262px] bg-white p-4 shadow-md">
        <h3 className="text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex flex-col text-left">
          <span className="text-lg text-[#FF8906] mb-2">
            IDR {price}
          </span>

          <div className="flex justify-between gap-2">
            <button className="w-full bg-[#FF8906] hover:bg-[#e67a05] text-black font-medium px-4 py-2 rounded-md transition-colors">
              Buy
            </button>
            <button className="border border-[#FF8906] p-2 rounded-md hover:bg-[#FFF3E0] transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#FF8906]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;