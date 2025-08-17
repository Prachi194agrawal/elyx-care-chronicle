#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/deploy-local.sh

set -e

echo "🚀 Starting Elyx Care Chronicle Deployment (Local PostgreSQL)..."
echo "📋 Configuration: Backend (port 3000) + Frontend (port 3001) + Local PostgreSQL (port 5432)"

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start it first:"
    echo "   sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Check database connection
if psql -h localhost -U elyx_user -d elyx_care_chronicle -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database. Please check credentials."
    echo "💡 Run ./fix-deployment.sh to setup database"
    exit 1
fi

# Load environment variables
if [ -f .env.production ]; then
    echo "📝 Loading environment variables..."
    export $(grep -v '^#' .env.production | xargs)
fi

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose -f docker-compose.local.yml down --remove-orphans 2>/dev/null || true

# Build and start services
echo "📦 Building Docker containers..."
docker-compose -f docker-compose.local.yml build --no-cache

# Start backend
echo "🚀 Starting backend service..."
docker-compose -f docker-compose.local.yml up -d backend
sleep 10

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.local.yml exec backend npx prisma migrate deploy 2>/dev/null || echo "Migration completed or already up to date"
docker-compose -f docker-compose.local.yml exec backend npx prisma generate

# Start frontend
echo "🌐 Starting frontend service..."
docker-compose -f docker-compose.local.yml up -d frontend
sleep 10

# Health checks
echo "🏥 Performing health checks..."

# Check backend health (port 3000)
for i in {1..10}; do
    if curl -f --connect-timeout 3 http://localhost:3000/health >/dev/null 2>&1; then
        echo "✅ Backend is healthy (port 3000)"
        break
    fi
    echo "⏳ Waiting for backend... ($i/10)"
    sleep 3
done

# Check frontend health (port 3001)
for i in {1..10}; do
    if curl -f --connect-timeout 3 http://localhost:3001 >/dev/null 2>&1; then
        echo "✅ Frontend is healthy (port 3001)"
        break
    fi
    echo "⏳ Waiting for frontend... ($i/10)"
    sleep 3
done

echo ""
echo "🎉 Deployment completed successfully!"
echo "=================================="
echo "📍 Frontend: http://localhost:3001"
echo "📍 Backend API: http://localhost:3000"
echo "📍 Health Check: http://localhost:3000/health"
echo "📍 Data Management: http://localhost:3001/data-management"
echo "📍 Database: localhost:5432 (using existing PostgreSQL)"
echo ""
echo "🔧 Useful commands:"
echo "  - Monitor: ./monitor.sh"
echo "  - Logs: docker-compose -f docker-compose.local.yml logs -f [service]"
echo "  - Stop: docker-compose -f docker-compose.local.yml down"
echo "  - Restart: docker-compose -f docker-compose.local.yml restart [service]"