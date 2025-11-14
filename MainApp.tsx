import React, { useState, useMemo } from 'react';
import type { Agent, PaymentInfo, ModalConfig, TransactionType, Group } from './types';
import AddAgentForm from './components/AddAgentForm';
import AddTransactionModal from './components/AddTransactionModal';
import { CurrencyDollarIcon, LogoutIcon } from './components/Icons';
import AddGroupForm from './components/AddGroupForm';
import GroupTabs from './components/GroupTabs';
import ConfirmationModal from './components/ConfirmationModal';
import AgentsMonthlyView from './components/AgentsMonthlyView';

interface MainAppProps {
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [groups, setGroups] = useState<Group[]>([
    { id: 'group-1', name: 'Zona Leste' },
    { id: 'group-2', name: 'Zona Oeste' },
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    { id: 'agent-1', name: 'João da Silva', groupIds: ['group-1'] },
    { id: 'agent-2', name: 'Maria Oliveira', groupIds: ['group-2'] },
    { id: 'agent-3', name: 'Carlos Pereira', groupIds: ['group-1', 'group-2'] },
  ]);
  
  const [weeklyData, setWeeklyData] = useState<Record<number, Record<string, PaymentInfo>>>({
    1: {
      'agent-1': { amountDue: 500, amountReceived: 500, salesValue: 1200, isConfirmed: true },
      'agent-2': { amountDue: 300, amountReceived: 100, salesValue: 800, isConfirmed: false },
      'agent-3': { amountDue: 0, amountReceived: 0, salesValue: 500, isConfirmed: false },
    },
    2: {
      'agent-1': { amountDue: 400, amountReceived: 400, salesValue: 1000, isConfirmed: false },
      'agent-2': { amountDue: 250, amountReceived: 0, salesValue: 600, isConfirmed: false },
    },
    3: {},
    4: {},
  });
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>('all');
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [agentToZeroOut, setAgentToZeroOut] = useState<{ agent: Agent, week: number } | null>(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');


  const handleAddGroup = (name: string) => {
    const newGroup: Group = { id: crypto.randomUUID(), name };
    setGroups(prev => [...prev, newGroup]);
  };

  const handleAddAgent = (name: string, groupIds: string[]) => {
    const newAgent: Agent = { id: crypto.randomUUID(), name, groupIds };
    setAgents(prev => [...prev, newAgent]);
  };

  const openTransactionModal = (agent: Agent, week: number, type: TransactionType) => {
    setModalConfig({ agent, week, type });
    setIsModalOpen(true);
  };

  const handleTransactionSubmit = (amount: number) => {
    if (!modalConfig) return;
    const { agent, week, type } = modalConfig;

    setWeeklyData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const weekData = newData[week] || {};
      const agentData = weekData[agent.id] || { amountDue: 0, amountReceived: 0, salesValue: 0, isConfirmed: false };

      if (type === 'loan') {
        agentData.amountDue += amount;
      } else if (type === 'receipt') {
        agentData.amountReceived += amount;
      } else if (type === 'sale') {
        agentData.salesValue += amount;
      }

      weekData[agent.id] = agentData;
      newData[week] = weekData;
      return newData;
    });

