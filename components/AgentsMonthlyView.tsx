import React, { useMemo, useState } from 'react';
import type { Agent, PaymentInfo } from '../types';
import { CheckCircleIcon, XCircleIcon, CurrencyDollarIcon, MinusCircleIcon, DocumentArrowDownIcon } from './Icons';
import WeeklyTabs from './WeeklyTabs';
import AgentPaymentRow from './AgentPaymentRow';
import StatusFilter from './StatusFilter';

// Declaração para a biblioteca jsPDF carregada via CDN
declare global {
  interface Window {
    jspdf: any;
  }
}

interface AgentsMonthlyViewProps {
  agents: Agent[];
  weeklyData: Record<number, Record<string, PaymentInfo>>;
  onAddLoan: (agent: Agent, week: number, type: 'loan') => void;
  onAddReceipt: (agent: Agent, week: number, type: 'receipt') => void;
  onAddSale: (agent: Agent, week: number, type: 'sale') => void;
  onConfirm: (agent: Agent, week: number) => void;
  onDeleteAgent: (agent: Agent) => void;
  onZeroOutAgent: (agent: Agent, week: number) => void;
  isFiltered: boolean;
  activeWeek: number;
  setActiveWeek: (week: number) => void;
  statusFilter: 'all' | 'pending' | 'paid';
  onStatusFilterChange: (filter: 'all' | 'pending' | 'paid') => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MonthlySummaryCard: React.FC<{ title: string; received: number; pending: number; }> = ({ title, received, pending }) => (
    <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
        <h3 className="font-bold text-white text-center mb-3">{title}</h3>
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400">
                <CheckCircleIcon className="w-5 h-5" />
                <div className="flex-1 flex justify-between items-baseline">
                    <span className="text-sm text-gray-400">Recebido:</span>
                    <span className="font-mono font-semibold">{formatCurrency(received)}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 text-red-400">
                <XCircleIcon className="w-5 h-5" />
                <div className="flex-1 flex justify-between items-baseline">
                    <span className="text-sm text-gray-400">Pendente:</span>
                    <span className="font-mono font-semibold">{formatCurrency(pending)}</span>
                </div>
            </div>
        </div>
    </div>
);


const AgentsMonthlyView: React.FC<AgentsMonthlyViewProps> = ({ agents, weeklyData, onAddLoan, onAddReceipt, onAddSale, onConfirm, onDeleteAgent, onZeroOutAgent, isFiltered, activeWeek, setActiveWeek, statusFilter, onStatusFilterChange }) => {
  const weeks = [1, 2, 3, 4];
  
  const monthlySummary = useMemo(() => {
    const summaryByWeek: Record<number, { totalReceived: number, totalPending: number }> = {
      1: { totalReceived: 0, totalPending: 0 },
      2: { totalReceived: 0, totalPending: 0 },
      3: { totalReceived: 0, totalPending: 0 },
      4: { totalReceived: 0, totalPending: 0 },
    };

    weeks.forEach(week => {
        const currentWeekData = weeklyData[week] || {};
        agents.forEach(agent => {
            const payment = currentWeekData[agent.id] || { amountDue: 0, amountReceived: 0, salesValue: 0, isConfirmed: false };
            if (payment.isConfirmed) {
                summaryByWeek[week].totalReceived += payment.amountReceived;
            } else {
                const balance = (payment.salesValue + payment.amountDue) - payment.amountReceived;
                if (balance > 0) {
                    summaryByWeek[week].totalPending += balance;
                }
            }
        });
    });

    return summaryByWeek;
  }, [weeklyData, agents]);

  const getAgentWeekData = (agent: Agent, week: number) => {
    const paymentInfo = weeklyData[week]?.[agent.id] || { amountDue: 0, amountReceived: 0, salesValue: 0, isConfirmed: false };
    const { amountDue, amountReceived, salesValue, isConfirmed } = paymentInfo;
    const balance = salesValue + amountDue - amountReceived;

    let statusLabel = 'Sem Débito';
    if (isConfirmed) {
        statusLabel = 'Pago';
    } else if (balance > 0) {
        statusLabel = 'Pendente';
    } else if (salesValue > 0 || amountDue > 0 || amountReceived > 0) {
        statusLabel = 'Aguardando Confirmação';
    }
    
    return {
        name: agent.name,
        sales: salesValue,
        loans: amountDue,
        received: amountReceived,
        balance,
        status: statusLabel,
    };
  }

  const handleExportCSV = () => {
    const headers = ['Nome', 'Vendas', 'Empréstimos', 'Recebido', 'Saldo', 'Status'];
    const rows = agents.map(agent => {
        const data = getAgentWeekData(agent, activeWeek);
        return [
            `"${data.name}"`,
            data.sales.toFixed(2),
            data.loans.toFixed(2),
            data.received.toFixed(2),
            data.balance.toFixed(2),
            `"${data.status}"`
        ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const date = new Date().toISOString().slice(0, 7);
    link.setAttribute("download", `Relatorio_Semana_${activeWeek}_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text(`Relatório de Cambistas - Semana ${activeWeek}`, 14, 16);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);

    const tableColumn = ['Nome', 'Vendas', 'Empréstimos', 'Recebido', 'Saldo', 'Status'];
    const tableRows: any[][] = [];

    agents.forEach(agent => {
        const data = getAgentWeekData(agent, activeWeek);
        const rowData = [
            data.name,
            formatCurrency(data.sales),
            formatCurrency(data.loans),
            formatCurrency(data.received),
            formatCurrency(data.balance),
            data.status
        ];
        tableRows.push(rowData);
    });

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [38, 166, 154] }, // Cor ciano
        styles: { font: 'helvetica', fontSize: 9 },
    });
    
    const date = new Date().toISOString().slice(0, 7);
    doc.save(`Relatorio_Semana_${activeWeek}_${date}.pdf`);
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Resumo do Mês</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeks.map(week => (
                <MonthlySummaryCard 
                    key={week}
                    title={`Semana ${week}`}
                    received={monthlySummary[week].totalReceived}
                    pending={monthlySummary[week].totalPending}
                />
            ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Visão Semanal dos Cambistas</h2>
        <WeeklyTabs weeks={weeks} activeWeek={activeWeek} setActiveWeek={setActiveWeek} />
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <StatusFilter activeFilter={statusFilter} onFilterChange={onStatusFilterChange} />
          <div className="flex items-center gap-2">
             <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-md transition-colors">
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Exportar CSV</span>
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-md transition-colors">
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
            {agents.length > 0 ? (
                agents.map((agent) => (
                    <AgentPaymentRow
                        key={agent.id}
                        agent={agent}
                        weeklyData={weeklyData}
                        week={activeWeek}
                        onAddLoan={onAddLoan}
                        onAddReceipt={onAddReceipt}
                        onAddSale={onAddSale}
                        onConfirm={onConfirm}
                        onDelete={onDeleteAgent}
                        onZeroOut={onZeroOutAgent}
                    />
                ))
            ) : (
                <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-lg">{isFiltered ? 'Nenhum cambista corresponde aos filtros selecionados.' : 'Nenhum cambista adicionado.'}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {isFiltered ? 'Tente alterar os filtros de grupo ou status, ou adicione um cambista.' : 'Use o formulário acima para começar a gerenciar seus cambistas.'}
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AgentsMonthlyView;