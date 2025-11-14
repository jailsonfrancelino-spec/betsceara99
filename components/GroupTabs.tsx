import React from 'react';
import type { Group } from '../types';

interface GroupTabsProps {
  groups: Group[];
  activeGroupId: string;
  setActiveGroupId: (groupId: string) => void;
}

const GroupTabs: React.FC<GroupTabsProps> = ({ groups, activeGroupId, setActiveGroupId }) => {
  return (
    <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Filtrar por Grupo</h2>
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex gap-4 sm:gap-6 overflow-x-auto" aria-label="Tabs">
            <button
                onClick={() => setActiveGroupId('all')}
                className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeGroupId === 'all'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
            >
                Todos
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeGroupId === group.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                {group.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
  );
};

export default GroupTabs;
