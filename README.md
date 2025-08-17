# 🏥 Elyx Care Chronicle
### Advanced Healthcare Management System

> **A comprehensive, production-ready healthcare management platform designed for modern medical facilities, healthcare providers, and patients.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## 🌟 Project Overview

Elyx Care Chronicle is a state-of-the-art healthcare management system that revolutionizes how medical data is managed, analyzed, and utilized. Built with modern technologies and following industry best practices, it provides a comprehensive solution for healthcare providers to deliver better patient care through data-driven insights.

### 🎯 Key Features

- **📊 Real-time Health Analytics** - Advanced dashboard with predictive insights
- **👥 Comprehensive Patient Management** - Complete patient profiles with medical history
- **📈 Health Metrics Tracking** - Continuous monitoring of vital signs and health indicators
- **💬 Intelligent Communication System** - AI-powered patient engagement and notifications
- **🔒 HIPAA-Compliant Security** - Enterprise-grade data protection and privacy
- **📱 Responsive Design** - Seamless experience across all devices
- **🔄 Real-time Data Synchronization** - Instant updates across all platforms
- **📋 Advanced Reporting** - Comprehensive analytics and exportable reports

## 🏗️ System Architecture

```
elyx-care-chronicle/
├── backend/                 # Express.js API server
│   ├── src/
│   │   └── index.ts        # Main server file (Port 3001)
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   ├── package.json
│   └── .env               # Environment variables
├── frontend/              # Next.js application
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── package.json
│   └── .env.local        # Frontend environment variables (Port 3000)
└── README.md             # This file
```

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Step-by-Step Setup](#step-by-step-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Development Commands](#development-commands)

## 🔧 Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software
1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** or **yarn** (comes with Node.js)
   - Verify npm: `npm --version`
   - Or install yarn: `npm install -g yarn`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **PostgreSQL** (v14 or higher)
   - **Windows**: Download from https://www.postgresql.org/download/windows/
   - **macOS**: `brew install postgresql` or download from official site
   - **Linux Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
   - **Linux CentOS/RHEL**: `sudo yum install postgresql postgresql-server`

5. **Code Editor** (recommended)
   - Visual Studio Code: https://code.visualstudio.com/
   - With extensions: Prisma, TypeScript, ES7+ React/Redux/React-Native snippets

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd /home/prachi/Desktop/iiit_bhu_competition/

# Clone the repository
git clone https://github.com/your-username/elyx-care-chronicle.git

# Navigate to project directory
cd elyx-care-chronicle
```

### Step 2: Setup PostgreSQL Database

#### Option A: Using PostgreSQL Locally

1. **Start PostgreSQL service:**
   ```bash
   # Linux/macOS
   sudo service postgresql start
   # or
   brew services start postgresql

   # Windows (if installed as service)
   net start postgresql
   ```

2. **Create database and user:**
   ```bash
   # Access PostgreSQL shell
   sudo -u postgres psql
   # or on Windows/macOS
   psql -U postgres
   ```

   ```sql
   -- Create database
   CREATE DATABASE elyx_care_chronicle;
   
   -- Create user (optional, for security)
   CREATE USER elyx_user WITH PASSWORD 'your_secure_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE elyx_care_chronicle TO elyx_user;
   
   -- Exit PostgreSQL shell
   \q
   ```

#### Option B: Using Docker (Alternative)

```bash
# Run PostgreSQL in Docker
docker run --name elyx-postgres \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e POSTGRES_DB=elyx_care_chronicle \
  -p 5432:5432 \
  -d postgres:14
```

### Step 3: Setup Backend (Port 3001)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install express cors dotenv @prisma/client prisma
npm install -D @types/node @types/express @types/cors typescript ts-node nodemon

# Create environment file
touch .env
```

#### Configure Backend Environment Variables

Edit `backend/.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:your_secure_password@localhost:5432/elyx_care_chronicle"

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT (for future authentication)
JWT_SECRET=your_jwt_secret_key_here

# CORS Settings
CORS_ORIGIN=http://localhost:3000
```

#### Install Backend Dependencies & Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### Step 4: Setup Frontend (Port 3000)

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install next react react-dom
npm install -D @types/react @types/node typescript
```

#### Configure Frontend Environment Variables

Create `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="Elyx Care Chronicle"

# Database (for direct access if needed)
DATABASE_URL="postgresql://postgres:your_secure_password@localhost:5432/elyx_care_chronicle"
```

## 🗄️ Database Setup

### Database Models

The project uses Prisma ORM with these main models:

- **Member**: Patient/healthcare member information
- **HealthMetric**: Health measurements and vitals  
- **Episode**: Healthcare episodes and care events
- **Conversation**: Communication between members and care team
- **Message**: Individual messages within conversations
- **TeamMember**: Healthcare team members

### Database Commands

```bash
# View database in browser GUI
npx prisma studio
# Opens at http://localhost:5555

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

## 🏃‍♂️ Running the Application

### Start Backend Server (Terminal 1)

```bash
# In backend directory
cd backend

# Development mode (with auto-reload)
npm run dev

# The backend will start at: http://localhost:3001
```

**Backend Console Output:**
```
🚀 ================================
🏥 Elyx Care Chronicle API Started!
📍 Server: http://localhost:3001
💚 Health: http://localhost:3001/health
🗄️  Database: http://localhost:3001/api/test-db
👥 Members Full: http://localhost:3001/api/members/full
📊 Analytics: http://localhost:3001/api/analytics/overview
🚀 ================================
```

### Start Frontend Application (Terminal 2)

```bash
# In frontend directory (new terminal)
cd frontend

# Development mode
npm run dev

# The frontend will start at: http://localhost:3000
```

### Verify Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3001/health
   ```
   Expected Response:
   ```json
   {
     "status": "ok",
     "message": "Elyx Care Chronicle API is running! 🚀",
     "timestamp": "2024-01-20T10:30:00.000Z",
     "port": "3001"
   }
   ```

2. **Database Connection:**
   ```bash
   curl http://localhost:3001/api/test-db
   ```
   Expected Response:
   ```json
   {
     "success": true,
     "message": "Database connected successfully! ✅",
     "memberCount": 0,
     "totalTables": 6
   }
   ```

3. **API Documentation:**
   ```bash
   curl http://localhost:3001/
   ```

4. **Frontend:** Open `http://localhost:3000` in your browser

## 📡 API Documentation

### Base URL: `http://localhost:3001`

### Health & Diagnostics

#### Get API Health Status
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "message": "Elyx Care Chronicle API is running! 🚀",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "port": "3001"
}
```

#### Test Database Connection
```http
GET /api/test-db
```
**Response:**
```json
{
  "success": true,
  "message": "Database connected successfully! ✅",
  "memberCount": 15,
  "totalTables": 6
}
```

#### Get API Documentation
```http
GET /
```
**Response:** Complete API endpoint documentation

### Member Management

#### Get All Members (Basic Info)
```http
GET /api/members
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "member_123",
      "name": "John Doe",
      "email": "john@example.com",
      "dateOfBirth": "1990-01-15",
      "planAdherence": 85,
      "engagementLevel": "high",
      "lastActive": "2024-01-20T09:00:00.000Z"
    }
  ],
  "count": 20
}
```

#### Get All Members (Complete Healthcare Data)
```http
GET /api/members/full
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "member_123",
      "name": "John Doe",
      "email": "john@example.com",
      "healthMetrics": [
        {
          "id": "metric_456",
          "type": "blood_pressure",
          "value": "120/80",
          "timestamp": "2024-01-20T08:00:00.000Z"
        }
      ],
      "episodes": [
        {
          "id": "episode_789",
          "title": "Hypertension Management",
          "status": "in_progress",
          "priority": "medium"
        }
      ],
      "conversations": [
        {
          "id": "conv_101",
          "subject": "Blood Pressure Questions",
          "status": "active",
          "messages": [
            {
              "id": "msg_202",
              "content": "How often should I check my BP?",
              "senderRole": "member",
              "timestamp": "2024-01-20T07:30:00.000Z"
            }
          ]
        }
      ],
      "insights": {
        "totalHealthMetrics": 25,
        "activeEpisodes": 2,
        "activeConversations": 1,
        "riskLevel": "low"
      }
    }
  ],
  "count": 15,
  "summary": {
    "totalMembers": 15,
    "highEngagement": 8,
    "lowAdherence": 3,
    "activeEpisodes": 12
  }
}
```

#### Get Specific Member Profile
```http
GET /api/members/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "member_123",
    "name": "John Doe",
    "email": "john@example.com",
    "analytics": {
      "healthTrends": {
        "totalMetrics": 25,
        "recentMetrics": [...],
        "metricTypes": ["blood_pressure", "weight", "heart_rate"],
        "lastRecordedDate": "2024-01-20T08:00:00.000Z"
      },
      "careJourney": {
        "totalEpisodes": 5,
        "activeEpisodes": [...],
        "resolvedEpisodes": [...],
        "averageEpisodeDuration": 14.5
      },
      "communication": {
        "totalConversations": 3,
        "activeConversations": [...],
        "totalMessages": 45,
        "unreadMessages": 2,
        "averageResponseTime": "< 30 minutes"
      },
      "healthStatus": {
        "riskLevel": "low",
        "adherenceScore": 85,
        "engagementLevel": "high",
        "daysSinceLastActive": 1
      }
    }
  }
}
```

#### Get Member Dashboard
```http
GET /api/members/:id/dashboard
```
**Response:**
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "member_123",
      "name": "John Doe",
      "engagementLevel": "high",
      "planAdherence": 85
    },
    "quickStats": {
      "activeEpisodes": 2,
      "unreadMessages": 3,
      "recentMetrics": [...],
      "nextGoals": [...]
    },
    "alerts": {
      "lowAdherence": false,
      "inactiveUser": false,
      "urgentEpisodes": 0
    },
    "recentActivity": {
      "lastMetric": {...},
      "activeConversations": 1,
      "currentConditions": ["Hypertension"],
      "medications": ["Lisinopril 10mg"]
    }
  }
}
```

