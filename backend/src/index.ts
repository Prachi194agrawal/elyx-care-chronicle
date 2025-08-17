// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const port = process.env.PORT || 3000;

// // Initialize Prisma Client
// const prisma = new PrismaClient();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Elyx Care Chronicle API is running! 🚀',
//     timestamp: new Date().toISOString(),
//     port: port
//   });
// });

// // Test database connection
// app.get('/api/test-db', async (req, res) => {
//   try {
//     // Test query to verify database connection (using singular model names)
//     const memberCount = await prisma.member.count();
//     const tableCount = await prisma.$queryRaw<Array<{ table_count: bigint }>>`
//       SELECT count(*) as table_count 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public'
//     `;
    
//     res.json({ 
//       success: true, 
//       message: 'Database connected successfully! ✅',
//       memberCount,
//       totalTables: Number(tableCount[0]?.table_count || 0)
//     });
//   } catch (error) {
//     console.error('Database connection error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Database connection failed ❌',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// // API Routes (using correct singular model names)
// app.get('/api/members', async (req, res) => {
//   try {
//     const members = await prisma.member.findMany({
//       take: 10 // Limit to first 10 for demo
//     });
//     res.json({ success: true, data: members, count: members.length });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch members',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// app.get('/api/health-metrics', async (req, res) => {
//   try {
//     const metrics = await prisma.healthMetric.findMany({
//       take: 10
//     });
//     res.json({ success: true, data: metrics, count: metrics.length });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch health metrics',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// app.get('/api/conversations', async (req, res) => {
//   try {
//     const conversations = await prisma.conversation.findMany({
//       take: 10
//     });
//     res.json({ success: true, data: conversations, count: conversations.length });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch conversations',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// app.get('/api/episodes', async (req, res) => {
//   try {
//     const episodes = await prisma.episode.findMany({
//       take: 10
//     });
//     res.json({ success: true, data: episodes, count: episodes.length });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch episodes',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to Elyx Care Chronicle API! 🏥',
//     version: '1.0.0',
//     endpoints: [
//       'GET /health - Health check',
//       'GET /api/test-db - Database connection test',
//       'GET /api/members - Get members',
//       'GET /api/health-metrics - Get health metrics', 
//       'GET /api/conversations - Get conversations',
//       'GET /api/episodes - Get episodes'
//     ]
//   });
// });

