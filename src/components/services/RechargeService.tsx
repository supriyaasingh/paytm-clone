'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Smartphone, 
  Tv, 
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import type { ServiceType } from '../../types';

interface RechargeServiceProps {
  type: 'mobile' | 'dth';
  walletBalance: number;
  onRecharge: (amount: number, description: string, service: string) => boolean;
}

export function RechargeService({ type, walletBalance, onRecharge }: RechargeServiceProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ phoneNumber?: string; amount?: string; operator?: string }>({});

  const operators = type === 'mobile' 
    ? ['Airtel', 'Jio', 'Vi (Vodafone Idea)', 'BSNL']
    : ['Tata Sky', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'];

  const plans = type === 'mobile' 
    ? [
        { amount: 199, validity: '28 days', data: '2GB/day', description: 'Unlimited calls + SMS' },
        { amount: 349, validity: '28 days', data: '3GB/day', description: 'Unlimited calls + SMS' },
        { amount: 599, validity: '84 days', data: '2GB/day', description: 'Unlimited calls + SMS' },
        { amount: 999, validity: '84 days', data: '3GB/day', description: 'Unlimited calls + SMS' },
      ]
    : [
        { amount: 299, validity: '30 days', channels: '200+', description: 'Basic HD Pack' },
        { amount: 449, validity: '30 days', channels: '350+', description: 'Premium HD Pack' },
        { amount: 699, validity: '30 days', channels: '500+', description: 'Super Premium Pack' },
        { amount: 999, validity: '30 days', channels: '600+', description: 'Ultimate Pack' },
      ];

  const validatePhoneNumber = (number: string) => {
    return /^[6-9]\d{9}$/.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { phoneNumber?: string; amount?: string; operator?: string } = {};

    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!operator) {
      newErrors.operator = 'Please select an operator';
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
        const success = onRecharge(
          amountValue, 
          `${type === 'mobile' ? 'Mobile' : 'DTH'} recharge for ${phoneNumber}`,
          `${operator} - ₹${amountValue}`
        );
        
        setIsProcessing(false);
        
        if (success) {
          setPhoneNumber('');
          setOperator('');
          setAmount('');
        }
      }, 2000);
    }
  };

  const title = type === 'mobile' ? 'Mobile Recharge' : 'DTH Recharge';
  const Icon = type === 'mobile' ? Smartphone : Tv;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
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

          {/* Phone/Customer ID */}
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">
              {type === 'mobile' ? 'Mobile Number' : 'Customer ID / Card Number'}
            </Label>
            <Input
              id="phoneNumber"
              type="text"
              placeholder={type === 'mobile' ? '9876543210' : '1234567890123'}
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber) {
                  setErrors({ ...errors, phoneNumber: undefined });
                }
              }}
              className={errors.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.phoneNumber}</span>
              </p>
            )}
          </div>

          {/* Operator Selection */}
          <div className="space-y-3">
            <Label>Select Operator</Label>
            <div className="grid grid-cols-2 gap-2">
              {operators.map((op) => (
                <Button
                  key={op}
                  type="button"
                  variant={operator === op ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setOperator(op);
                    if (errors.operator) {
                      setErrors({ ...errors, operator: undefined });
                    }
                  }}
                  className="text-sm"
                >
                  {op}
                </Button>
              ))}
            </div>
            {errors.operator && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.operator}</span>
              </p>
            )}
          </div>

          {/* Popular Plans */}
          <div className="space-y-3">
            <Label>Popular Plans</Label>
            <div className="space-y-2">
              {plans.map((plan) => (
                <Card
                  key={plan.amount}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    amount === plan.amount.toString() ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setAmount(plan.amount.toString())}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">₹{plan.amount}</div>
                        <div className="text-sm text-gray-600">{plan.description}</div>
                        <div className="text-xs text-gray-500">
                          Validity: {plan.validity}
                          {type === 'mobile' ? ` • ${(plan as any).data}` : ` • ${(plan as any).channels} channels`}
                        </div>
                      </div>
                      {amount === plan.amount.toString() && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Or Enter Custom Amount</Label>
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
                min="10"
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
            disabled={!phoneNumber || !operator || !amount || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Recharge ₹${amount || '0'}`}
            {!isProcessing && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
