import React, { useState } from 'react';
import { PlusIcon } from './Icons';

interface AddGroupFormProps {
  onAddGroup: (name: string) => void;
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onAddGroup }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGroup(name.trim());
      setName('');
    }
  };

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 h-full">
      <h2 className="text-xl font-semibold text-white mb-3">Adicionar Novo Grupo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do grupo"
          className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!name.trim()}
        >
          <PlusIcon className="w-5 h-5" />
          Adicionar Grupo
        </button>
      </form>
    </div>
  );
};

export default AddGroupForm;
