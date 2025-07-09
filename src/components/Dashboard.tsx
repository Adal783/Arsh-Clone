import React from 'react';
import { useAccounting } from '../hooks/useAccounting';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, AlertTriangle } from 'lucide-react';
import { monthlyRevenueData, expenseBreakdown } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { 
    getTotalAssets, 
    getTotalLiabilities, 
    getTotalEquity, 
    getTotalRevenue, 
    getTotalExpenses, 
    getNetIncome,
    customers,
    invoices,
    aiInsights
  } = useAccounting();

  const stats = [
    {
      title: 'Total Assets',
      value: `$${getTotalAssets().toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      title: 'Net Income',
      value: `$${getNetIncome().toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.status === 'Active').length,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Outstanding Invoices',
      value: invoices.filter(i => i.status === 'Sent').length,
      icon: FileText,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    }
  ];

  const highPriorityInsights = aiInsights.filter(insight => insight.priority === 'high');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Monthly Revenue</h3>
          <div className="space-y-4">
            {monthlyRevenueData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-700 h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${(data.revenue / 70000) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-white font-semibold w-20 text-right">
                  ${data.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            {expenseBreakdown.map((expense, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">{expense.category}</span>
                  <span className="text-white font-semibold">{expense.percentage}%</span>
                </div>
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  ${expense.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {highPriorityInsights.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            High Priority AI Insights
          </h3>
          <div className="space-y-3">
            {highPriorityInsights.map((insight) => (
              <div key={insight.id} className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{insight.description}</p>
                  </div>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                    {insight.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-gray-400">Assets</p>
            <p className="text-2xl font-bold text-green-400">${getTotalAssets().toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Liabilities</p>
            <p className="text-2xl font-bold text-red-400">${getTotalLiabilities().toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Equity</p>
            <p className="text-2xl font-bold text-blue-400">${getTotalEquity().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;