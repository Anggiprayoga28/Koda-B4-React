import React from 'react';
import { X } from 'lucide-react';

const FormModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  submitText = "Submit"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full ${maxWidth} bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-8 py-6 space-y-6 pb-32">
        {children}
      </div>

      <div className="fixed bottom-0 right-0 w-full ${maxWidth} bg-white border-t border-gray-200 px-8 py-6">
        <button
          onClick={onSubmit}
          className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          {submitText}
        </button>
      </div>
    </div>
  );
};

export default FormModal;