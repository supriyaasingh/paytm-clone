'use client';

import { useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { AuthContainer } from './components/auth/AuthContainer';
import { Navbar } from './components/navigation/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { UpiPayment } from './components/payments/UpiPayment';
import { RechargeService } from './components/services/RechargeService';
import { BillPayment } from './components/services/BillPayment';
import { TicketBooking } from './components/services/TicketBooking';
import { Toaster } from './components/ui/toaster';
import './App.css';
function App() {
  const {
    user,
    isAuthenticated,
    walletBalance,
    transactions,
    isDarkMode,
    currentView,
    login,
    signup,
    logout,
    addMoney,
    makeTransaction,
    toggleDarkMode,
    setCurrentView,
  } = useAppState();

  // Apply dark mode to document
  useEffect(() => {
    console.log('Dark mode:', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle search functionality
  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('mobile') || lowerQuery.includes('recharge')) {
      setCurrentView('recharge');
    } else if (lowerQuery.includes('upi') || lowerQuery.includes('transfer') || lowerQuery.includes('send')) {
      setCurrentView('upi');
    } else if (lowerQuery.includes('bill') || lowerQuery.includes('electricity') || lowerQuery.includes('water')) {
      setCurrentView('bills');
    } else if (lowerQuery.includes('ticket') || lowerQuery.includes('bus') || lowerQuery.includes('train')) {
      setCurrentView('tickets');
    } else if (lowerQuery.includes('wallet')) {
      setCurrentView('wallet');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleServiceClick = (service: string) => {
    switch (service) {
      case 'mobile':
      case 'dth':
        setCurrentView('recharge');
        break;
      case 'electricity':
      case 'water':
      case 'gas':
      case 'broadband':
        setCurrentView('bills');
        break;
      case 'upi':
        setCurrentView('upi');
        break;
      case 'tickets':
        setCurrentView('tickets');
        break;
      default:
        setCurrentView('dashboard');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <AuthContainer onLogin={login} onSignup={signup} />
        <Toaster />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'upi':
        return (
          <UpiPayment
            walletBalance={walletBalance}
            onPayment={(amount, recipient, description) => 
              makeTransaction('upi_transfer', amount, description, recipient)
            }
          />
        );
      
      case 'recharge':
        return (
          <div className="space-y-6">
            <RechargeService
              type="mobile"
              walletBalance={walletBalance}
              onRecharge={(amount, description, service) => 
                makeTransaction('recharge', amount, description, undefined, service)
              }
            />
            <RechargeService
              type="dth"
              walletBalance={walletBalance}
              onRecharge={(amount, description, service) => 
                makeTransaction('recharge', amount, description, undefined, service)
              }
            />
          </div>
        );
      
      case 'bills':
        return (
          <div className="space-y-6">
            <BillPayment
              type="electricity"
              walletBalance={walletBalance}
              onPayment={(amount, description, service) => 
                makeTransaction('bill_payment', amount, description, undefined, service)
              }
            />
            <BillPayment
              type="water"
              walletBalance={walletBalance}
              onPayment={(amount, description, service) => 
                makeTransaction('bill_payment', amount, description, undefined, service)
              }
            />
            <BillPayment
              type="gas"
              walletBalance={walletBalance}
              onPayment={(amount, description, service) => 
                makeTransaction('bill_payment', amount, description, undefined, service)
              }
            />
            <BillPayment
              type="broadband"
              walletBalance={walletBalance}
              onPayment={(amount, description, service) => 
                makeTransaction('bill_payment', amount, description, undefined, service)
              }
            />
          </div>
        );
      
      case 'tickets':
        return <TicketBooking />;
      
      default:
        return (
          <Dashboard
            walletBalance={walletBalance}
            transactions={transactions}
            onAddMoney={addMoney}
            onServiceClick={handleServiceClick}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 `}>
      <Navbar
        user={user}
        walletBalance={walletBalance}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={logout}
        onSearch={handleSearch}
        onWalletClick={() => setCurrentView('dashboard')}
        notifications={0}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="hover:text-blue-600"
          >
            Dashboard
          </button>
          {currentView !== 'dashboard' && (
            <>
              <span>/</span>
              <span className="text-gray-900 dark:text-white capitalize">
                {currentView === 'upi' ? 'Send Money' : 
                 currentView === 'recharge' ? 'Recharge' :
                 currentView === 'bills' ? 'Bill Payment' :
                 currentView === 'tickets' ? 'Tickets' : currentView}
              </span>
            </>
          )}
        </div>

        {renderCurrentView()}
      </main>
      
      <Toaster />
    </div>
  );
}



export default App;
