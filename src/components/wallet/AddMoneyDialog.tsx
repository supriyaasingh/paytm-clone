'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { CreditCard, Wallet, Smartphone, CheckCircle } from 'lucide-react';

interface AddMoneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMoney: (amount: number) => void;
}

const quickAmounts = [100, 500, 1000, 2000, 5000];

export function AddMoneyDialog({ isOpen, onClose, onAddMoney }: AddMoneyDialogProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddMoney = async () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onAddMoney(amountValue);
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setShowSuccess(false);
        setAmount('');
        onClose();
      }, 2000);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'card', icon: CreditCard, label: 'Debit/Credit Card' },
    { id: 'upi', icon: Smartphone, label: 'UPI' },
    { id: 'netbanking', icon: Wallet, label: 'Net Banking' },
  ];

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* <DialogContent className="sm:max-w-md"> */}
        <DialogContent className="sm:max-w-md bg-white text-black shadow-xl rounded-xl">

          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Money Added Successfully!
            </h3>
            <p className="text-gray-600">
              ₹{amount} has been added to your wallet
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogContent className="sm:max-w-lg"> */}
      <DialogContent className="sm:max-w-lg bg-white text-black shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
          <DialogDescription>
            Add money to your Paytm wallet for quick and easy payments
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount">Enter Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg"
                min="1"
                max="50000"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Add</Label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-sm"
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-colors ${
                    selectedMethod === method.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <method.icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{method.label}</span>
                      {selectedMethod === method.id && (
                        <CheckCircle className="h-4 w-4 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddMoney}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Add ₹${amount || '0'}`}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            * This is a demo. No real money will be charged.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
