import React, { useState } from 'react';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { useMembers } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import MemberCard from './MemberCard';
import MemberFilters from './MemberFilters';

const MembersPage: React.FC = () => {
  const { data: membersData, loading, error, refetch } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading members..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={refetch} />;
  }

  const members = (membersData as any)?.data || [];
  const summary = (membersData as any)?.summary;

  // Filter members based on search and filters
  const filteredMembers = members.filter((member: any) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'high-risk' && member.insights?.riskLevel === 'high') ||
                         (selectedFilter === 'active' && member.engagementLevel === 'high') ||
                         (selectedFilter === 'inactive' && member.engagementLevel === 'low');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Healthcare Members</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor your healthcare platform members
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-healthcare-600 text-white rounded-lg hover:bg-healthcare-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{summary.totalMembers}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{summary.highEngagement}</div>
            <div className="text-sm text-gray-600">High Engagement</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">{summary.lowAdherence}</div>
            <div className="text-sm text-gray-600">Low Adherence</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">{summary.activeEpisodes}</div>
            <div className="text-sm text-gray-600">Active Episodes</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <MemberFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      )}

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first member'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {filteredMembers.map((member: any) => (
  <MemberCard key={member.id} member={member} />
))}

        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredMembers.length} of {members.length} members
      </div>
    </div>
  );
};

export default MembersPage;
