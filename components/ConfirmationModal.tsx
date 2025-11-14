
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children, confirmButtonText, confirmButtonClass }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="p-5">
            <div className="text-gray-300">{children}</div>
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
            type="button"
            onClick={onConfirm}
            className={`${confirmButtonClass || 'bg-red-600 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded-md transition-colors duration-200`}
          >
            {confirmButtonText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