#### Create New Member
```http
POST /api/members
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "dateOfBirth": "1985-06-20",
  "phone": "+1234567890"
}
```

#### Update Member
```http
PUT /api/members/:id
Content-Type: application/json

{
  "planAdherence": 90,
  "engagementLevel": "very_high"
}
```

#### Delete Member
```http
DELETE /api/members/:id
```

### Health Metrics

#### Get All Health Metrics
```http
GET /api/health-metrics
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "metric_456",
      "memberId": "member_123",
      "type": "blood_pressure",
      "value": "120/80",
      "unit": "mmHg",
      "timestamp": "2024-01-20T08:00:00.000Z",
      "member": {
        "id": "member_123",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 50
}
```

#### Get Member's Health Metrics
```http
GET /api/members/:id/health-metrics?type=blood_pressure&limit=10
```

#### Create Health Metric
```http
POST /api/health-metrics
Content-Type: application/json

{
  "memberId": "member_123",
  "type": "weight",
  "value": "75.5",
  "unit": "kg"
}
```

#### Delete Health Metric
```http
DELETE /api/health-metrics/:id
```

### Episodes

#### Get All Episodes
```http
GET /api/episodes
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "episode_789",
      "memberId": "member_123",
      "title": "Hypertension Management",
      "description": "Ongoing management of high blood pressure",
      "status": "in_progress",
      "priority": "medium",
      "startDate": "2024-01-15T00:00:00.000Z",
      "member": {
        "id": "member_123",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 20
}
```

