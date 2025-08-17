import React from 'react';
import { useParams } from 'react-router-dom';
import { useConversations } from '../hooks/useApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { format } from 'date-fns';
import { ArrowLeft, User, Clock, MessageSquare } from 'lucide-react';

const ConversationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: conversationsData, loading, error, refetch } = useConversations();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load conversation details" retry={refetch} />;
  }

  const conversations = (conversationsData as any)?.data || [];
  const conversation = conversations.find((c: any) => c.id === id);

  if (!conversation) {
    return <ErrorMessage message="Conversation not found" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{conversation.title}</h1>
          <p className="text-gray-600">Conversation Details</p>
        </div>
      </div>

      {/* Conversation Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Member</p>
              <p className="font-medium">{conversation.member?.name || 'Unknown'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Started</p>
              <p className="font-medium">
                {format(new Date(conversation.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                conversation.status === 'urgent_attention_needed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {conversation.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'ai'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'ai' ? 'text-gray-500' : 'text-blue-200'
                    }`}
                  >
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages in this conversation yet.</p>
          )}
        </div>
      </div>

      {/* Conversation Summary */}
      {conversation.summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <p className="text-gray-700">{conversation.summary}</p>
        </div>
      )}

      {/* Tags */}
      {conversation.tags && conversation.tags.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {conversation.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetailPage;
