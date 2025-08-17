import React from 'react';

interface MetricFiltersProps {
  members: any[];
  metricTypes: string[];
  selectedMember: string;
  selectedMetric: string;
  timeRange: string;
  onMemberChange: (member: string) => void;
  onMetricChange: (metric: string) => void;
  onTimeRangeChange: (timeRange: string) => void;
}

const MetricFilters: React.FC<MetricFiltersProps> = ({
  members,
  metricTypes,
  selectedMember,
  selectedMetric,
  timeRange,
  onMemberChange,
  onMetricChange,
  onTimeRangeChange
}) => {
  const timeframes = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 3 Months' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Member Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Member:</h3>
          <select
            value={selectedMember}
            onChange={(e) => onMemberChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Members</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Metric Type Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Metric Type:</h3>
          <select
            value={selectedMetric}
            onChange={(e) => onMetricChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Metrics</option>
            {metricTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Time Range:</h3>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe.id} value={timeframe.id}>
                {timeframe.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MetricFilters;
