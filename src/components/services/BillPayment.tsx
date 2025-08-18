'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Wifi, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import type { ServiceType } from '../../types';

interface BillPaymentProps {
  type: ServiceType;
  walletBalance: number;
  onPayment: (amount: number, description: string, service: string) => boolean;
}

export function BillPayment({ type, walletBalance, onPayment }: BillPaymentProps) {
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ consumerNumber?: string; amount?: string }>({});

  const serviceConfig = {
    electricity: { icon: Zap, name: 'Electricity Bill', color: 'text-yellow-600' },
    water: { icon: Droplets, name: 'Water Bill', color: 'text-blue-600' },
    gas: { icon: Flame, name: 'Gas Bill', color: 'text-orange-600' },
    broadband: { icon: Wifi, name: 'Broadband Bill', color: 'text-indigo-600' },
  };

  const config = serviceConfig[type as keyof typeof serviceConfig];
  const Icon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { consumerNumber?: string; amount?: string } = {};

    if (!consumerNumber || consumerNumber.length < 8) {
      newErrors.consumerNumber = 'Please enter a valid consumer number';
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amountValue > walletBalance) {
      newErrors.amount = 'Insufficient balance';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsProcessing(true);
      
      setTimeout(() => {
        const success = onPayment(
          amountValue, 
          `${config.name} for ${consumerNumber}`,
          `${config.name} - ₹${amountValue}`
        );
        
        setIsProcessing(false);
        
        if (success) {
          setConsumerNumber('');
          setAmount('');
        }
      }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <span>{config.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Wallet Balance */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Available Balance</span>
              <Badge variant="secondary" className="font-semibold">
                ₹{walletBalance.toLocaleString()}
              </Badge>
            </div>
          </div>

          {/* Consumer Number */}
          <div className="grid gap-2">
            <Label htmlFor="consumerNumber">Consumer Number / Account ID</Label>
            <Input
              id="consumerNumber"
              type="text"
              placeholder="Enter your consumer number"
              value={consumerNumber}
              onChange={(e) => {
                setConsumerNumber(e.target.value);
                if (errors.consumerNumber) {
                  setErrors({ ...errors, consumerNumber: undefined });
                }
              }}
              className={errors.consumerNumber ? 'border-red-500' : ''}
            />
            {errors.consumerNumber && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.consumerNumber}</span>
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Bill Amount</Label>
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
                className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!consumerNumber || !amount || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${amount || '0'}`}
            {!isProcessing && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
