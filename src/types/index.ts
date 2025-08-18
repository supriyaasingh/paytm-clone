export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface Transaction {
  id: string;
  type: 'recharge' | 'bill_payment' | 'upi_transfer' | 'add_money';
  amount: number;
  description: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  recipient?: string;
  service?: string;
}

export interface WalletBalance {
  amount: number;
  lastUpdated: Date;
}

export type ServiceType = 'mobile' | 'dth' | 'electricity' | 'water' | 'gas' | 'broadband';
export type TicketType = 'bus' | 'train' | 'movie';

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  walletBalance: number;
  transactions: Transaction[];
  isDarkMode: boolean;
  currentView: 'dashboard' | 'wallet' | 'upi' | 'recharge' | 'bills' | 'tickets' | 'login';
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: Date;
  }>;
}
