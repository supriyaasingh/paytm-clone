'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  Zap, 
  Wallet,
  Users,
  MoreHorizontal 
} from 'lucide-react';
import type  { Transaction } from '../../types/index';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'recharge':
        return Smartphone;
      case 'bill_payment':
        return Zap;
      case 'upi_transfer':
        return Users;
      case 'add_money':
        return Wallet;
      default:
        return ArrowUpRight;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'add_money':
        return 'text-green-600';
      case 'upi_transfer':
        return 'text-blue-600';
      default:
        return 'text-red-600';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Start making payments to see your transaction history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentTransactions = transactions.slice(0, 10);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Recent Transactions</CardTitle>
        <Button type="button" variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.type);
            const isCredit = transaction.type === 'add_money';
            
            return (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100 ${getTransactionColor(transaction.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                      <Badge 
                        variant={transaction.status === 'success' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </p>
                  {transaction.recipient && (
                    <p className="text-xs text-gray-500">{transaction.recipient}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {transactions.length > 10 && (
          <div className="mt-4 text-center">
            <Button type="button" variant="ghost" size="sm" className="text-blue-600">
              View All Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
