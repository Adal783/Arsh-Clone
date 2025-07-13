import React, { useState } from 'react';
import { useSupabase } from './hooks/useSupabase';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChartOfAccounts from './components/ChartOfAccounts';
import CRM from './components/CRM';
import Transactions from './components/Transactions';
import Invoices from './components/Invoices';
import Reports from './components/Reports';
import KPIs from './components/KPIs';
import AIInsights from './components/AIInsights';

function App() {
  const { user, loading } = useSupabase();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'accounts':
        return <ChartOfAccounts />;
      case 'customers':
        return <CRM />;
      case 'transactions':
        return <Transactions />;
      case 'invoices':
        return <Invoices />;
      case 'reports':
        return <Reports />;
      case 'kpis':
        return <KPIs />;
      case 'ai':
        return <AIInsights />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;