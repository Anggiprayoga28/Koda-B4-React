import React from 'react';
import { Search, Filter } from 'lucide-react';

/**
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search value
 * @param {Function} props.onSearchChange - Handler for search input change
 * @param {string} [props.placeholder='Search...'] - Input placeholder text
 * @param {boolean} [props.showFilter=true] - Show/hide filter button
 * @param {Function} [props.onFilterClick] - Handler for filter button click
 * @param {React.ReactNode} [props.extraFilters] - Additional filter components
 */
const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search...",
  showFilter = true,
  onFilterClick,
  extraFilters 
}) => {
  return (
    <div className="flex items-center gap-4">
      {extraFilters}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-80"
        />
        <Search className="absolute right-4 top-3 w-5 h-5 text-gray-400" />
      </div>
      {showFilter && (
        <button 
          onClick={onFilterClick}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filter</span>
        </button>
      )}
    </div>
  );
};

export default SearchFilter;