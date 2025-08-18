'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean;
  onSwitchToSignup: () => void;
}

export function LoginForm({ onLogin, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = onLogin(email, password);
    if (!success) {
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-blue-600">Welcome Back</CardTitle>
        <p className="text-center text-gray-600">Sign in to your Paytm account</p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="demo@paytm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="demo123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-blue-600"
              onClick={onSwitchToSignup}
            >
              Don't have an account? Sign up
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Demo credentials: demo@paytm.com / demo123
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
