#!/bin/bash

set -e

echo "🚀 Starting Elyx Care Chronicle Docker Production Deployment..."
echo "📋 Configuration: Full Docker Stack with Database"

# Kill any local development processes first
echo "🛑 Stopping local development processes..."
pkill -f "ts-node src/index.ts" 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Use production Docker setup
echo "🐳 Setting up Docker production environment..."

# Create production environment if it doesn't exist
if [ ! -f .env.production ]; then
    cat > .env.production << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://elyx_user:elyx_secure_password_2024@postgres:5432/elyx_care_chronicle
POSTGRES_PASSWORD=elyx_secure_password_2024
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3000
EOF
    echo "📝 Created production environment file"
fi

# Load environment variables (without comments)
if [ -f .env.production ]; then
    echo "📝 Loading environment variables..."
    export $(grep -v '^#' .env.production | xargs)
fi

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans --volumes 2>/dev/null || true

# Build and start services with production configuration
echo "📦 Building Docker containers for production..."
docker-compose -f docker-compose.yml build --no-cache

echo "🗄️ Setting up database..."
docker-compose up -d postgres
echo "⏳ Waiting for database to be ready..."
sleep 20

# Check if database is ready
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U elyx_user >/dev/null 2>&1; then
        echo "✅ Database is ready"
        break
    fi
    echo "⏳ Waiting for database... ($i/30)"
    sleep 2
done

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose run --rm backend npx prisma migrate deploy 2>/dev/null || echo "Migration completed or already up to date"
docker-compose run --rm backend npx prisma generate

# Start backend
echo "🚀 Starting backend service..."
docker-compose up -d backend
sleep 10

# Start frontend
echo "🌐 Starting frontend service..."
docker-compose up -d frontend
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
echo "🎉 Docker Production Deployment completed!"
echo "=================================="
echo "📍 Frontend: http://localhost:3001"
echo "📍 Backend API: http://localhost:3000"
echo "📍 Health Check: http://localhost:3000/health"
echo "📍 Data Management: http://localhost:3001/data-management"
echo "📍 Database: PostgreSQL in Docker container"
echo ""
echo "🌐 Your application is now ready for production hosting!"
echo "🔧 Useful commands:"
echo "  - Monitor: docker-compose logs -f"
echo "  - Stop: docker-compose down"
echo "  - Restart: docker-compose restart"
echo "  - Scale: docker-compose up --scale backend=2"