    setIsModalOpen(false);
    setModalConfig(null);
  };

  const handleConfirmReceipt = (agent: Agent, week: number) => {
    setWeeklyData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        const weekData = newData[week] || {};
        const agentData = weekData[agent.id] || { amountDue: 0, amountReceived: 0, salesValue: 0, isConfirmed: false };
        
        agentData.isConfirmed = true;
  
        weekData[agent.id] = agentData;
        newData[week] = weekData;
        return newData;
      });
  };

  const handleRequestDelete = (agent: Agent) => {
    setAgentToDelete(agent);
  };

  const handleConfirmDelete = () => {
    if (!agentToDelete) return;

    setAgents(prev => prev.filter(agent => agent.id !== agentToDelete.id));

    setWeeklyData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      Object.keys(newData).forEach(week => {
        if (newData[week][agentToDelete.id]) {
          delete newData[week][agentToDelete.id];
        }
      });
      return newData;
    });

    setAgentToDelete(null);
  };

  const handleRequestZeroOut = (agent: Agent, week: number) => {
    setAgentToZeroOut({ agent, week });
  };

  const handleConfirmZeroOut = () => {
    if (!agentToZeroOut) return;
    const { agent, week } = agentToZeroOut;

    setWeeklyData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const weekData = newData[week] || {};
      // Reset values but keep the entry
      weekData[agent.id] = { amountDue: 0, amountReceived: 0, salesValue: 0, isConfirmed: false };
      newData[week] = weekData;
      return newData;
    });

    setAgentToZeroOut(null);
  };

  const filteredAgents = useMemo(() => {
    const agentsByGroup = activeGroupId === 'all'
      ? agents
      : agents.filter(agent => agent.groupIds.includes(activeGroupId));

    const agentsByStatus = agentsByGroup.filter(agent => {
      if (statusFilter === 'all') {
        return true;
      }

      const paymentInfo = weeklyData[activeWeek]?.[agent.id] || { amountDue: 0, amountReceived: 0, salesValue: 0, isConfirmed: false };
      
      if (statusFilter === 'paid') {
        return paymentInfo.isConfirmed;
      }
      
      if (statusFilter === 'pending') {
        const balance = (paymentInfo.salesValue + paymentInfo.amountDue) - paymentInfo.amountReceived;
        return !paymentInfo.isConfirmed && balance > 0;
      }

      return true;
    });

    return [...agentsByStatus].sort((a, b) => a.name.localeCompare(b.name));
  }, [agents, activeGroupId, statusFilter, activeWeek, weeklyData]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="relative text-center mb-8">
            <div className="flex items-center justify-center gap-3">
                <CurrencyDollarIcon className="w-10 h-10 text-cyan-400"/>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
                    Gerenciador de Cambistas BetsCeara99
                </h1>
            </div>
          <p className="text-gray-400 mt-2">Controle empréstimos e recebimentos com facilidade.</p>
          <button 
              onClick={onLogout} 
              className="absolute top-0 right-0 flex items-center gap-2 bg-red-800/50 hover:bg-red-700/60 text-red-300 font-semibold py-2 px-3 rounded-md transition-colors text-sm"
              title="Sair do sistema"
            >
              <LogoutIcon className="w-4 h-4" />
              <span>Sair</span>
            </button>
        </header>

        <main>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <AddGroupForm onAddGroup={handleAddGroup} />
            <AddAgentForm onAddAgent={handleAddAgent} groups={groups} />
          </div>
          
          <GroupTabs 
            groups={groups}
            activeGroupId={activeGroupId}
            setActiveGroupId={setActiveGroupId}
          />
          
          <AgentsMonthlyView
            agents={filteredAgents}
            weeklyData={weeklyData}
            onAddLoan={openTransactionModal}
            onAddReceipt={openTransactionModal}
            onAddSale={openTransactionModal}
            onConfirm={handleConfirmReceipt}
            onDeleteAgent={handleRequestDelete}
            onZeroOutAgent={handleRequestZeroOut}
            isFiltered={activeGroupId !== 'all' || statusFilter !== 'all'}
            activeWeek={activeWeek}
            setActiveWeek={setActiveWeek}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </main>
      </div>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTransactionSubmit}
        config={modalConfig}
      />
      <ConfirmationModal
        isOpen={!!agentToDelete}
        onClose={() => setAgentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        confirmButtonText="Confirmar Exclusão"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        <p>Você tem certeza que deseja excluir o cambista <span className="font-bold text-white">{agentToDelete?.name}</span>?</p>
        <p className="mt-2 text-sm text-gray-400">Esta ação não pode ser desfeita. Todos os dados de recebimentos e empréstimos associados a este cambista serão removidos permanentemente.</p>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={!!agentToZeroOut}
        onClose={() => setAgentToZeroOut(null)}
        onConfirm={handleConfirmZeroOut}
        title="Zerar Valores"
        confirmButtonText="Zerar Valores"
        confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
      >
        <p>Você tem certeza que deseja zerar todos os valores (vendas, empréstimos, recebidos) do cambista <span className="font-bold text-white">{agentToZeroOut?.agent.name}</span> para a <span className="font-bold text-white">Semana {agentToZeroOut?.week}</span>?</p>
        <p className="mt-2 text-sm text-gray-400">Esta ação irá resetar os valores para zero, mas não removerá o cambista.</p>
      </ConfirmationModal>
    </div>
  );
};

export default MainApp;