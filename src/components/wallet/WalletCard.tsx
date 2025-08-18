'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Wallet, Plus, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { AddMoneyDialog } from './AddMoneyDialog';

interface WalletCardProps {
  balance: number;
  onAddMoney: (amount: number) => void;
  isLoading?: boolean;
}

export function WalletCard({ balance, onAddMoney, isLoading }: WalletCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Paytm Wallet</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:bg-white/20"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Wallet className="h-6 w-6" />
                <span className="text-sm opacity-90">Available Balance</span>
              </div>
              <div className="text-3xl font-bold mt-2">
                {showBalance ? `₹${balance.toLocaleString()}` : '₹****'}
              </div>
            </div>
            <div className="text-right">
              <Button
                type="button"
                onClick={() => setIsAddMoneyOpen(true)}
                className="bg-white text-blue-600 hover:bg-gray-100 mb-2"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
              <div className="flex items-center text-sm opacity-90">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Cashback Available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddMoneyDialog
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        onAddMoney={onAddMoney}
      />
    </>
  );
}
