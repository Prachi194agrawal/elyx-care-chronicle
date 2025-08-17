import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Calendar, Activity, FileText, MessageSquare } from 'lucide-react';
import { useMember } from '../hooks/useApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { format } from 'date-fns';

const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: memberResponse, loading, error, refetch } = useMember(id!);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading member details..." />;
  }

  if (error || !memberResponse) {
    return <ErrorMessage message={error || 'Member not found'} retry={refetch} />;
  }

  const member = (memberResponse as any).data;

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center">
        <Link
          to="/members"
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Members
        </Link>
      </div>

      {/* Member Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-healthcare-100 rounded-full flex items-center justify-center mr-6">
              {member.profileImage ? (
                <img
                  src={member.profileImage}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-healthcare-600 font-bold text-2xl">
                  {member.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{member.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {member.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {member.phone}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Born {format(new Date(member.dateOfBirth), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-healthcare-600">{member.planAdherence}%</div>
          <div className="text-sm text-gray-600">Plan Adherence</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{member.analytics?.healthTrends?.totalMetrics || 0}</div>
          <div className="text-sm text-gray-600">Health Metrics</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{member.analytics?.careJourney?.totalEpisodes || 0}</div>
          <div className="text-sm text-gray-600">Episodes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{member.analytics?.communication?.totalConversations || 0}</div>
          <div className="text-sm text-gray-600">Conversations</div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Health Goals</h4>
              <div className="flex flex-wrap gap-2">
                {member.healthGoals.map((goal:any, index:number) => (
                  <span key={index} className="px-2 py-1 bg-healthcare-100 text-healthcare-800 text-xs rounded-full">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Current Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {member.currentConditions.map((condition:any, index:number) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Medications</h4>
              <div className="flex flex-wrap gap-2">
                {member.medications.map((medication:any, index:number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {medication}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Allergies</h4>
              <div className="flex flex-wrap gap-2">
                {member.allergies.map((allergy:any, index:number) => (
                  <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Preferred Method</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{member.communicationPreference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time Zone</span>
              <span className="text-sm font-medium text-gray-900">{member.timeZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Preferred Contact Time</span>
              <span className="text-sm font-medium text-gray-900">{member.preferredContactTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Engagement Level</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{member.engagementLevel.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Active</span>
              <span className="text-sm font-medium text-gray-900">{format(new Date(member.lastActive), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Health Metrics */}
      {member.healthMetrics && member.healthMetrics.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Health Metrics</h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-900">Type</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900">Value</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900">Source</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {member.healthMetrics.slice(0, 10).map((metric:any) => (
                  <tr key={metric.id} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-sm text-gray-900 capitalize">{metric.type.replace('_', ' ')}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{metric.value} {metric.unit}</td>
                    <td className="py-2 px-3 text-sm text-gray-600">{metric.source}</td>
                    <td className="py-2 px-3 text-sm text-gray-600">{format(new Date(metric.timestamp), 'MMM dd, HH:mm')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Episodes */}
      {member.episodes && member.episodes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Episodes</h3>
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {member.episodes.slice(0, 5).map((episode:any) => (
              <div key={episode.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{episode.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{episode.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        episode.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : episode.status === 'in_progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {episode.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        episode.priority === 'urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : episode.priority === 'high' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {episode.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(episode.startDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetailPage;
