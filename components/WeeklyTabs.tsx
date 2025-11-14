
import React from 'react';

interface WeeklyTabsProps {
  weeks: number[];
  activeWeek: number;
  setActiveWeek: (week: number) => void;
}

const WeeklyTabs: React.FC<WeeklyTabsProps> = ({ weeks, activeWeek, setActiveWeek }) => {
  return (
    <div className="mb-4">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex gap-4 sm:gap-6 overflow-x-auto" aria-label="Tabs">
            {weeks.map((week) => (
              <button
                key={week}
                onClick={() => setActiveWeek(week)}
                className={`shrink-0 border-b-2 px-3 pb-3 text-sm font-medium ${
                  activeWeek === week
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                Semana {week}
              </button>
            ))}
          </nav>
        </div>
      </div>
  );
};

export default WeeklyTabs;
