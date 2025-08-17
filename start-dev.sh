#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/start-dev.sh

echo "🚀 Starting Elyx Care Chronicle (Development Mode)..."

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🔄 Killing existing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
        sleep 2
    fi
}

# Check and handle existing processes
if check_port 3000; then
    echo "⚠️  Port 3000 is already in use"
    read -p "Do you want to kill the existing process and restart? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill_port 3000
    else
        echo "❌ Cannot start backend on port 3000. Exiting..."
        exit 1
    fi
fi

if check_port 3001; then
    echo "⚠️  Port 3001 is already in use"
    read -p "Do you want to kill the existing process and restart? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill_port 3001
    else
        echo "❌ Cannot start frontend on port 3001. Exiting..."
        exit 1
    fi
fi

# Use your specific PostgreSQL container
POSTGRES_CONTAINER="backend_postgres_1"

echo "🐳 Using PostgreSQL container: $POSTGRES_CONTAINER"

# Check if the container is running
if ! docker ps --format "{{.Names}}" | grep -q "^$POSTGRES_CONTAINER$"; then
    echo "❌ Container $POSTGRES_CONTAINER is not running"
    echo "🔄 Starting container..."
    docker start $POSTGRES_CONTAINER
    sleep 5
fi

# Check if we can connect to PostgreSQL
if docker exec $POSTGRES_CONTAINER pg_isready >/dev/null 2>&1; then
    echo "✅ PostgreSQL container is ready"
else
    echo "⏳ Waiting for PostgreSQL container to be ready..."
    sleep 5
fi

# Setup database and user if needed
echo "🗄️ Setting up database..."
docker exec $POSTGRES_CONTAINER psql -U postgres -c "CREATE DATABASE elyx_care_chronicle;" 2>/dev/null || echo "Database already exists"
docker exec $POSTGRES_CONTAINER psql -U postgres -c "CREATE USER elyx_user WITH PASSWORD 'elyx_secure_password_2024';" 2>/dev/null || echo "User already exists"
docker exec $POSTGRES_CONTAINER psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE elyx_care_chronicle TO elyx_user;" 2>/dev/null || echo "Privileges already granted"
docker exec $POSTGRES_CONTAINER psql -U postgres -c "ALTER USER elyx_user CREATEDB;" 2>/dev/null || echo "User already has CREATEDB privilege"

# Update database URL for Docker PostgreSQL
export DATABASE_URL="postgresql://elyx_user:elyx_secure_password_2024@localhost:5432/elyx_care_chronicle"

echo "🗄️ Running database migrations..."
cd backend
npx prisma migrate deploy 2>/dev/null || echo "Migrations up to date"
npx prisma generate

echo "🚀 Starting backend (port 3000)..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
for i in {1..10}; do
    if curl -f --connect-timeout 3 http://localhost:3000/health >/dev/null 2>&1; then
        echo "✅ Backend is running and healthy"
        break
    fi
    echo "   Checking backend... ($i/10)"
    sleep 3
done

echo "🌐 Starting frontend (port 3001)..."
cd ../elyx-care-chronicle-frontend
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
for i in {1..10}; do
    if curl -f --connect-timeout 3 http://localhost:3001 >/dev/null 2>&1; then
        echo "✅ Frontend is running and healthy"
        break
    fi
    echo "   Checking frontend... ($i/10)"
    sleep 3
done

echo ""
echo "🎉 Development servers started successfully!"
echo "=================================="
echo "📍 Frontend: http://localhost:3001"
echo "📍 Backend API: http://localhost:3000"
echo "📍 Data Management: http://localhost:3001/data-management"
echo "📍 PostgreSQL: Docker container '$POSTGRES_CONTAINER'"
echo "📊 Health Check: http://localhost:3000/health"
echo "📊 API Test: http://localhost:3000/api/members"
echo ""
echo "Press Ctrl+C to stop both servers"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo "✅ Servers stopped"
    exit 0
}

# Wait for Ctrl+C
trap cleanup INT
wait