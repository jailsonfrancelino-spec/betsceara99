export interface Group {
  id: string;
  name: string;
}

export interface Agent {
  id: string;
  name: string;
  groupIds: string[];
}

export interface PaymentInfo {
  amountDue: number;
  amountReceived: number;
  salesValue: number;
  isConfirmed: boolean;
}

export type TransactionType = 'loan' | 'receipt' | 'sale';

export interface ModalConfig {
  agent: Agent;
  week: number;
  type: TransactionType;
}