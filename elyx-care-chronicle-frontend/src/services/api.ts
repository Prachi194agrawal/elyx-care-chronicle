import axios from 'axios';
import { Member, HealthMetric, Episode, Conversation, TeamMember, Analytics, ApiResponse } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001', // Updated to match backend port
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  // Health Check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  }

  async testDatabase() {
    const response = await api.get('/api/test-db');
    return response.data;
  }

  // Members API
  async getAllMembers(): Promise<ApiResponse<Member[]>> {
    const response = await api.get('/api/members');
    return response.data;
  }

  async getAllMembersWithFullData(): Promise<ApiResponse<Member[]>> {
    const response = await api.get('/api/members/full');
    return response.data;
  }

  async getMemberById(id: string): Promise<ApiResponse<Member>> {
    const response = await api.get(`/api/members/${id}`);
    return response.data;
  }

  async createMember(memberData: Partial<Member>): Promise<ApiResponse<Member>> {
    const response = await api.post('/api/members', memberData);
    return response.data;
  }

  async updateMember(id: string, memberData: Partial<Member>): Promise<ApiResponse<Member>> {
    const response = await api.put(`/api/members/${id}`, memberData);
    return response.data;
  }

  async deleteMember(id: string): Promise<ApiResponse<any>> {
    const response = await api.delete(`/api/members/${id}`);
    return response.data;
  }

  // Health Metrics API
  async getAllHealthMetrics(): Promise<ApiResponse<HealthMetric[]>> {
    const response = await api.get('/api/health-metrics');
    return response.data;
  }

  async getMemberHealthMetrics(
    memberId: string, 
    type?: string, 
    limit?: number
  ): Promise<ApiResponse<HealthMetric[]>> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get(`/api/members/${memberId}/health-metrics?${params.toString()}`);
    return response.data;
  }

  async createHealthMetric(metricData: Partial<HealthMetric>): Promise<ApiResponse<HealthMetric>> {
    console.log('📤 Creating health metric via API:', metricData);
    const response = await api.post('/api/health-metrics', metricData);
    console.log('✅ Health metric created via API:', response.data);
    return response.data;
  }

  async deleteHealthMetric(id: string): Promise<ApiResponse<any>> {
    console.log('🗑️ Deleting health metric via API:', id);
    const response = await api.delete(`/api/health-metrics/${id}`);
    console.log('✅ Health metric deleted via API:', response.data);
    return response.data;
  }

  // Episodes API
  async getAllEpisodes(): Promise<ApiResponse<Episode[]>> {
    const response = await api.get('/api/episodes');
    return response.data;
  }

  async getMemberEpisodes(memberId: string): Promise<ApiResponse<Episode[]>> {
    const response = await api.get(`/api/members/${memberId}/episodes`);
    return response.data;
  }

  async createEpisode(episodeData: Partial<Episode>): Promise<ApiResponse<Episode>> {
    const response = await api.post('/api/episodes', episodeData);
    return response.data;
  }

  async updateEpisode(id: string, episodeData: Partial<Episode>): Promise<ApiResponse<Episode>> {
    const response = await api.put(`/api/episodes/${id}`, episodeData);
    return response.data;
  }

  async deleteEpisode(id: string): Promise<ApiResponse<any>> {
    const response = await api.delete(`/api/episodes/${id}`);
    return response.data;
  }

  // Conversations API
  async getAllConversations(): Promise<ApiResponse<Conversation[]>> {
    const response = await api.get('/api/conversations');
    return response.data;
  }

  async getConversationById(id: string): Promise<ApiResponse<Conversation>> {
    const response = await api.get(`/api/conversations/${id}`);
    return response.data;
  }

  async createConversation(conversationData: Partial<Conversation>): Promise<ApiResponse<Conversation>> {
    console.log('📤 Creating conversation via API:', conversationData);
    const response = await api.post('/api/conversations', conversationData);
    console.log('✅ Conversation created via API:', response.data);
    return response.data;
  }

  async sendMessage(conversationId: string, messageData: any): Promise<ApiResponse<any>> {
    console.log('📤 Sending message via API:', conversationId, messageData);
    const response = await api.post(`/api/conversations/${conversationId}/messages`, messageData);
    console.log('✅ Message sent via API:', response.data);
    return response.data;
  }

  // Team Members API
  async getAllTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
    const response = await api.get('/api/team-members');
    return response.data;
  }

  async getTeamMemberById(id: string): Promise<ApiResponse<TeamMember>> {
    const response = await api.get(`/api/team-members/${id}`);
    return response.data;
  }

  async createTeamMember(teamMemberData: Partial<TeamMember>): Promise<ApiResponse<TeamMember>> {
    const response = await api.post('/api/team-members', teamMemberData);
    return response.data;
  }

  async updateTeamMember(id: string, teamMemberData: Partial<TeamMember>): Promise<ApiResponse<TeamMember>> {
    const response = await api.put(`/api/team-members/${id}`, teamMemberData);
    return response.data;
  }

  // Analytics API
  async getAnalyticsOverview(): Promise<ApiResponse<Analytics>> {
    const response = await api.get('/api/analytics/overview');
    return response.data;
  }

  // Member Stats API
  async getMemberStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/api/analytics/member-stats');
    return response.data;
  }

  async getEngagementMetrics(): Promise<ApiResponse<any>> {
    const response = await api.get('/api/analytics/engagement');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
