import React from 'react';
import { Activity, TrendingUp, Users, Clock } from 'lucide-react';
import { Member } from '../../types';

interface HealthMetricsOverviewProps {
  members: Member[];
}

const HealthMetricsOverview: React.FC<HealthMetricsOverviewProps> = ({ members }) => {
  const totalMetrics = members.reduce((acc, member) => 
    acc + (member.insights?.totalHealthMetrics || 0), 0);
  
  const membersWithMetrics = members.filter(member => 
    (member.insights?.totalHealthMetrics || 0) > 0).length;
  
  const avgMetricsPerMember = membersWithMetrics > 0 ? totalMetrics / membersWithMetrics : 0;

  const recentlyActive = members.filter(member => {
    const lastActive = new Date(member.lastActive);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return lastActive > sevenDaysAgo;
  }).length;

  const stats = [
    {
      label: 'Total Health Metrics',
      value: totalMetrics.toLocaleString(),
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      label: 'Avg Metrics/Member',
      value: avgMetricsPerMember.toFixed(1),
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50'
    },
    {
      label: 'Active Trackers',
      value: membersWithMetrics.toString(),
      icon: <Users className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50'
    },
    {
      label: 'Recent Activity',
      value: recentlyActive.toString(),
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      color: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index} className={`p-4 rounded-lg ${stat.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
            <div className="p-2 bg-white rounded-lg">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthMetricsOverview;
