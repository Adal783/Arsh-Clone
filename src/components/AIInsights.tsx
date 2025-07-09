import React, { useState } from 'react';
import { useAccounting } from '../hooks/useAccounting';
import { Brain, AlertTriangle, TrendingUp, Lightbulb, Star, Clock } from 'lucide-react';

const AIInsights: React.FC = () => {
  const { aiInsights } = useAccounting();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cash Management', 'Collections', 'Cost Control', 'Revenue Optimization'];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'recommendation': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'opportunity': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'recommendation': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const filteredInsights = aiInsights.filter(insight => 
    selectedCategory === 'All' || insight.category === selectedCategory
  );

  const priorityStats = {
    high: aiInsights.filter(insight => insight.priority === 'high').length,
    medium: aiInsights.filter(insight => insight.priority === 'medium').length,
    low: aiInsights.filter(insight => insight.priority === 'low').length
  };

  const typeStats = {
    warning: aiInsights.filter(insight => insight.type === 'warning').length,
    opportunity: aiInsights.filter(insight => insight.type === 'opportunity').length,
    recommendation: aiInsights.filter(insight => insight.type === 'recommendation').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-blue-400 mr-3" />
          <h1 className="text-3xl font-bold text-white">AI Financial Insights</h1>
        </div>
        <div className="text-gray-400">
          Last analysis: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-red-400">{priorityStats.high}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Medium Priority</p>
              <p className="text-2xl font-bold text-yellow-400">{priorityStats.medium}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Warnings</p>
              <p className="text-2xl font-bold text-red-400">{typeStats.warning}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Opportunities</p>
              <p className="text-2xl font-bold text-green-400">{typeStats.opportunity}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Recommendations</p>
              <p className="text-2xl font-bold text-blue-400">{typeStats.recommendation}</p>
            </div>
            <Lightbulb className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Insights</p>
              <p className="text-2xl font-bold text-white">{aiInsights.length}</p>
            </div>
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          const colorClasses = getInsightColor(insight.type);
          const priorityColor = getPriorityColor(insight.priority);

          return (
            <div
              key={insight.id}
              className={`rounded-lg p-6 border ${colorClasses.split(' ')[2]} ${colorClasses.split(' ')[1]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${colorClasses.split(' ')[1]} mr-3`}>
                    <Icon className={`w-5 h-5 ${colorClasses.split(' ')[0]}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                    <p className="text-sm text-gray-400">{insight.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded text-white ${priorityColor}`}>
                    {insight.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {insight.created.toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    Type: {insight.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    Priority: {insight.priority}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                    Act on This
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Analysis Summary */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          AI Analysis Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Key Findings</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Cash flow is healthy and above industry average
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Accounts receivable collection could be improved
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Revenue growth is trending positively
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Recommendations</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Implement automated invoice reminders
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Consider short-term investment opportunities
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Review and optimize expense categories
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;