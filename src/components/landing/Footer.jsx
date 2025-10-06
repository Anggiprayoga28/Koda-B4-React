import React from 'react';
import Logo from '../ui/Logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <Logo/>
          <p className="text-gray-600 mt-4 text-sm">
            Coffee Shop is a store that sells some good meals and is based in Indonesia
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-orange-500">Download</a></li>
            <li><a href="#" className="hover:text-orange-500">Pricing</a></li>
            <li><a href="#" className="hover:text-orange-500">Location</a></li>
            <li><a href="#" className="hover:text-orange-500">Countries</a></li>
            <li><a href="#" className="hover:text-orange-500">Blog</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Engage</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-orange-500">Coffee Shop</a></li>
            <li><a href="#" className="hover:text-orange-500">FAQ</a></li>
            <li><a href="#" className="hover:text-orange-500">About Us</a></li>
            <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange-500">Terms of Service</a></li>
          </ul>
        </div>
        <div>
            <div className="flex gap-3 mt-4">
            <button className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-black hover:bg-orange-500">
              <Facebook size={16} strokeWidth={0.5} absoluteStrokeWidth />
            </button>
            <button className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-black hover:bg-orange-500">
              <Twitter size={16} strokeWidth={0.5} absoluteStrokeWidth />
            </button>
            <button className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-black hover:bg-orange-500">
              <Instagram size={16} strokeWidth={0.5} absoluteStrokeWidth />
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;