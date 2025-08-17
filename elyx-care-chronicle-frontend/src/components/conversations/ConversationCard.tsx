import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, User, AlertCircle } from 'lucide-react';
import { Conversation } from '../../types';
import { format } from 'date-fns';

interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'urgent_attention_needed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'urgent_attention_needed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const lastMessage = conversation.messages?.[conversation.messages.length - 1];
  const messageCount = conversation.messages?.length || 0;
  const unreadCount = conversation.messages?.filter(m => !m.isRead && m.senderRole !== 'member').length || 0;

  return (
    <Link to={`/conversations/${conversation.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
        <div className="flex items-start justify-between">
          {/* Left side - Member info and conversation details */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-healthcare-100 rounded-full flex items-center justify-center mr-3">
                {conversation.member?.profileImage ? (
                  <img
                    src={conversation.member.profileImage}
                    alt={conversation.member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-healthcare-600 font-semibold">
                    {conversation.member?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {conversation.member?.name || 'Unknown Member'}
                </h3>
                <p className="text-sm text-gray-500">{conversation.member?.email}</p>
              </div>
            </div>

            {/* Conversation title and description */}
            {conversation.title && (
              <h4 className="font-medium text-gray-900 mb-1">{conversation.title}</h4>
            )}
            {conversation.description && (
              <p className="text-sm text-gray-600 mb-2">{conversation.description}</p>
            )}

            {/* Category */}
            <div className="flex items-center mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mr-2 capitalize">
                {conversation.category.replace('_', ' ')}
              </span>
            </div>

            {/* Last message preview */}
            {lastMessage && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900 capitalize">
                    {lastMessage.senderName} ({lastMessage.senderRole})
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(lastMessage.timestamp), 'MMM dd, HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {lastMessage.content}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                {messageCount} messages
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Updated {format(new Date(conversation.updatedAt), 'MMM dd')}
              </div>
            </div>
          </div>

          {/* Right side - Status and unread indicator */}
          <div className="flex flex-col items-end space-y-2">
            <div className={`flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(conversation.status)}`}>
              {getStatusIcon(conversation.status)}
              <span className="ml-1 capitalize">
                {conversation.status.replace('_', ' ')}
              </span>
            </div>
            
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ConversationCard;
