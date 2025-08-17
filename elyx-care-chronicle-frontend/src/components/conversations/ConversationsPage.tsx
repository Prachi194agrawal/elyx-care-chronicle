import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter } from 'lucide-react';
import { useConversations } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConversationCard from './ConversationCard';

const ConversationsPage: React.FC = () => {
  const { data: conversationsData, loading, error, refetch } = useConversations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading conversations..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={refetch} />;
  }

  const conversations = (conversationsData as any)?.data || [];

  // Filter conversations
const filteredConversations = conversations.filter((conversation: any) => {
  const matchesSearch = conversation.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       conversation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       conversation.member?.email?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus = selectedStatus === 'all' || conversation.status === selectedStatus;

  return matchesSearch && matchesStatus;
});


  // Stats
const activeConversations = conversations.filter((c: any) => c.status === 'active').length;
const urgentConversations = conversations.filter((c: any) => c.status === 'urgent_attention_needed').length;
const archivedConversations = conversations.filter((c: any) => c.status === 'archived').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
          <p className="text-gray-600 mt-2">
            Manage member conversations and communications
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-healthcare-600 text-white rounded-lg hover:bg-healthcare-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{conversations.length}</div>
          <div className="text-sm text-gray-600">Total Conversations</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{activeConversations}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">{urgentConversations}</div>
          <div className="text-sm text-gray-600">Urgent</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-600">{archivedConversations}</div>
          <div className="text-sm text-gray-600">Archived</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="urgent_attention_needed">Urgent</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start your first conversation with a member'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
         {filteredConversations.map((conversation: any) => (
  <ConversationCard key={conversation.id} conversation={conversation} />
))}

        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredConversations.length} of {conversations.length} conversations
      </div>
    </div>
  );
};

export default ConversationsPage;
