import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Phone, 
  Mail, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Member } from '../../types';
import { format } from 'date-fns';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEngagementIcon = (level: string) => {
    switch (level) {
      case 'very_high':
      case 'high':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'medium':
        return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'low':
      case 'very_low':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Link to={`/members/${member.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-healthcare-100 rounded-full flex items-center justify-center">
              {member.profileImage ? (
                <img
                  src={member.profileImage}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-healthcare-600 font-semibold text-lg">
                  {member.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          
          {member.insights?.riskLevel && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskLevelColor(member.insights.riskLevel)}`}>
              {member.insights.riskLevel} risk
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {member.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Born {format(new Date(member.dateOfBirth), 'MMM dd, yyyy')}
          </div>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{member.planAdherence}%</div>
            <div className="text-xs text-gray-600">Adherence</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {getEngagementIcon(member.engagementLevel)}
            </div>
            <div className="text-xs text-gray-600 capitalize">{member.engagementLevel.replace('_', ' ')}</div>
          </div>
        </div>

        {/* Quick Stats */}
        {member.insights && (
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                {member.insights.totalHealthMetrics} metrics
              </div>
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                {member.insights.activeEpisodes} episodes
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                {member.insights.activeConversations} chats
              </div>
            </div>
          </div>
        )}

        {/* Last Active */}
        <div className="mt-3 text-xs text-gray-500">
          Last active {format(new Date(member.lastActive), 'MMM dd, yyyy')}
        </div>
      </div>
    </Link>
  );
};

export default MemberCard;
