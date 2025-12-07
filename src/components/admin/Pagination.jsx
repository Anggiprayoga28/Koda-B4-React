import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Handler when page changes
 * @param {number} props.itemsPerPage - Number of items per page (limit)
 * @param {number} props.totalItems - Total number of items
 * @param {boolean} props.compact - Use compact mode (optional)
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  compact = false
}) => {
  if (!totalPages || totalPages <= 0) return null;
  if (!currentPage || currentPage <= 0) currentPage = 1;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = compact ? 3 : 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(maxVisible - 1, totalPages - 1);
      }
      
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - (maxVisible - 2));
        endPage = totalPages - 1;
      }
      
      if (startPage > 2) {
        pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages) {
      onPageChange(page);
      
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center gap-4 py-6 sm:py-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className={`
            w-10 h-10 sm:w-12 sm:h-12 rounded-full 
            flex items-center justify-center
            transition-all duration-200
            ${canGoPrev 
              ? 'bg-#8E6447 hover:bg-#7A5538 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {renderPageNumbers().map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span 
                key={`ellipsis-${index}`}
                className="px-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                text-sm sm:text-base font-medium
                transition-all duration-200
                ${currentPage === pageNum
                  ? 'bg-[#8E6447] hover:bg-#7A5538 text-white shadow-lg scale-110' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`
            w-10 h-10 sm:w-12 sm:h-12 rounded-full 
            flex items-center justify-center
            transition-all duration-200
            ${canGoNext 
              ? 'bg-#8E6447 hover:bg-#7A5538 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} items
      </p>
    </div>
  );
};

export default Pagination;