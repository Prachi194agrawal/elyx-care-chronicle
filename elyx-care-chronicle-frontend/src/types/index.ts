// Member Types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImage?: string;
  healthGoals: string[];
  currentConditions: string[];
  medications: string[];
  allergies: string[];
  communicationPreference: string;
  timeZone: string;
  preferredContactTime: string;
  joinDate: string;
  lastActive: string;
  engagementLevel: string;
  planAdherence: number;
  createdAt: string;
  updatedAt: string;
  healthMetrics?: HealthMetric[];
  episodes?: Episode[];
  conversations?: Conversation[];
  insights?: {
    totalHealthMetrics: number;
    activeEpisodes: number;
    activeConversations: number;
    lastMetricDate: string | null;
    averagePlanAdherence: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  analytics?: {
    healthTrends: any;
    careJourney: any;
    communication: any;
    healthStatus: any;
  };
}

// Health Metric Types
export interface HealthMetric {
  id: string;
  memberId: string;
  type: string;
  value: string;
  unit: string;
  timestamp: string;
  source: string;
  notes?: string;
  createdAt: string;
  member?: {
    id: string;
    name: string;
    email: string;
  };
}

// Episode Types
export interface Episode {
  id: string;
  memberId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  initiatedBy: string;
  assignedTo: string;
  startDate: string;
  endDate?: string;
  interventions: string[];
  outcomes: string[];
  frictionPoints: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    name: string;
    email: string;
  };
}

// Conversation Types
export interface Conversation {
  id: string;
  memberId: string;
  title?: string;
  description?: string;
  category: string;
  status: 'active' | 'archived' | 'urgent_attention_needed';
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  messageType: string;
  isRead: boolean;
  sentiment?: string;
  topics: string[];
  actionItems: string[];
  createdAt: string;
}

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar?: string;
  communicationStyle: string;
  expertise: string[];
  isOnline: boolean;
  responseTime: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface Analytics {
  summary: {
    totalMembers: number;
    totalHealthMetrics: number;
    totalEpisodes: number;
    totalConversations: number;
    activeMembers: number;
    highRiskMembers: number;
    memberRetentionRate: string;
  };
  recentActivity: HealthMetric[];
  alerts: {
    highRiskMembers: number;
    inactiveMembers: number;
    urgentEpisodes: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
  summary?: any;
}