// // Start server
// app.listen(port, () => {
//   console.log('🚀 ================================');
//   console.log(`🏥 Elyx Care Chronicle API Started!`);
//   console.log(`📍 Server: http://localhost:${port}`);
//   console.log(`💚 Health: http://localhost:${port}/health`);
//   console.log(`🗄️  Database: http://localhost:${port}/api/test-db`);
//   console.log('🚀 ================================');
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('\n🛑 Shutting down server gracefully...');
//   await prisma.$disconnect();
//   process.exit(0);
// });



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Elyx Care Chronicle API is running! 🚀',
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const memberCount = await prisma.member.count();
    const tableCount = await prisma.$queryRaw<Array<{ table_count: bigint }>>`
      SELECT count(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    res.json({ 
      success: true, 
      message: 'Database connected successfully! ✅',
      memberCount,
      totalTables: Number(tableCount[0]?.table_count || 0)
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed ❌',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// =============================================
// ENHANCED MEMBER ENDPOINTS WITH FULL DATA
// =============================================
// ADD THESE CRUD ENDPOINTS TO YOUR BACKEND

// Create new member
app.post('/api/members', async (req, res) => {
  try {
    const member = await prisma.member.create({
      data: req.body
    });
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create member',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update member  
app.put('/api/members/:id', async (req, res) => {
  try {
    const member = await prisma.member.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update member',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete member
app.delete('/api/members/:id', async (req, res) => {
  try {
    await prisma.member.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete member',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create health metric
app.post('/api/health-metrics', async (req, res) => {
  try {
    console.log('📥 Creating health metric:', req.body);
    const metric = await prisma.healthMetric.create({
      data: req.body
    });
    console.log('✅ Health metric created:', metric);
    res.json({ success: true, data: metric });
  } catch (error) {
    console.error('Create health metric error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create health metric',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete health metric
app.delete('/api/health-metrics/:id', async (req, res) => {
  try {
    console.log('🗑️ Deleting health metric:', req.params.id);
    await prisma.healthMetric.delete({
      where: { id: req.params.id }
    });
    console.log('✅ Health metric deleted successfully');
    res.json({ success: true, message: 'Health metric deleted successfully' });
  } catch (error) {
    console.error('Delete health metric error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete health metric',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create conversation
app.post('/api/conversations', async (req, res) => {
  try {
    console.log('📥 Creating conversation:', req.body);
    const conversation = await prisma.conversation.create({
      data: req.body
    });
    console.log('✅ Conversation created:', conversation);
    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create conversation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Send message to conversation
app.post('/api/conversations/:id/messages', async (req, res) => {
  try {
    console.log('📥 Sending message to conversation:', req.params.id, req.body);
    const message = await prisma.message.create({
      data: {
        ...req.body,
        conversationId: req.params.id
      }
    });
    console.log('✅ Message sent:', message);
    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all members with basic info
app.get('/api/members', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      take: 20,
      orderBy: { lastActive: 'desc' }
    });
    res.json({ success: true, data: members, count: members.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch members',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all members with COMPLETE healthcare data
app.get('/api/members/full', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        healthMetrics: {
          orderBy: { timestamp: 'desc' },
          take: 10 // Latest 10 metrics per member
        },
        episodes: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Latest 5 episodes per member
        },
        conversations: {
          orderBy: { updatedAt: 'desc' },
          take: 3, // Latest 3 conversations per member
          include: {
            messages: {
              orderBy: { timestamp: 'desc' },
              take: 5 // Latest 5 messages per conversation
            }
          }
        }
      },
      orderBy: { lastActive: 'desc' }
    });

    // Calculate additional insights
    const membersWithInsights = members.map(member => ({
      ...member,
      insights: {
        totalHealthMetrics: member.healthMetrics.length,
        activeEpisodes: member.episodes.filter(ep => ep.status === 'in_progress' || ep.status === 'open').length,
        activeConversations: member.conversations.filter(conv => conv.status === 'active').length,
        lastMetricDate: member.healthMetrics[0]?.timestamp || null,
        averagePlanAdherence: member.planAdherence,
        riskLevel: member.planAdherence < 50 ? 'high' : member.planAdherence < 75 ? 'medium' : 'low'
      }
    }));

    res.json({ 
      success: true, 
      data: membersWithInsights, 
      count: members.length,
      summary: {
        totalMembers: members.length,
        highEngagement: members.filter(m => m.engagementLevel === 'very_high' || m.engagementLevel === 'high').length,
        lowAdherence: members.filter(m => m.planAdherence < 75).length,
        activeEpisodes: members.reduce((acc, m) => acc + m.episodes.filter(ep => ep.status === 'in_progress').length, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch complete member data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific member with COMPLETE profile
app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: req.params.id },
      include: {
        healthMetrics: {
          orderBy: { timestamp: 'desc' }
        },
        episodes: {
          orderBy: { createdAt: 'desc' }
        },
        conversations: {
          orderBy: { updatedAt: 'desc' },
          include: {
            messages: {
              orderBy: { timestamp: 'desc' }
            }
          }
        }
      }
    });

    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    // Enhanced member profile with analytics
    const memberProfile = {
      ...member,
      analytics: {
        healthTrends: {
          totalMetrics: member.healthMetrics.length,
          recentMetrics: member.healthMetrics.slice(0, 7), // Last 7 metrics
          metricTypes: [...new Set(member.healthMetrics.map(m => m.type))],
          lastRecordedDate: member.healthMetrics[0]?.timestamp || null
        },
        careJourney: {
          totalEpisodes: member.episodes.length,
          activeEpisodes: member.episodes.filter(ep => ep.status === 'in_progress' || ep.status === 'open'),
          resolvedEpisodes: member.episodes.filter(ep => ep.status === 'resolved'),
          averageEpisodeDuration: member.episodes.filter(ep => ep.endDate).length > 0 
            ? member.episodes
                .filter(ep => ep.endDate)
                .reduce((acc, ep) => acc + (new Date(ep.endDate!).getTime() - new Date(ep.startDate).getTime()), 0) 
                / member.episodes.filter(ep => ep.endDate).length / (1000 * 60 * 60 * 24) // days
            : null
        },
        communication: {
          totalConversations: member.conversations.length,
          activeConversations: member.conversations.filter(conv => conv.status === 'active'),
          totalMessages: member.conversations.reduce((acc, conv) => acc + conv.messages.length, 0),
          unreadMessages: member.conversations.reduce((acc, conv) => 
            acc + conv.messages.filter(msg => !msg.isRead && msg.senderRole !== 'member').length, 0),
          averageResponseTime: '< 30 minutes' // You can calculate this from actual data
        },
        healthStatus: {
          riskLevel: member.planAdherence < 50 ? 'high' : member.planAdherence < 75 ? 'medium' : 'low',
          adherenceScore: member.planAdherence,
          engagementLevel: member.engagementLevel,
          lastActiveDate: member.lastActive,
          daysSinceLastActive: Math.floor((new Date().getTime() - new Date(member.lastActive).getTime()) / (1000 * 60 * 60 * 24))
        }
      }
    };

    res.json({ success: true, data: memberProfile });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch member details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get member dashboard summary
app.get('/api/members/:id/dashboard', async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: req.params.id },
      include: {
        healthMetrics: {
          orderBy: { timestamp: 'desc' },
          take: 30 // Last 30 metrics for trends
        },
        episodes: {
          where: { status: { in: ['open', 'in_progress'] } },
          orderBy: { createdAt: 'desc' }
        },
        conversations: {
          where: { status: 'active' },
          include: {
            messages: {
              where: { isRead: false, senderRole: { not: 'member' } },
              orderBy: { timestamp: 'desc' }
            }
          }
        }
      }
    });

    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    const dashboard = {
      member: {
        id: member.id,
        name: member.name,
        profileImage: member.profileImage,
        engagementLevel: member.engagementLevel,
        planAdherence: member.planAdherence
      },
      quickStats: {
        activeEpisodes: member.episodes.length,
        unreadMessages: member.conversations.reduce((acc, conv) => acc + conv.messages.length, 0),
        recentMetrics: member.healthMetrics.slice(0, 3),
        nextGoals: member.healthGoals.slice(0, 2)
      },
      alerts: {
        lowAdherence: member.planAdherence < 75,
        inactiveUser: Math.floor((new Date().getTime() - new Date(member.lastActive).getTime()) / (1000 * 60 * 60 * 24)) > 7,
        urgentEpisodes: member.episodes.filter(ep => ep.priority === 'urgent' || ep.priority === 'high').length
      },
      recentActivity: {
        lastMetric: member.healthMetrics[0] || null,
        activeConversations: member.conversations.length,
        currentConditions: member.currentConditions,
        medications: member.medications
      }
    };

    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch member dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// =============================================
// ENHANCED HEALTH METRICS ENDPOINTS
// =============================================

app.get('/api/health-metrics', async (req, res) => {
  try {
    const metrics = await prisma.healthMetric.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' },
      include: {
        member: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    res.json({ success: true, data: metrics, count: metrics.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch health metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get health metrics by member ID
app.get('/api/members/:id/health-metrics', async (req, res) => {
  try {
    const { type, limit = '20' } = req.query;
    
    const whereClause = {
      memberId: req.params.id,
      ...(type && { type: type as string })
    };

    const metrics = await prisma.healthMetric.findMany({
      where: whereClause,
      take: parseInt(limit as string),
      orderBy: { timestamp: 'desc' }
    });

    res.json({ success: true, data: metrics, count: metrics.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch member health metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// =============================================
// ENHANCED CONVERSATION ENDPOINTS
// =============================================

app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      take: 20,
      orderBy: { updatedAt: 'desc' },
      include: {
        member: {
          select: { id: true, name: true, email: true, profileImage: true }
        },
        messages: {
          take: 3,
          orderBy: { timestamp: 'desc' }
        }
      }
    });
    res.json({ success: true, data: conversations, count: conversations.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch conversations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get conversation with all messages
app.get('/api/conversations/:id', async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: {
        member: true,
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch conversation details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// =============================================
// ENHANCED EPISODE ENDPOINTS
// =============================================

app.get('/api/episodes', async (req, res) => {
  try {
    const episodes = await prisma.episode.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        member: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    res.json({ success: true, data: episodes, count: episodes.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch episodes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get episodes by member ID
app.get('/api/members/:id/episodes', async (req, res) => {
  try {
    const episodes = await prisma.episode.findMany({
      where: { memberId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: episodes, count: episodes.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch member episodes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// =============================================
// TEAM MEMBERS ENDPOINT
// =============================================

app.get('/api/team-members', async (req, res) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: teamMembers, count: teamMembers.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch team members',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// =============================================
// ANALYTICS & SUMMARY ENDPOINTS
// =============================================

// Get comprehensive healthcare analytics
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const [
      totalMembers,
      totalHealthMetrics,
      totalEpisodes,
      totalConversations,
      activeMembers,
      highRiskMembers,
      recentActivity
    ] = await Promise.all([
      prisma.member.count(),
      prisma.healthMetric.count(),
      prisma.episode.count(),
      prisma.conversation.count(),
      prisma.member.count({
        where: {
          lastActive: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      prisma.member.count({
        where: {
          planAdherence: { lt: 75 }
        }
      }),
      prisma.healthMetric.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' },
        include: {
          member: {
            select: { name: true }
          }
        }
      })
    ]);

    const analytics = {
      summary: {
        totalMembers,
        totalHealthMetrics,
        totalEpisodes,
        totalConversations,
        activeMembers,
        highRiskMembers,
        memberRetentionRate: ((activeMembers / totalMembers) * 100).toFixed(1)
      },
      recentActivity,
      alerts: {
        highRiskMembers,
        inactiveMembers: totalMembers - activeMembers,
        urgentEpisodes: await prisma.episode.count({
          where: { priority: 'urgent', status: { in: ['open', 'in_progress'] } }
        })
      }
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root endpoint with enhanced documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Elyx Care Chronicle API! 🏥',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health - API health check',
      database: 'GET /api/test-db - Database connection test',
      members: {
        basic: 'GET /api/members - Get all members (basic info)',
        full: 'GET /api/members/full - Get all members with complete healthcare data',
        individual: 'GET /api/members/:id - Get specific member profile',
        dashboard: 'GET /api/members/:id/dashboard - Get member dashboard',
        metrics: 'GET /api/members/:id/health-metrics - Get member health metrics',
        episodes: 'GET /api/members/:id/episodes - Get member episodes'
      },
      healthcare: {
        metrics: 'GET /api/health-metrics - Get all health metrics',
        conversations: 'GET /api/conversations - Get all conversations',
        episodes: 'GET /api/episodes - Get all episodes',
        team: 'GET /api/team-members - Get healthcare team'
      },
      analytics: 'GET /api/analytics/overview - Get comprehensive analytics'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log('🚀 ================================');
  console.log(`🏥 Elyx Care Chronicle API Started!`);
  console.log(`📍 Server: http://localhost:${port}`);
  console.log(`💚 Health: http://localhost:${port}/health`);
  console.log(`🗄️  Database: http://localhost:${port}/api/test-db`);
  console.log(`👥 Members Full: http://localhost:${port}/api/members/full`);
  console.log(`📊 Analytics: http://localhost:${port}/api/analytics/overview`);
  console.log(`📝 Data Management: All CRUD operations enabled`);
  console.log('🚀 ================================');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

