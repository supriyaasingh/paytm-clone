'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Wallet, 
  User, 
  Moon, 
  Sun, 
  LogOut, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import type { User as UserType } from '../../types';

interface NavbarProps {
  user: UserType | null;
  walletBalance: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onWalletClick: () => void;
  notifications: number;
}

export function Navbar({ 
  user, 
  walletBalance, 
  isDarkMode, 
  onToggleDarkMode, 
  onLogout, 
  onSearch,
  onWalletClick,
  notifications
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-blue-600">Paytm</span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search services, recharge, bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Dark Mode Toggle */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={onToggleDarkMode}
                  />
                  <Moon className="h-4 w-4" />
                </div>

                {/* Notifications */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* Wallet Balance */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onWalletClick}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>₹{walletBalance.toLocaleString()}</span>
                </Button>

                {/* User Menu */}
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Menu Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="sm:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </>
            ) : (
              <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && user && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Mobile Wallet */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onWalletClick}
                className="w-full justify-start space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Wallet: ₹{walletBalance.toLocaleString()}</span>
              </Button>

              {/* Mobile Dark Mode */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={onToggleDarkMode}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              {/* Mobile Logout */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="w-full justify-start space-x-2 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
