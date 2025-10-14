import React, { useState } from 'react';
import { X } from 'lucide-react';

const WhatsAppFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      const phoneNumber = '6281234567890';
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      setMessage('');
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-16 left-8 right-8 bottom-16 z-50 md:inset-auto md:bottom-24 md:right-6 md:w-80 md:h-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="text-white text-base sm:text-lg font-semibold">Maria Angela</h3>
                <p className="text-orange-100 text-xs sm:text-sm">Admin Support</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h100v100H0z" fill="%23f9fafb"/%3E%3Cpath d="M20 20h60v60H20z" fill="none" stroke="%23e5e7eb" stroke-width="0.5" opacity="0.3"/%3E%3C/svg%3E")' }}>
            <div className="flex gap-3 mb-4 sm:mb-6">
              <img 
                src="/admin-support.png" 
                alt="Admin" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
              />
              <div className="bg-white p-3 sm:p-4 rounded-lg rounded-tl-none shadow-sm max-w-[75%]">
                <p className="text-sm sm:text-base text-gray-700">Halo, Ada yang bisa kami bantu?</p>
                <span className="text-xs text-gray-400 mt-1 block">10:30</span>
              </div>
            </div>
            
            <div className="flex justify-end mb-4 sm:mb-6">
              <div className="bg-orange-500 p-3 sm:p-4 rounded-lg rounded-tr-none shadow-sm max-w-[75%]">
                <p className="text-sm sm:text-base text-white">Saya kesulitan mencari kopi</p>
                <span className="text-xs text-orange-100 mt-1 block text-right">10:31</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Masukan Pesan Anda"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              />
              <button
                onClick={handleSendMessage}
                className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-all transform hover:scale-110"
      >
        <img src="/ChatCircleDots.svg" alt="Logo chat" className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>
    </>
  );
};

export default WhatsAppFloating;