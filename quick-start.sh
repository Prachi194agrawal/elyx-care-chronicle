#!/bin/bash

echo "⚡ Elyx Care Chronicle - Quick Start"

# Check if your specific PostgreSQL container is running
if docker ps --format "{{.Names}}" | grep -q "backend_postgres_1"; then
    echo "✅ PostgreSQL Docker container detected: backend_postgres_1"
    chmod +x start-dev.sh
    ./start-dev.sh
elif docker ps --filter "publish=5432" --format "{{.Names}}" | head -n1 >/dev/null 2>&1; then
    echo "✅ Other PostgreSQL Docker container detected"
    chmod +x start-dev.sh
    ./start-dev.sh
else
    echo "❌ No PostgreSQL found. Let's start your container..."
    echo "🐳 Starting backend_postgres_1 container..."
    
    if docker ps -a --format "{{.Names}}" | grep -q "backend_postgres_1"; then
        echo "🔄 Container exists, starting it..."
        docker start backend_postgres_1
    else
        echo "🚀 Creating new PostgreSQL container..."
        docker run --name backend_postgres_1 \
            -e POSTGRES_PASSWORD=elyx_secure_password_2024 \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_DB=postgres \
            -p 5432:5432 \
            -d postgres:15
    fi
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
    
    echo "🚀 Starting application..."
    chmod +x start-dev.sh
    ./start-dev.sh
fi