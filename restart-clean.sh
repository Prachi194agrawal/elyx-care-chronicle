#!/bin/bash
// filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/restart-clean.sh

echo "🔄 Clean Restart of Elyx Care Chronicle..."

# Kill all node processes related to the project - more aggressive approach
echo "🛑 Stopping all related processes..."
pkill -f "ts-node src/index.ts" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "elyx-care-chronicle" 2>/dev/null || true

# Kill by port - more thorough
for port in 3000 3001; do
    echo "🔄 Checking port $port..."
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "🔄 Found processes on port $port: $pids"
        # Try graceful kill first
        echo "$pids" | xargs kill -15 2>/dev/null || true
        sleep 2
        # Force kill if still running
        pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo "🔨 Force killing processes on port $port: $pids"
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    fi
done

# Extra check - kill any remaining node processes in the project directory
echo "🧹 Final cleanup of project processes..."
ps aux | grep -E "(elyx-care-chronicle|ts-node.*index\.ts)" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

sleep 5

# Verify ports are free
echo "🔍 Checking port availability..."
for port in 3000 3001; do
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "❌ Port $port still in use!"
        lsof -ti:$port | head -5
    else
        echo "✅ Port $port is free"
    fi
done

# Start backend
echo "🚀 Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend
echo "⏳ Waiting for backend to start..."
for i in {1..15}; do
    if curl -f --connect-timeout 2 http://localhost:3000/health >/dev/null 2>&1; then
        echo "✅ Backend is running!"
        break
    fi
    echo "   Checking backend... ($i/15)"
    sleep 2
done

# Start frontend
echo "🌐 Starting frontend..."
cd ../elyx-care-chronicle-frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Clean restart completed!"
echo "📍 Frontend: http://localhost:3001"
echo "📍 Backend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    pkill -f "ts-node src/index.ts" 2>/dev/null || true
    pkill -f "npm" 2>/dev/null || true
    exit 0
}

trap cleanup INT
wait