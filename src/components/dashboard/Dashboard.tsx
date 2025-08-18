'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { WalletCard } from '../wallet/WalletCard';
import { TransactionHistory } from '../wallet/TransactionHistory';
import { 
  Smartphone, 
  Tv, 
  Zap, 
  Droplets, 
  Flame, 
  Wifi, 
  CreditCard, 
  Bus, 
  Train, 
  Film,
  ArrowRight,
  TrendingUp,
  Users
} from 'lucide-react';
import type { ServiceType, TicketType, Transaction } from '../../types';

interface DashboardProps {
  walletBalance: number;
  transactions: Transaction[];
  onAddMoney: (amount: number) => void;
  onServiceClick: (service: ServiceType | 'upi' | 'tickets') => void;
}

export function Dashboard({ 
  walletBalance, 
  transactions, 
  onAddMoney, 
  onServiceClick 
}: DashboardProps) {
  const services = [
    { id: 'mobile', icon: Smartphone, name: 'Mobile Recharge', color: 'bg-green-100 text-green-600' },
    { id: 'dth', icon: Tv, name: 'DTH Recharge', color: 'bg-purple-100 text-purple-600' },
    { id: 'electricity', icon: Zap, name: 'Electricity', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'water', icon: Droplets, name: 'Water Bill', color: 'bg-blue-100 text-blue-600' },
    { id: 'gas', icon: Flame, name: 'Gas Bill', color: 'bg-orange-100 text-orange-600' },
    { id: 'broadband', icon: Wifi, name: 'Broadband', color: 'bg-indigo-100 text-indigo-600' },
  ];

  const quickActions = [
    { id: 'upi', icon: CreditCard, name: 'Send Money', description: 'UPI Payment' },
    { id: 'tickets', icon: Bus, name: 'Book Tickets', description: 'Bus, Train, Movie' },
  ];

  const stats = [
    {
      title: 'This Month Spent',
      value: `₹${transactions
        .filter(t => t.type !== 'add_money' && new Date(t.timestamp).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-red-600'
    },
    {
      title: 'Total Transactions',
      value: transactions.length.toString(),
      icon: Users,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Section */}
      <WalletCard 
        balance={walletBalance} 
        onAddMoney={onAddMoney}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                type="button"
                variant="outline"
                className="h-auto p-4 justify-start space-x-4"
                onClick={() => onServiceClick(action.id as 'upi' | 'tickets')}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <action.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.name}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Recharge & Bill Payments</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service) => (
              <Button
                key={service.id}
                type="button"
                variant="ghost"
                className="h-auto p-4 flex-col space-y-2 hover:bg-gray-50"
                onClick={() => onServiceClick(service.id as ServiceType)}
              >
                <div className={`p-3 rounded-lg ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">{service.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