#### Get Member's Episodes
```http
GET /api/members/:id/episodes
```

### Conversations & Messages

#### Get All Conversations
```http
GET /api/conversations
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv_101",
      "memberId": "member_123",
      "subject": "Blood Pressure Questions",
      "status": "active",
      "priority": "medium",
      "createdAt": "2024-01-19T10:00:00.000Z",
      "updatedAt": "2024-01-20T07:30:00.000Z",
      "member": {
        "id": "member_123",
        "name": "John Doe",
        "email": "john@example.com",
        "profileImage": "https://example.com/avatar.jpg"
      },
      "messages": [
        {
          "id": "msg_202",
          "content": "How often should I check my BP?",
          "senderRole": "member",
          "timestamp": "2024-01-20T07:30:00.000Z"
        }
      ]
    }
  ],
  "count": 20
}
```

#### Get Conversation Details
```http
GET /api/conversations/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "conv_101",
    "subject": "Blood Pressure Questions",
    "member": {...},
    "messages": [
      {
        "id": "msg_202",
        "content": "How often should I check my BP?",
        "senderRole": "member",
        "senderName": "John Doe",
        "timestamp": "2024-01-20T07:30:00.000Z",
        "isRead": true
      },
      {
        "id": "msg_203",
        "content": "I recommend checking twice daily.",
        "senderRole": "care_coordinator",
        "senderName": "Dr. Smith",
        "timestamp": "2024-01-20T08:00:00.000Z",
        "isRead": false
      }
    ]
  }
}
```

