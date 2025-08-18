'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  recipient: string;
  description: string;
  isProcessing: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  amount,
  recipient,
  description,
  isProcessing
}: ConfirmationDialogProps) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!isOpen || isProcessing) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onClose();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isProcessing, onClose]);

  useEffect(() => {
    if (isOpen && !isProcessing) {
      setCountdown(30);
    }
  }, [isOpen, isProcessing]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {isProcessing ? (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your transaction...</p>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-yellow-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Do not press back or refresh</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Confirm Payment</span>
              </DialogTitle>
              <DialogDescription>
                Please review the payment details carefully before confirming
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Payment Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">To</span>
                  <span className="font-medium">{recipient}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Description</span>
                  <span className="text-sm text-gray-700 text-right max-w-48 truncate">
                    {description}
                  </span>
                </div>
              </div>

              {/* Security Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Your payment is secured with bank-grade encryption</span>
              </div>

              {/* Auto-close Timer */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Auto-closing in {countdown}s</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Confirm & Pay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="text-xs text-center text-gray-500">
                * This is a demo transaction. No real money will be transferred.
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
