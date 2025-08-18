import { useState } from 'react';
import type { AppState, User, Transaction } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './use-toast';

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  walletBalance: 0,
  transactions: [],
  isDarkMode: false,
  currentView: 'dashboard',
  notifications: [],
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [walletBalance, setWalletBalance] = useLocalStorage('paytm_wallet_balance', 0);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('paytm_transactions', []);
  const [user, setUser] = useLocalStorage<User | null>('paytm_user', null);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('paytm_dark_mode', false);
  const { toast } = useToast();

  const login = (email: string, password: string) => {
    // Simple demo authentication
    if (email === 'demo@paytm.com' && password === 'demo123') {
      const newUser: User = {
        id: '1',
        email,
        name: 'Demo User',
        phone: '+91 9876543210'
      };
      setUser(newUser);
      setState(prev => ({ 
        ...prev, 
        user: newUser, 
        isAuthenticated: true,
        walletBalance,
        transactions,
        isDarkMode
      }));
      toast({
        title: "Login Successful",
        description: "Welcome back to Paytm!",
      });
      return true;
    }
    toast({
      title: "Login Failed",
      description: "Invalid credentials. Use demo@paytm.com / demo123",
      variant: "destructive",
    });
    return false;
  };

  const signup = (name: string, email: string, phone: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      phone
    };
    setUser(newUser);
    setState(prev => ({ 
      ...prev, 
      user: newUser, 
      isAuthenticated: true,
      walletBalance: 100, // Welcome bonus
      transactions: [],
      isDarkMode
    }));
    setWalletBalance(100);
    toast({
      title: "Account Created",
      description: "Welcome to Paytm! You received ₹100 welcome bonus.",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setState(initialState);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const addMoney = (amount: number) => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'add_money',
      amount,
      description: `Money added to wallet`,
      status: 'success',
      timestamp: new Date(),
    };
    
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);
    
    setState(prev => ({
      ...prev,
      walletBalance: newBalance,
      transactions: newTransactions
    }));

    toast({
      title: "Money Added",
      description: `₹${amount} added to your wallet successfully.`,
    });
  };

  const makeTransaction = (
    type: Transaction['type'],
    amount: number,
    description: string,
    recipient?: string,
    service?: string
  ): boolean => {
    if (walletBalance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add money to your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      description,
      status: 'success',
      timestamp: new Date(),
      recipient,
      service,
    };
    
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);
    
    setState(prev => ({
      ...prev,
      walletBalance: newBalance,
      transactions: newTransactions
    }));

    toast({
      title: "Transaction Successful",
      description: `₹${amount} ${type.replace('_', ' ')} completed successfully.`,
    });
    
    return true;
  };

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  //   setState(prev => ({ ...prev, isDarkMode: !isDarkMode }));
  // };
const toggleDarkMode = () => {
  setIsDarkMode(prev => {
    const newValue = !prev;
    setState(s => ({ ...s, isDarkMode: newValue }));
    return newValue;
  });
};



  const setCurrentView = (view: AppState['currentView']) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  // Initialize state from localStorage
  useState(() => {
    if (user) {
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        walletBalance,
        transactions,
        isDarkMode
      }));
    }
  });

  return {
    ...state,
    walletBalance,
    transactions,
    isDarkMode,
    login,
    signup,
    logout,
    addMoney,
    makeTransaction,
    toggleDarkMode,
    setCurrentView,
  };
}
