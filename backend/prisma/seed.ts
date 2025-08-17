import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Elyx Care Chronicle database seeding...')

  // Create sample members (patients)
  const members = await Promise.all([
    prisma.member.create({
      data: {
        id: 'sarah-martinez-id', // predictable ID
        name: 'Sarah Martinez',
        email: 'sarah.martinez@email.com',
        phone: '+1-555-0101',
        dateOfBirth: new Date('1985-03-15'),
        profileImage: 'https://example.com/avatar1.jpg',
        healthGoals: ['Lose 15 pounds', 'Improve cardiovascular health', 'Better sleep quality'],
        currentConditions: ['Type 2 Diabetes', 'Hypertension'],
        medications: ['Metformin 500mg twice daily', 'Lisinopril 10mg daily'],
        allergies: ['Penicillin', 'Shellfish'],
        communicationPreference: 'text',
        timeZone: 'America/New_York',
        preferredContactTime: 'morning',
        joinDate: new Date('2024-01-15'),
        lastActive: new Date('2025-08-16T08:30:00'),
        engagementLevel: 'high',
        planAdherence: 85,
      }
    }),
    prisma.member.create({
      data: {
        id: 'michael-chen-id', // predictable ID
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-0102',
        dateOfBirth: new Date('1978-11-22'),
        profileImage: 'https://example.com/avatar2.jpg',
        healthGoals: ['Manage stress levels', 'Increase daily steps to 10k', 'Quit smoking'],
        currentConditions: ['Anxiety', 'High Cholesterol'],
        medications: ['Atorvastatin 20mg daily', 'Sertraline 50mg daily'],
        allergies: ['Latex'],
        communicationPreference: 'email',
        timeZone: 'America/Los_Angeles',
        preferredContactTime: 'evening',
        joinDate: new Date('2024-03-20'),
        lastActive: new Date('2025-08-15T18:45:00'),
        engagementLevel: 'medium',
        planAdherence: 72,
      }
    }),
    prisma.member.create({
      data: {
        id: 'jennifer-thompson-id', // predictable ID
        name: 'Jennifer Thompson',
        email: 'jennifer.thompson@email.com',
        phone: '+1-555-0103',
        dateOfBirth: new Date('1992-07-08'),
        profileImage: 'https://example.com/avatar3.jpg',
        healthGoals: ['Prepare for marathon', 'Improve nutrition', 'Build core strength'],
        currentConditions: [],
        medications: [],
        allergies: ['Peanuts'],
        communicationPreference: 'app_notification',
        timeZone: 'America/Chicago',
        preferredContactTime: 'afternoon',
        joinDate: new Date('2024-06-01'),
        lastActive: new Date('2025-08-16T12:15:00'),
        engagementLevel: 'very_high',
        planAdherence: 95,
      }
    }),
    // Create member
    prisma.member.create({
      data: {
        id: 'rohan-patel-id', // predictable ID
        name: 'Rohan Patel',
        email: 'rohan.patel@techcorp.com',
        phone: '+1-555-0104',
        dateOfBirth: new Date('1988-09-10'),
        profileImage: 'https://example.com/avatar4.jpg',
        healthGoals: ['Lower blood pressure', 'Increase physical activity', 'Reduce stress'],
        currentConditions: ['Hypertension'],
        medications: ['Amlodipine 5mg daily'],
        allergies: [],
        communicationPreference: 'email',
        timeZone: 'America/New_York',
        preferredContactTime: 'evening',
        joinDate: new Date('2024-02-10'),
        lastActive: new Date('2025-08-15T17:00:00'),
        engagementLevel: 'medium',
        planAdherence: 78,
      }
    })
  ])

  console.log(`✅ Created ${members.length} members`)

  // Create team members (healthcare providers)
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        name: 'Dr. Emily Rodriguez',
        role: 'doctor',
        title: 'MD, Internal Medicine',
        avatar: 'https://example.com/doctor1.jpg',
        communicationStyle: 'empathetic_detailed',
        expertise: ['Diabetes Management', 'Cardiovascular Health', 'Preventive Care'],
        isOnline: true,
        responseTime: 15,
      }
    }),
    prisma.teamMember.create({
      data: {
        name: 'Alex Johnson',
        role: 'concierge',
        title: 'Health Concierge',
        avatar: 'https://example.com/concierge1.jpg',
        communicationStyle: 'friendly_supportive',
        expertise: ['Member Support', 'Care Coordination', 'Wellness Coaching'],
        isOnline: true,
        responseTime: 5,
      }
    }),
    prisma.teamMember.create({
      data: {
        name: 'Lisa Park',
        role: 'trainer',
        title: 'Certified Personal Trainer',
        avatar: 'https://example.com/trainer1.jpg',
        communicationStyle: 'motivational_direct',
        expertise: ['Fitness Planning', 'Injury Prevention', 'Strength Training'],
        isOnline: false,
        responseTime: 30,
      }
    })
  ])

  console.log(`✅ Created ${teamMembers.length} team members`)

  // Create health metrics - FIXED: Use correct array indexing
  const healthMetrics = await Promise.all([
    // Sarah's metrics
    prisma.healthMetric.create({
      data: {
        memberId: members[0].id, // FIXED: Use array index
        type: 'weight',
        value: '168',
        unit: 'lbs',
        timestamp: new Date('2025-08-16T07:00:00'),
        source: 'manual',
        notes: 'Morning weigh-in',
      }
    }),
    prisma.healthMetric.create({
      data: {
        memberId: members[0].id, // FIXED: Use correct array index
        type: 'blood_pressure',
        value: '128/82',
        unit: 'mmHg',
        timestamp: new Date('2025-08-16T07:30:00'),
        source: 'manual',
        notes: 'Slightly elevated, monitoring',
      }
    }),
    prisma.healthMetric.create({
      data: {
        memberId: members[0].id,
        type: 'blood_glucose',
        value: '95',
        unit: 'mg/dL',
        timestamp: new Date('2025-08-16T07:15:00'),
        source: 'glucometer',
        notes: 'Fasting glucose - good control',
      }
    }),
    // Michael's metrics
    prisma.healthMetric.create({
      data: {
        memberId: members[1].id,
        type: 'steps',
        value: '8540',
        unit: 'steps',
        timestamp: new Date('2025-08-15T23:59:00'),
        source: 'garmin',
        notes: 'Good day, almost hit 10k goal',
      }
    }),
    prisma.healthMetric.create({
      data: {
        memberId: members[1].id,
        type: 'heart_rate',
        value: '68',
        unit: 'bpm',
        timestamp: new Date('2025-08-16T08:00:00'),
        source: 'garmin',
        notes: 'Resting heart rate improving',
      }
    }),
    // Jennifer's metrics
    prisma.healthMetric.create({
      data: {
        memberId: members[2].id,
        type: 'running_distance',
        value: '5.2',
        unit: 'miles',
        timestamp: new Date('2025-08-16T06:30:00'),
        source: 'whoop',
        notes: 'Marathon training - long run day',
      }
    })
  ])

  console.log(`✅ Created ${healthMetrics.length} health metrics`)

  // Create episodes
  const episodes = await Promise.all([
    prisma.episode.create({
      data: {
        memberId: members[0].id,
        title: 'Diabetes Management Check-in',
        description: 'Quarterly review of blood sugar control and medication adherence',
        category: 'health_concern',
        priority: 'medium',
        status: 'in_progress',
        initiatedBy: 'team',
        assignedTo: teamMembers[0].id,
        startDate: new Date('2025-08-10'),
        endDate: null,
        interventions: ['Medication adjustment', 'Nutrition counseling', 'Exercise plan'],
        outcomes: ['Improved HbA1c', 'Better glucose stability'],
        frictionPoints: ['Difficulty with meal planning', 'Exercise consistency'],
        tags: ['diabetes', 'medication', 'lifestyle'],
      }
    }),
    prisma.episode.create({
      data: {
        memberId: members[1].id,
        title: 'Stress Management Program',
        description: 'Comprehensive approach to managing work-related stress and anxiety',
        category: 'onboarding',
        priority: 'high',
        status: 'open',
        initiatedBy: 'member',
        assignedTo: teamMembers[1].id,
        startDate: new Date('2025-08-12'),
        endDate: null,
        interventions: ['Mindfulness training', 'Breathing exercises', 'Therapy referral'],
        outcomes: [],
        frictionPoints: ['Time constraints', 'Work demands'],
        tags: ['mental_health', 'stress', 'workplace'],
      }
    }),
    prisma.episode.create({
      data: {
        memberId: members[2].id,
        title: 'Marathon Training Support',
        description: 'Comprehensive training plan and injury prevention for upcoming marathon',
        category: 'fitness_goal',
        priority: 'low',
        status: 'resolved',
        initiatedBy: 'member',
        assignedTo: teamMembers[2].id,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-01'),
        interventions: ['Custom training plan', 'Nutrition optimization', 'Recovery protocols'],
        outcomes: ['Completed 20-mile long run', 'No injuries', 'Improved pace'],
        frictionPoints: ['Weather challenges', 'Time management'],
        tags: ['fitness', 'marathon', 'endurance'],
      }
    })
  ])

  console.log(`✅ Created ${episodes.length} episodes`)

  // Create conversations
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        memberId: members[0].id,
        title: 'Blood Sugar Concerns',
        description: 'Discussion about recent glucose spikes',
        category: 'medical',
        status: 'active',
      }
    }),
    prisma.conversation.create({
      data: {
        memberId: members[1].id,
        title: 'Stress Management Check-in',
        description: 'Weekly stress management progress review',
        category: 'mental_health',
        status: 'active',
      }
    }),
    prisma.conversation.create({
      data: {
        memberId: members[2].id,
        title: 'Marathon Nutrition Questions',
        description: 'Pre-race nutrition strategy discussion',
        category: 'nutrition',
        status: 'archived',
      }
    })
  ])

  console.log(`✅ Created ${conversations.length} conversations`)

  // Create messages - FIXED: Use correct array indexing
  const messages = await Promise.all([
    // Conversation 1 - Blood Sugar Concerns
    prisma.message.create({
      data: {
        conversationId: conversations[0].id,
        senderId: members[0].id,
        senderName: 'Sarah Martinez',
        senderRole: 'member',
        content: 'Hi Dr. Rodriguez, I\'ve noticed my blood sugar has been spiking after lunch lately, even though I\'m eating my usual meals. Should I be concerned?',
        timestamp: new Date('2025-08-16T09:00:00'),
        messageType: 'text',
        isRead: true,
        sentiment: 'concerned',
        topics: ['blood_sugar', 'meals', 'spikes'],
        actionItems: ['Review recent glucose readings', 'Analyze meal timing'],
      }
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[0].id,
        senderId: teamMembers[0].id, // FIXED: Use correct array index
        senderName: 'Dr. Emily Rodriguez',
        senderRole: 'doctor',
        content: 'Hi Sarah! Thank you for monitoring so carefully. Let\'s review your recent readings together. Can you tell me what you\'ve been eating for lunch this week? Also, have there been any changes in your stress levels or sleep patterns?',
        timestamp: new Date('2025-08-16T09:15:00'),
        messageType: 'text',
        isRead: true,
        sentiment: 'supportive',
        topics: ['glucose_review', 'lifestyle_factors'],
        actionItems: ['Food diary review', 'Stress assessment'],
      }
    }),
    // Conversation 2 - Stress Management
    prisma.message.create({
      data: {
        conversationId: conversations[1].id,
        senderId: teamMembers[1].id,
        senderName: 'Alex Johnson',
        senderRole: 'concierge',
        content: 'Good morning Michael! How are you feeling after trying the breathing exercises we discussed last week? Have you been able to incorporate them into your daily routine?',
        timestamp: new Date('2025-08-16T08:00:00'),
        messageType: 'text',
        isRead: false,
        sentiment: 'supportive',
        topics: ['breathing_exercises', 'routine', 'progress'],
        actionItems: ['Check exercise compliance', 'Assess stress levels'],
      }
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[1].id,
        senderId: members[1].id,
        senderName: 'Michael Chen',
        senderRole: 'member',
        content: 'Hi Alex! I\'ve been doing them most days, usually during my lunch break. I definitely feel more centered afterward. The 4-7-8 technique is especially helpful when I\'m feeling overwhelmed at work.',
        timestamp: new Date('2025-08-16T12:30:00'),
        messageType: 'text',
        isRead: false,
        sentiment: 'positive',
        topics: ['breathing_technique', 'work_stress', 'improvement'],
        actionItems: ['Continue current routine', 'Explore advanced techniques'],
      }
    })
  ])

  console.log(`✅ Created ${messages.length} messages`)

  console.log('�� Elyx Care Chronicle database seeding completed successfully!')
  console.log('📊 Database populated with realistic healthcare data:')
  console.log(`   👥 ${members.length} members`)
  console.log(`   🏥 ${teamMembers.length} team members`)
  console.log(`   📈 ${healthMetrics.length} health metrics`)
  console.log(`   📋 ${episodes.length} episodes`)
  console.log(`   💬 ${conversations.length} conversations`)
  console.log(`   📨 ${messages.length} messages`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
