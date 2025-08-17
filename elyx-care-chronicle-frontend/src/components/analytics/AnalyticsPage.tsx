import React from 'react';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { useAnalytics, useMembers } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatsCard from '../dashboard/StatsCard';
import MemberEngagementChart from './MemberEngagementChart';
import HealthMetricsOverview from './HealthMetricsOverview';

const AnalyticsPage: React.FC = () => {
  const { data: analytics, loading: analyticsLoading, error: analyticsError, refetch } = useAnalytics();
  const { data: membersData, loading: membersLoading, error: membersError } = useMembers();

  if (analyticsLoading || membersLoading) {
    return <LoadingSpinner size="lg" text="Loading analytics..." />;
  }

  if (analyticsError || membersError) {
    return <ErrorMessage message={analyticsError || membersError || ''} retry={refetch} />;
  }

  const stats = (analytics as any)?.summary;
  const members = (membersData as any)?.data || [];

  // Calculate additional analytics
  const avgAdherence = members.length > 0 
    ? members.reduce((acc: number, member: any) => acc + member.planAdherence, 0) / members.length 
    : 0;

  const highEngagementMembers = members.filter((m: any) => 
    m.engagementLevel === 'high' || m.engagementLevel === 'very_high'
  ).length;

  const engagementDistribution = {
    high: members.filter((m: any) => m.engagementLevel === 'high' || m.engagementLevel === 'very_high').length,
    medium: members.filter((m: any) => m.engagementLevel === 'medium').length,
    low: members.filter((m: any) => m.engagementLevel === 'low' || m.engagementLevel === 'very_low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Healthcare Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive insights into your healthcare platform performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={stats?.totalMembers?.toLocaleString() || '0'}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          change="+12%"
          changeType="increase"
        />
        <StatsCard
          title="Avg Plan Adherence"
          value={`${avgAdherence.toFixed(1)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          change="+5%"
          changeType="increase"
        />
        <StatsCard
          title="Active Episodes"
          value={stats?.totalEpisodes?.toString() || '0'}
          icon={<Activity className="w-6 h-6" />}
          color="orange"
          change="+8%"
          changeType="increase"
        />
        <StatsCard
          title="High Engagement"
          value={highEngagementMembers.toString()}
          icon={<BarChart3 className="w-6 h-6" />}
          color="purple"
          change="+15%"
          changeType="increase"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Engagement Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Member Engagement Distribution
          </h3>
          <MemberEngagementChart data={engagementDistribution} />
        </div>

        {/* Health Metrics Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Health Metrics Overview
          </h3>
          <HealthMetricsOverview members={members} />
        </div>
      </div>

      {/* Detailed Member Analytics Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Member Performance Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Member</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Adherence</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Engagement</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Risk Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Metrics</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Episodes</th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 10).map((member: any) => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-healthcare-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-healthcare-600 font-semibold text-sm">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-healthcare-600 h-2 rounded-full" 
                          style={{ width: `${member.planAdherence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {member.planAdherence}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      member.engagementLevel === 'high' || member.engagementLevel === 'very_high' 
                        ? 'bg-green-100 text-green-800'
                        : member.engagementLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.engagementLevel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.insights?.riskLevel === 'low' 
                        ? 'bg-green-100 text-green-800'
                        : member.insights?.riskLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.insights?.riskLevel || 'unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {member.insights?.totalHealthMetrics || 0}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {member.insights?.activeEpisodes || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Platform Health</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="text-sm font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Accuracy</span>
              <span className="text-sm font-semibold text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-semibold text-green-600">&lt; 200ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Member Satisfaction</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satisfaction Score</span>
              <span className="text-sm font-semibold text-green-600">4.8/5.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <span className="text-sm font-semibold text-green-600">{stats?.memberRetentionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">NPS Score</span>
              <span className="text-sm font-semibold text-green-600">72</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Growth Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Members (30d)</span>
              <span className="text-sm font-semibold text-blue-600">+24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Churn Rate</span>
              <span className="text-sm font-semibold text-green-600">2.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="text-sm font-semibold text-green-600">+12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
