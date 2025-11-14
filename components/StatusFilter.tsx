import React from 'react';

interface StatusFilterProps {
  activeFilter: 'all' | 'pending' | 'paid';
  onFilterChange: (filter: 'all' | 'pending' | 'paid') => void;
}

const filterOptions: { key: 'all' | 'pending' | 'paid'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'paid', label: 'Pagos' },
];

const StatusFilter: React.FC<StatusFilterProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="mb-4 flex items-center justify-center rounded-lg bg-gray-900/50 p-1.5 w-full sm:w-auto mx-auto">
      {filterOptions.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`w-full sm:w-auto text-center text-sm font-semibold py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            activeFilter === key
              ? 'bg-cyan-600 text-white shadow'
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
