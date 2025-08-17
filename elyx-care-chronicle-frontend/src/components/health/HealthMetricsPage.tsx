import React, { useState } from 'react';
import { useMembers } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import HealthMetricCard from './HealthMetricCard';
import MetricFilters from './MetricFilters';

const HealthMetricsPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');

  const { data: membersData, loading, error, refetch } = useMembers();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load health metrics" retry={refetch} />;
  }

  const members = (membersData as any)?.data || [];
  
  // Aggregate all health metrics from all members
  const allMetrics = members.flatMap((member: any) => 
    (member.healthMetrics || []).map((metric: any) => ({
      ...metric,
      memberName: member.name,
      memberId: member.id
    }))
  );

  // Filter metrics based on selected filters
  const filteredMetrics = allMetrics.filter((metric: any) => {
    const matchesMember = selectedMember === 'all' || metric.memberId === selectedMember;
    const matchesMetric = selectedMetric === 'all' || metric.type === selectedMetric;
    
    // Filter by time range
    const metricDate = new Date(metric.recordedAt);
    const now = new Date();
    const daysAgo = parseInt(timeRange.replace('d', ''));
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const withinTimeRange = metricDate >= cutoffDate;
    
    return matchesMember && matchesMetric && withinTimeRange;
  });

  // Get unique metric types for filter
  const metricTypes = [...new Set(allMetrics.map((metric: any) => metric.type))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
      </div>
<MetricFilters
  members={members}
  metricTypes={metricTypes as string[]}
  selectedMember={selectedMember}
  selectedMetric={selectedMetric}
  timeRange={timeRange}
  onMemberChange={setSelectedMember}
  onMetricChange={setSelectedMetric}
  onTimeRangeChange={setTimeRange}
/>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Metrics</h3>
          <p className="text-2xl font-bold text-gray-900">{filteredMetrics.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Members</h3>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(filteredMetrics.map((m: any) => m.memberId)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Metric Types</h3>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(filteredMetrics.map((m: any) => m.type)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Daily Records</h3>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(filteredMetrics.length / parseInt(timeRange.replace('d', '')))}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      {filteredMetrics.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No health metrics found for the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMetrics.map((metric: any) => (
            <HealthMetricCard key={`${metric.id}-${metric.memberId}`} metric={metric} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthMetricsPage;