### Healthcare Team

#### Get Team Members
```http
GET /api/team-members
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team_001",
      "name": "Dr. Sarah Johnson",
      "role": "care_coordinator",
      "department": "Cardiology",
      "specialization": "Hypertension",
      "email": "dr.johnson@clinic.com",
      "isActive": true
    }
  ],
  "count": 12
}
```

### Analytics & Reporting

#### Get System Overview Analytics
```http
GET /api/analytics/overview
```
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalMembers": 150,
      "totalHealthMetrics": 2450,
      "totalEpisodes": 320,
      "totalConversations": 180,
      "activeMembers": 135,
      "highRiskMembers": 12,
      "memberRetentionRate": "90.0"
    },
    "recentActivity": [
      {
        "id": "metric_latest",
        "type": "blood_pressure",
        "value": "130/85",
        "timestamp": "2024-01-20T09:00:00.000Z",
        "member": {
          "name": "John Doe"
        }
      }
    ],
    "alerts": {
      "highRiskMembers": 12,
      "inactiveMembers": 15,
      "urgentEpisodes": 3
    }
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Test connection directly
psql -U postgres -h localhost -p 5432 -d elyx_care_chronicle
```

#### 2. Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in backend/.env
PORT=3002
```

#### 3. CORS Issues
Ensure your frontend environment variables match:
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# backend/.env
CORS_ORIGIN=http://localhost:3000
```

#### 4. Prisma Client Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database if needed
npx prisma migrate reset
```

### API Testing Commands

```bash
# Test all main endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/test-db
curl http://localhost:3001/api/members
curl http://localhost:3001/api/members/full
curl http://localhost:3001/api/analytics/overview

# Test with JSON response formatting
curl -s http://localhost:3001/api/members | json_pp
```

## ⚡ Development Commands

### Backend Development
```bash
cd backend

# Start development server with auto-reload
npm run dev

# View database in browser
npx prisma studio

# Reset and seed database
npx prisma migrate reset
npx prisma db seed
```

### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build
npm start
PORT=3001 npm start
```

### Database Management
```bash
# View all tables
npx prisma studio

# Generate new migration
npx prisma migrate dev --name add_new_feature

# Push schema changes without migration
npx prisma db push

# View database logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🚀 Quick Start Commands:**

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend  
cd frontend && npm run dev
PORT=3001 npm start

# Terminal 3: View Database
cd backend && npx prisma studio
```

**📍 Important URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health
- Database GUI: http://localhost:5555
- Full Members Data: http://localhost:3001/api/members/full
- Analytics: http://localhost:3001/api/analytics/overview

**Need Help?** Check the troubleshooting section or open an issue on GitHub.

Happy coding! 🚀
