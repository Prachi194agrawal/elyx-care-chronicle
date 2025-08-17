#!/bin/bash

echo "🐳 Checking Docker PostgreSQL Setup..."

# List all running containers
echo "📋 Running Docker containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"

echo ""

# Check for PostgreSQL containers specifically
POSTGRES_CONTAINERS=$(docker ps --filter "ancestor=postgres" --format "{{.Names}}")
if [ -z "$POSTGRES_CONTAINERS" ]; then
    echo "🔍 No PostgreSQL containers found. Checking for containers with port 5432..."
    POSTGRES_CONTAINERS=$(docker ps --filter "publish=5432" --format "{{.Names}}")
fi

if [ -z "$POSTGRES_CONTAINERS" ]; then
    echo "❌ No PostgreSQL containers found running on port 5432"
    echo ""
    echo "🚀 To start a PostgreSQL container:"
    echo "   docker run --name elyx-postgres -e POSTGRES_PASSWORD=elyx_secure_password_2024 -p 5432:5432 -d postgres:15"
    echo ""
    echo "🔄 Or if you have an existing container:"
    echo "   docker start <container-name>"
else
    echo "✅ PostgreSQL container(s) found:"
    for container in $POSTGRES_CONTAINERS; do
        echo "   - $container"
        echo "     Status: $(docker inspect -f '{{.State.Status}}' $container)"
        echo "     Health: $(docker exec $container pg_isready 2>/dev/null && echo 'Ready' || echo 'Not ready')"
        
        # Get container details
        echo "     Image: $(docker inspect -f '{{.Config.Image}}' $container)"
        echo "     Ports: $(docker port $container 2>/dev/null || echo 'No ports exposed')"
    done
fi

echo ""
echo "🔧 To connect to your PostgreSQL container:"
echo "   docker exec -it backend_postgres_1 psql -U postgres"
echo ""
echo "🗄️ Your detected container: backend_postgres_1"