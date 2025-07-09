import React from 'react';
import { useAccounting } from '../hooks/useAccounting';
import { TrendingUp, TrendingDown, Target, DollarSign, Users, Clock, Percent } from 'lucide-react';

const KPIs: React.FC = () => {
  const { kpis } = useAccounting();

  const getKPIIcon = (category: string) => {
    switch (category) {
      case 'Revenue': return DollarSign;
      case 'Profitability': return Percent;
      case 'Liquidity': return TrendingUp;
      case 'Efficiency': return Clock;
      default: return Target;
    }
  };

  const getKPIColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Target;
    }
  };

  const getPerformanceColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformancePercentage = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Key Performance Indicators</h1>
        <div className="text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = getKPIIcon(kpi.category);
          const TrendIcon = getTrendIcon(kpi.trend);
          const trendColor = getKPIColor(kpi.trend);
          const performancePercentage = getPerformancePercentage(kpi.value, kpi.target);
          const performanceColor = getPerformanceColor(kpi.value, kpi.target);

          return (
            <div key={kpi.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className={`flex items-center ${trendColor}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">{kpi.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-white">
                    {kpi.unit === '$' ? '$' : ''}{kpi.value.toLocaleString()}
                    {kpi.unit !== '$' ? kpi.unit : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Target: {kpi.unit === '$' ? '$' : ''}{kpi.target.toLocaleString()}
                  {kpi.unit !== '$' ? kpi.unit : ''}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{performancePercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${performanceColor}`}
                    style={{ width: `${performancePercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Category: {kpi.category}
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Summary */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">KPI Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {kpis.filter(kpi => kpi.value >= kpi.target).length}
            </div>
            <div className="text-gray-400">KPIs Meeting Target</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {kpis.filter(kpi => kpi.trend === 'up').length}
            </div>
            <div className="text-gray-400">KPIs Trending Up</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {kpis.filter(kpi => kpi.value < kpi.target).length}
            </div>
            <div className="text-gray-400">KPIs Below Target</div>
          </div>
        </div>
      </div>

      {/* Detailed KPI Analysis */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Detailed Analysis</h3>
        <div className="space-y-4">
          {kpis.map((kpi) => {
            const isOnTarget = kpi.value >= kpi.target;
            const variance = ((kpi.value - kpi.target) / kpi.target) * 100;
            
            return (
              <div key={kpi.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{kpi.name}</h4>
                    <div className={`text-sm ${isOnTarget ? 'text-green-400' : 'text-red-400'}`}>
                      {isOnTarget ? 'On Target' : 'Below Target'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Current: {kpi.unit === '$' ? '$' : ''}{kpi.value.toLocaleString()}{kpi.unit !== '$' ? kpi.unit : ''} | 
                    Target: {kpi.unit === '$' ? '$' : ''}{kpi.target.toLocaleString()}{kpi.unit !== '$' ? kpi.unit : ''} | 
                    Variance: {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                  </div>
                </div>
                <div className={`text-2xl font-bold ${getKPIColor(kpi.trend)}`}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KPIs;