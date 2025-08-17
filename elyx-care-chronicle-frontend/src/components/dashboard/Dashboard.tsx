import React from 'react';
import { Users, Activity, MessageSquare, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useAnalytics, useMembers } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import AlertsPanel from './AlertsPanel';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { data: analytics, loading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useAnalytics();
  const { data: membersData, loading: membersLoading, error: membersError } = useMembers();

  if (analyticsLoading || membersLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  if (analyticsError || membersError) {
    return <ErrorMessage message={analyticsError || membersError || ''} retry={refetchAnalytics} />;
  }

  const stats = (analytics as any)?.summary;
  const alerts = (analytics as any)?.alerts;
  const recentActivity = (analytics as any)?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Healthcare Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your healthcare platform's key metrics and member engagement</p>
      </div>

      {/* Quick Access Button */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h2>🏥 Elyx Care Chronicle</h2>
        <p>Manage your healthcare data efficiently</p>
        <Link 
          to="/data-management" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          📊 Open Data Management Dashboard
        </Link>
      </div>

      {/* Stats Grid */}
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
          title="Health Metrics"
          value={stats?.totalHealthMetrics?.toLocaleString() || '0'}
          icon={<Activity className="w-6 h-6" />}
          color="green"
          change="+8%"
          changeType="increase"
        />
        <StatsCard
          title="Active Conversations"
          value={stats?.totalConversations?.toLocaleString() || '0'}
          icon={<MessageSquare className="w-6 h-6" />}
          color="purple"
          change="+15%"
          changeType="increase"
        />
        <StatsCard
          title="Retention Rate"
          value={`${stats?.memberRetentionRate || '0'}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
          change="+3%"
          changeType="increase"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivity} />
        </div>

        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      {/* Active Members Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Member Engagement Overview</h3>
          <Clock className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats?.activeMembers || 0}</div>
            <div className="text-sm text-green-700">Active Members</div>
            <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{alerts?.highRiskMembers || 0}</div>
            <div className="text-sm text-yellow-700">High Risk</div>
            <div className="text-xs text-gray-500 mt-1">Need attention</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{alerts?.inactiveMembers || 0}</div>
            <div className="text-sm text-red-700">Inactive</div>
            <div className="text-xs text-gray-500 mt-1">Over 7 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
