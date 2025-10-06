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
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="text-white">Maria Angela</h3>
                <p className="text-orange-100 text-xs">Admin Support</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 h-64 overflow-y-auto">
            <div className="flex gap-2 mb-4">
              <img 
                src="/public/admin-support.png" 
                alt="Admin" 
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[70%]">
                <p className="text-sm text-gray-700">Halo, Ada yang bisa kami bantu?</p>
              </div>
            </div>
            
            <div className="flex justify-end mb-4">
              <div className="bg-orange-100 p-3 rounded-lg max-w-[70%]">
                <p className="text-sm text-gray-700">Saya kesulitan mencari kopi</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Masukan Pesan Anda"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all transform hover:scale-110"
      >
        <img src="/public/ChatCircleDots.svg" alt="Logo chat" />
      </button>
    </>
  );
};

export default WhatsAppFloating;