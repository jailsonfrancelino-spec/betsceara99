
import React, { useState, useEffect } from 'react';
import type { ModalConfig } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  config: ModalConfig | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSubmit, config }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen || !config) return null;

  const { agent, type, week } = config;

  const details = {
    loan: { title: 'Adicionar Empréstimo', buttonLabel: 'Registrar Empréstimo', themeColor: 'red' },
    receipt: { title: 'Adicionar Recebimento', buttonLabel: 'Registrar Recebimento', themeColor: 'green' },
    sale: { title: 'Adicionar Venda', buttonLabel: 'Registrar Venda', themeColor: 'blue' },
  }[type];


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onSubmit(numericAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className={`p-5 border-b border-gray-700`}>
          <h2 className="text-2xl font-bold text-white">{details.title}</h2>
          <p className="text-gray-400">Para <span className="font-semibold text-cyan-400">{agent.name}</span> na Semana {week}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-300">
              Valor (R$)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              step="0.01"
              min="0.01"
              autoFocus
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex justify-end gap-3 p-5 bg-gray-800/50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`bg-${details.themeColor}-600 hover:bg-${details.themeColor}-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed`}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {details.buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;