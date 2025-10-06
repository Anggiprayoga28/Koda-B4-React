import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems 
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(currentPage + 2);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex items-center gap-3">
        {renderPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-12 h-12 rounded-full text-sm font-semibold transition-all ${
              currentPage === pageNum
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {pageNum}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-12 h-12 rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
        >
          →
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Show {itemsPerPage} of {totalItems} items
      </p>
    </div>
  );
};

export default Pagination;