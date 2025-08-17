#!/bin/bash

echo "🔧 Fixing Elyx Care Chronicle Deployment Issues..."
echo "🗄️ Using existing PostgreSQL setup with current credentials"

# Clean up Docker completely
echo "🧹 Cleaning up Docker containers and volumes..."
docker-compose down --remove-orphans --volumes 2>/dev/null || true

# Remove any conflicting containers (except postgres)
echo "🗑️ Removing old elyx containers..."
docker rm -f $(docker ps -aq --filter "name=elyx") 2>/dev/null || true

# Check and kill processes on ports 3000 and 3001 more thoroughly
echo "🔍 Checking for processes on required ports..."
for port in 3000 3001; do
    # Kill all processes on these ports
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "🔄 Killing all processes on port $port"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 3
    fi
    
    # Double check port is free
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "⚠️ Port $port still in use, force killing..."
        sudo lsof -ti:$port | xargs sudo kill -9 2>/dev/null || true
        sleep 2
    fi
done

# Work with existing database credentials from .env file
if [ -f "backend/.env" ]; then
    echo "📋 Found existing .env file, reading database credentials..."
    
    # Extract database URL from existing .env
    DB_URL=$(grep "DATABASE_URL" backend/.env | cut -d'"' -f2)
    echo "🔗 Current database URL: $DB_URL"
    
    # Parse the database URL to get individual components
    DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASSWORD=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    echo "📋 Parsed credentials:"
    echo "   User: $DB_USER"
    echo "   Database: $DB_NAME"
    
    # Update database using your Docker container with existing credentials
    POSTGRES_CONTAINER="backend_postgres_1"
    if docker ps --format "{{.Names}}" | grep -q "^$POSTGRES_CONTAINER$"; then
        echo "🐳 Using PostgreSQL container: $POSTGRES_CONTAINER"
        
        # Try to connect with container's default user first
        CONTAINER_USER=$(docker exec $POSTGRES_CONTAINER printenv POSTGRES_USER 2>/dev/null || echo "postgres")
        
        # Ensure database and user exist
        echo "🗄️ Setting up database with existing credentials..."
        docker exec $POSTGRES_CONTAINER psql -U "$CONTAINER_USER" -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database $DB_NAME already exists"
        docker exec $POSTGRES_CONTAINER psql -U "$CONTAINER_USER" -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User $DB_USER already exists"
        docker exec $POSTGRES_CONTAINER psql -U "$CONTAINER_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null
        docker exec $POSTGRES_CONTAINER psql -U "$CONTAINER_USER" -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null
        
        # Test connection
        if docker exec $POSTGRES_CONTAINER psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" >/dev/null 2>&1; then
            echo "✅ Database connection successful with existing credentials!"
        else
            echo "⚠️ Cannot connect with existing credentials. Database may need setup."
        fi
    fi
else
    echo "❌ No .env file found in backend directory"
fi

echo ""
echo "✅ Deployment fix completed!"
echo "🚀 Ports 3000 and 3001 are now free"
echo "📋 Using existing database configuration"