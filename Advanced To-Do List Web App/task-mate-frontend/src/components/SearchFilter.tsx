import React from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        />
      </div>
      <div className="w-full md:w-48">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter; 