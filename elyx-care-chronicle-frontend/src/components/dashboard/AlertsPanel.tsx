import React from 'react';
import { AlertTriangle, Users, MessageSquare, Clock } from 'lucide-react';

interface AlertsPanelProps {
  alerts?: {
    highRiskMembers: number;
    inactiveMembers: number;
    urgentEpisodes: number;
  };
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const alertItems = [
    {
      id: 1,
      title: 'High Risk Members',
      count: alerts?.highRiskMembers || 0,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'red',
      description: 'Members with low adherence scores'
    },
    {
      id: 2,
      title: 'Inactive Members',
      count: alerts?.inactiveMembers || 0,
      icon: <Clock className="w-5 h-5" />,
      color: 'yellow',
      description: 'No activity in the past 7 days'
    },
    {
      id: 3,
      title: 'Urgent Episodes',
      count: alerts?.urgentEpisodes || 0,
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'orange',
      description: 'Episodes requiring immediate attention'
    }
  ];

  const getColorClasses = (color: string) => {
    const classes = {
      red: 'bg-red-50 text-red-600 border-red-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return classes[color as keyof typeof classes] || classes.red;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
        <AlertTriangle className="w-5 h-5 text-gray-500" />
      </div>

      <div className="space-y-3">
        {alertItems.map((alert) => (
          <div key={alert.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
            <div className={`p-2 rounded-lg ${getColorClasses(alert.color)}`}>
              {alert.icon}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                <span className={`text-lg font-bold ${alert.count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {alert.count}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>

      {(alerts?.highRiskMembers || 0) + (alerts?.inactiveMembers || 0) + (alerts?.urgentEpisodes || 0) === 0 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500">All systems healthy!</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
