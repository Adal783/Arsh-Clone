import React, { useState } from 'react';
import { useAccounting } from '../hooks/useAccounting';
import { FileText, Download, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const { 
    accounts, 
    getTotalAssets, 
    getTotalLiabilities, 
    getTotalEquity, 
    getTotalRevenue, 
    getTotalExpenses, 
    getNetIncome 
  } = useAccounting();
  
  const [selectedReport, setSelectedReport] = useState('balance-sheet');
  const [reportPeriod, setReportPeriod] = useState('current');

  const reports = [
    {
      id: 'balance-sheet',
      name: 'Balance Sheet',
      description: 'Statement of Financial Position (IFRS compliant)',
      icon: FileText
    },
    {
      id: 'income-statement',
      name: 'Income Statement',
      description: 'Statement of Comprehensive Income (IFRS compliant)',
      icon: FileText
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Statement of Cash Flows (IFRS compliant)',
      icon: FileText
    },
    {
      id: 'trial-balance',
      name: 'Trial Balance',
      description: 'Detailed account balances verification',
      icon: FileText
    }
  ];

  const renderBalanceSheet = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Balance Sheet</h2>
        <p className="text-gray-400">As of {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mt-1">IFRS Compliant</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
            ASSETS
          </h3>
          <div className="space-y-3">
            <div className="text-blue-400 font-medium">Current Assets</div>
            {accounts.filter(acc => acc.type === 'Asset' && acc.category === 'Current Assets').map(account => (
              <div key={account.id} className="flex justify-between pl-4">
                <span className="text-gray-300">{account.name}</span>
                <span className="text-white">${account.balance.toLocaleString()}</span>
              </div>
            ))}
            
            <div className="text-blue-400 font-medium mt-6">Non-Current Assets</div>
            {accounts.filter(acc => acc.type === 'Asset' && acc.category === 'Fixed Assets').map(account => (
              <div key={account.id} className="flex justify-between pl-4">
                <span className="text-gray-300">{account.name}</span>
                <span className="text-white">${account.balance.toLocaleString()}</span>
              </div>
            ))}
            
            <div className="border-t border-gray-600 pt-2 mt-4">
              <div className="flex justify-between font-bold">
                <span className="text-white">Total Assets</span>
                <span className="text-green-400">${getTotalAssets().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Liabilities and Equity */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
            LIABILITIES AND EQUITY
          </h3>
          <div className="space-y-3">
            <div className="text-red-400 font-medium">Current Liabilities</div>
            {accounts.filter(acc => acc.type === 'Liability' && acc.category === 'Current Liabilities').map(account => (
              <div key={account.id} className="flex justify-between pl-4">
                <span className="text-gray-300">{account.name}</span>
                <span className="text-white">${account.balance.toLocaleString()}</span>
              </div>
            ))}
            
            <div className="text-blue-400 font-medium mt-6">Equity</div>
            {accounts.filter(acc => acc.type === 'Equity').map(account => (
              <div key={account.id} className="flex justify-between pl-4">
                <span className="text-gray-300">{account.name}</span>
                <span className="text-white">${account.balance.toLocaleString()}</span>
              </div>
            ))}
            
            <div className="border-t border-gray-600 pt-2 mt-4">
              <div className="flex justify-between font-bold">
                <span className="text-white">Total Liabilities and Equity</span>
                <span className="text-green-400">${(getTotalLiabilities() + getTotalEquity()).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomeStatement = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Income Statement</h2>
        <p className="text-gray-400">For the period ending {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mt-1">IFRS Compliant</p>
      </div>
      
      <div className="space-y-4">
        <div className="text-green-400 font-medium">Revenue</div>
        {accounts.filter(acc => acc.type === 'Revenue').map(account => (
          <div key={account.id} className="flex justify-between pl-4">
            <span className="text-gray-300">{account.name}</span>
            <span className="text-white">${account.balance.toLocaleString()}</span>
          </div>
        ))}
        
        <div className="border-t border-gray-600 pt-2">
          <div className="flex justify-between font-semibold">
            <span className="text-white">Total Revenue</span>
            <span className="text-green-400">${getTotalRevenue().toLocaleString()}</span>
          </div>
        </div>
        
        <div className="text-orange-400 font-medium mt-6">Expenses</div>
        {accounts.filter(acc => acc.type === 'Expense').map(account => (
          <div key={account.id} className="flex justify-between pl-4">
            <span className="text-gray-300">{account.name}</span>
            <span className="text-white">${account.balance.toLocaleString()}</span>
          </div>
        ))}
        
        <div className="border-t border-gray-600 pt-2">
          <div className="flex justify-between font-semibold">
            <span className="text-white">Total Expenses</span>
            <span className="text-red-400">${getTotalExpenses().toLocaleString()}</span>
          </div>
        </div>
        
        <div className="border-t-2 border-gray-600 pt-4 mt-6">
          <div className="flex justify-between font-bold text-lg">
            <span className="text-white">Net Income</span>
            <span className={getNetIncome() >= 0 ? 'text-green-400' : 'text-red-400'}>
              ${getNetIncome().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrialBalance = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Trial Balance</h2>
        <p className="text-gray-400">As of {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-white">Account Code</th>
              <th className="px-4 py-2 text-left text-white">Account Name</th>
              <th className="px-4 py-2 text-left text-white">Type</th>
              <th className="px-4 py-2 text-right text-white">Debit</th>
              <th className="px-4 py-2 text-right text-white">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {accounts.map(account => (
              <tr key={account.id}>
                <td className="px-4 py-2 text-gray-300">{account.code}</td>
                <td className="px-4 py-2 text-gray-300">{account.name}</td>
                <td className="px-4 py-2 text-gray-400">{account.type}</td>
                <td className="px-4 py-2 text-right text-white">
                  {['Asset', 'Expense'].includes(account.type) ? `$${account.balance.toLocaleString()}` : '-'}
                </td>
                <td className="px-4 py-2 text-right text-white">
                  {['Liability', 'Equity', 'Revenue'].includes(account.type) ? `$${account.balance.toLocaleString()}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Cash Flow Statement</h2>
        <p className="text-gray-400">For the period ending {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mt-1">IFRS Compliant</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Operating Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Net Income</span>
              <span className="text-white">${getNetIncome().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Depreciation</span>
              <span className="text-white">$15,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Changes in Working Capital</span>
              <span className="text-white">($5,000)</span>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Net Cash from Operating Activities</span>
                <span className="text-green-400">${(getNetIncome() + 10000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Investing Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Purchase of Equipment</span>
              <span className="text-white">($25,000)</span>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Net Cash from Investing Activities</span>
                <span className="text-red-400">($25,000)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Financing Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Owner's Investment</span>
              <span className="text-white">$50,000</span>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Net Cash from Financing Activities</span>
                <span className="text-green-400">$50,000</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-gray-600 pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span className="text-white">Net Increase in Cash</span>
            <span className="text-green-400">$100,000</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'balance-sheet':
        return renderBalanceSheet();
      case 'income-statement':
        return renderIncomeStatement();
      case 'cash-flow':
        return renderCashFlow();
      case 'trial-balance':
        return renderTrialBalance();
      default:
        return renderBalanceSheet();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">IFRS Financial Reports</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Download className="w-5 h-5 mr-2" />
          Export PDF
        </button>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border transition-colors text-left ${
                selectedReport === report.id
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">{report.name}</h3>
              <p className="text-sm opacity-75">{report.description}</p>
            </button>
          );
        })}
      </div>

      {/* Period Selection */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-300">Period:</span>
        </div>
        <select
          value={reportPeriod}
          onChange={(e) => setReportPeriod(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="current">Current Period</option>
          <option value="previous">Previous Period</option>
          <option value="ytd">Year to Date</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Report Content */}
      {renderReport()}
    </div>
  );
};

export default Reports;