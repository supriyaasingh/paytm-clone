'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Smartphone, 
  Users, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Scan
} from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';

interface UpiPaymentProps {
  walletBalance: number;
  onPayment: (amount: number, recipient: string, description: string) => boolean;
}

export function UpiPayment({ walletBalance, onPayment }: UpiPaymentProps) {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ upiId?: string; amount?: string }>({});

  const validateUpiId = (id: string) => {
    const upiRegex = /^[\w\.-]+@[\w\.-]+$/;
    return upiRegex.test(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { upiId?: string; amount?: string } = {};

    if (!validateUpiId(upiId)) {
      newErrors.upiId = 'Please enter a valid UPI ID';
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amountValue > walletBalance) {
      newErrors.amount = 'Insufficient balance';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const success = onPayment(
        parseFloat(amount), 
        upiId, 
        description || `UPI payment to ${upiId}`
      );
      
      setIsProcessing(false);
      setIsConfirmOpen(false);
      
      if (success) {
        // Reset form
        setUpiId('');
        setAmount('');
        setDescription('');
      }
    }, 2000);
  };

  const quickAmounts = [100, 200, 500, 1000];
  const recentContacts = [
    { id: 'john@paytm', name: 'John Doe' },
    { id: 'jane@gpay', name: 'Jane Smith' },
    { id: 'mike@phonepe', name: 'Mike Johnson' },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <span>UPI Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wallet Balance Display */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Balance</span>
                <Badge variant="secondary" className="font-semibold">
                  ₹{walletBalance.toLocaleString()}
                </Badge>
              </div>
            </div>

            {/* UPI ID Input */}
            <div className="space-y-3">
              <Label htmlFor="upiId">Enter UPI ID or Phone Number</Label>
              <Input
                id="upiId"
                type="text"
                placeholder="example@paytm or 9876543210"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (errors.upiId) {
                    setErrors({ ...errors, upiId: undefined });
                  }
                }}
                className={errors.upiId ? 'border-red-500' : ''}
              />
              {errors.upiId && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.upiId}</span>
                </p>
              )}
            </div>

            {/* Recent Contacts */}
            <div className="space-y-2">
              <Label>Recent Contacts</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {recentContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUpiId(contact.id)}
                    className="justify-start text-sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-gray-500">{contact.id}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

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
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) {
                      setErrors({ ...errors, amount: undefined });
                    }
                  }}
                  className={`pl-8 text-lg ${errors.amount ? 'border-red-500' : ''}`}
                  min="1"
                  max={walletBalance}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.amount}</span>
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <Label>Quick Amount</Label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    disabled={quickAmount > walletBalance}
                    className="text-sm"
                  >
                    ₹{quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Description (Optional) */}
            <div className="grid gap-2">
              <Label htmlFor="description">Add Note (Optional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="Payment for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!upiId || !amount || isProcessing}
              >
                Pay Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        amount={parseFloat(amount) || 0}
        recipient={upiId}
        description={description || `UPI payment to ${upiId}`}
        isProcessing={isProcessing}
      />
    </>
  );
}
