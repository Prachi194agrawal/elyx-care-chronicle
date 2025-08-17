#!/bin/bash

echo "📊 Elyx Care Chronicle System Status"
echo "=================================="
echo "🔧 Configuration: Backend (3000) + Frontend (3001)"

# Check if Docker is running
if ! docker ps >/dev/null 2>&1; then
    echo "❌ Docker is not running or accessible"
    exit 1
fi

# Check container status
echo -e "\n🐳 Container Status:"
docker-compose ps

# Check if containers are running
if [ "$(docker-compose ps -q)" ]; then
    # Check logs only if containers exist
    echo -e "\n📋 Recent Backend Logs:"
    docker-compose logs --tail=10 backend 2>/dev/null || echo "No backend container running"
    
    echo -e "\n📋 Recent Frontend Logs:"
    docker-compose logs --tail=10 frontend 2>/dev/null || echo "No frontend container running"

    # Check resource usage
    echo -e "\n💻 Resource Usage:"
    docker stats --no-stream 2>/dev/null || echo "No containers running"

    # Database status
    echo -e "\n🗄️ Database Status:"
    docker-compose exec -T postgres pg_isready -U elyx_user 2>/dev/null || echo "Database not accessible"
else
    echo "❌ No containers are running"
fi

# Check for port conflicts
echo -e "\n🔍 Port Usage Check:"
netstat -tuln | grep -E ':(3000|3001|5432)' || echo "No services running on expected ports"

# API Health (port 3000) - check if running locally
echo -e "\n🏥 Backend API Health (port 3000):"
if curl -s --connect-timeout 3 http://localhost:3000/health >/dev/null 2>&1; then
    curl -s http://localhost:3000/health | jq '.' 2>/dev/null || curl -s http://localhost:3000/health
else
    echo "Backend not responding on port 3000"
fi

# Frontend Health (port 3001)
echo -e "\n🌐 Frontend Health (port 3001):"
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 3 http://localhost:3001 2>/dev/null)
if [ "$frontend_status" = "200" ]; then
    echo "Frontend healthy (HTTP $frontend_status)"
else
    echo "Frontend not responding on port 3001 (HTTP $frontend_status)"
fi

# Test API endpoints
echo -e "\n🔌 API Endpoints Test:"
if curl -s --connect-timeout 3 http://localhost:3000/api/members >/dev/null 2>&1; then
    member_count=$(curl -s http://localhost:3000/api/members | jq '.count' 2>/dev/null)
    echo "Members API responding - Count: $member_count"
else
    echo "Members API not responding"
fi