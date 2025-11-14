
import React from 'react';
import type { Agent, PaymentInfo } from '../types';
import { PlusIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon, MinusCircleIcon, TrashIcon, ArrowPathIcon } from './Icons';

interface AgentPaymentRowProps {
  agent: Agent;
  weeklyData: Record<number, Record<string, PaymentInfo>>;
  week: number;
  onAddLoan: (agent: Agent, week: number, type: 'loan') => void;
  onAddReceipt: (agent: Agent, week: number, type: 'receipt') => void;
  onAddSale: (agent: Agent, week: number, type: 'sale') => void;
  onConfirm: (agent: Agent, week: number) => void;
  onDelete: (agent: Agent) => void;
  onZeroOut: (agent: Agent, week: number) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const AgentPaymentRow: React.FC<AgentPaymentRowProps> = ({ agent, weeklyData, week, onAddLoan, onAddReceipt, onAddSale, onConfirm, onDelete, onZeroOut }) => {
    const paymentInfo = weeklyData[week]?.[agent.id] || { amountDue: 0, amountReceived: 0, salesValue: 0, isConfirmed: false };
    const { amountDue, amountReceived, salesValue, isConfirmed } = paymentInfo;
    const balance = salesValue + amountDue - amountReceived;

    let statusStyles = {
        bg: 'bg-gray-700/30',
        text: 'text-gray-400',
        icon: <MinusCircleIcon className="w-4 h-4" />,
        label: 'Sem Débito',
    };

    if (isConfirmed) {
        statusStyles = {
            bg: 'bg-green-500/10',
            text: 'text-green-400',
            icon: <CheckCircleIcon className="w-4 h-4" />,
            label: 'Pago',
        };
    } else if (balance > 0) {
        statusStyles = {
            bg: 'bg-red-500/10',
            text: 'text-red-400',
            icon: <XCircleIcon className="w-4 h-4" />,
            label: 'Pendente',
        };
    } else if (salesValue > 0 || amountDue > 0 || amountReceived > 0) {
        statusStyles = {
            bg: 'bg-yellow-500/10',
            text: 'text-yellow-400',
            icon: <CurrencyDollarIcon className="w-4 h-4" />,
            label: 'Aguardando Confirmação',
        };
    }

    return (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            
            {/* Agent Info */}
            <div className="flex-grow min-w-[200px]">
                <h3 className="text-lg font-bold text-white truncate">{agent.name}</h3>
                <div className={`inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-md mt-1 ${statusStyles.text} ${statusStyles.bg}`}>
                    {statusStyles.icon}
                    <span>{statusStyles.label}</span>
                </div>
            </div>
            
            {/* Financials */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm items-center">
                <div className="w-32">
                    <span className="text-gray-400 block text-xs">Vendas</span>
                    <span className="font-mono text-blue-400 block text-right">+ {formatCurrency(salesValue)}</span>
                </div>
                <div className="w-32">
                    <span className="text-gray-400 block text-xs">Empréstimos</span>
                    <span className="font-mono text-blue-400 block text-right">+ {formatCurrency(amountDue)}</span>
                </div>
                <div className="w-32">
                    <span className="text-gray-400 block text-xs">Recebido</span>
                    <span className="font-mono text-red-400 block text-right">- {formatCurrency(amountReceived)}</span>
                </div>
                <div className="font-bold w-32">
                    <span className="text-gray-300 block text-xs">Saldo</span>
                    <span className={`font-mono text-lg ${balance > 0 ? 'text-red-400' : 'text-green-400'} block text-right`}>{formatCurrency(balance)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2">
                <button onClick={() => onAddSale(agent, week, 'sale')} className="text-xs flex items-center justify-center gap-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 font-semibold py-1 px-2 rounded-md transition-colors">
                    <PlusIcon className="w-3 h-3" /> Venda
                </button>
                <button onClick={() => onAddLoan(agent, week, 'loan')} className="text-xs flex items-center justify-center gap-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 font-semibold py-1 px-2 rounded-md transition-colors">
                    <PlusIcon className="w-3 h-3" /> Emprés.
                </button>
                <button onClick={() => onAddReceipt(agent, week, 'receipt')} className="text-xs flex items-center justify-center gap-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold py-1 px-2 rounded-md transition-colors">
                    <PlusIcon className="w-3 h-3" /> Receb.
                </button>
                 <div className="h-6 w-px bg-gray-600"></div> {/* Separator */}
                <button 
                    onClick={() => onConfirm(agent, week)}
                    disabled={balance > 0 || isConfirmed}
                    title="Confirmar Pagamento"
                    className="p-2 rounded-md transition-colors bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    <CheckCircleIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onZeroOut(agent, week)}
                    title="Zerar Valores da Semana"
                    className="p-2 rounded-md transition-colors bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onDelete(agent)}
                    title="Excluir Cambista"
                    className="p-2 rounded-md transition-colors bg-red-800/50 hover:bg-red-700/60 text-red-300"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default AgentPaymentRow;
