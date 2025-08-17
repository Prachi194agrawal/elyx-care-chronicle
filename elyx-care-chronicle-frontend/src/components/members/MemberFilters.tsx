import React from 'react';

interface MemberFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const MemberFilters: React.FC<MemberFiltersProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Members', count: null },
    { id: 'high-risk', label: 'High Risk', count: null },
    { id: 'active', label: 'High Engagement', count: null },
    { id: 'inactive', label: 'Low Engagement', count: null },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by:</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === filter.id
                ? 'bg-healthcare-100 text-healthcare-800 border border-healthcare-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {filter.label}
            {filter.count && (
              <span className="ml-1 text-xs bg-white px-1 rounded">
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemberFilters;
