'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthContainerProps {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (name: string, email: string, phone: string, password: string) => boolean;
}

export function AuthContainer({ onLogin, onSignup }: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {isLogin ? (
        <LoginForm
          onLogin={onLogin}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSignup={onSignup}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}
