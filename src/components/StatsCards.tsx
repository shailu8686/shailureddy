import React from 'react';
import { Users, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { UPIRecord } from '../types';

interface StatsCardsProps {
  records: UPIRecord[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ records }) => {
  const totalRecords = records.length;
  const safeRecords = records.filter(r => r.status === 'Safe').length;
  const riskRecords = records.filter(r => r.status === 'Risk').length;
  const averageScore = records.length > 0 
    ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length)
    : 0;

  const stats = [
    {
      title: 'Total Records',
      value: totalRecords,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Safe Users',
      value: safeRecords,
      icon: Shield,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Risk Users',
      value: riskRecords,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Average Score',
      value: averageScore,
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
