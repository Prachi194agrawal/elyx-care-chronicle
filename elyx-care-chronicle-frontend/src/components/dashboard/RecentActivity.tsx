import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { HealthMetric } from '../../types';
import { format } from 'date-fns';

interface RecentActivityProps {
  activities: HealthMetric[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Health Metrics</h3>
        <Activity className="w-5 h-5 text-gray-500" />
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-healthcare-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-healthcare-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.member?.name || 'Unknown Member'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {activity.type}: {activity.value} {activity.unit}
                  {activity.source && (
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                      {activity.source}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
