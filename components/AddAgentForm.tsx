import React, { useState } from 'react';
import { UserPlusIcon } from './Icons';
import type { Group } from '../types';

interface AddAgentFormProps {
  onAddAgent: (name: string, groupIds: string[]) => void;
  groups: Group[];
}

const AddAgentForm: React.FC<AddAgentFormProps> = ({ onAddAgent, groups }) => {
  const [name, setName] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddAgent(name.trim(), selectedGroupIds);
      setName('');
      setSelectedGroupIds([]);
    }
  };

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-3">Adicionar Novo Cambista</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do cambista"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Atribuir a Grupos:</h3>
          <div className="max-h-24 overflow-y-auto space-y-2 pr-2">
            {groups.length > 0 ? groups.map(group => (
              <label key={group.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedGroupIds.includes(group.id)}
                  onChange={() => handleGroupChange(group.id)}
                  className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-white">{group.name}</span>
              </label>
            )) : <p className="text-gray-500 text-sm">Nenhum grupo criado.</p>}
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!name.trim()}
        >
          <UserPlusIcon className="w-5 h-5" />
          Adicionar Cambista
        </button>
      </form>
    </div>
  );
};

export default AddAgentForm;
