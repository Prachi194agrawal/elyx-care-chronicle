#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/stop-dev.sh

echo "🛑 Stopping Elyx Care Chronicle Development Servers..."

# Function to kill process on port
kill_port() {
    local port=$1
    local service=$2
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🔄 Stopping $service on port $port (PID: $pid)"
        kill -15 $pid 2>/dev/null || kill -9 $pid 2>/dev/null || true
        sleep 2
        
        # Check if process is still running
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "⚠️  Force killing $service..."
            kill -9 $pid 2>/dev/null || true
        else
            echo "✅ $service stopped"
        fi
    else
        echo "ℹ️  No $service running on port $port"
    fi
}

# Stop backend on port 3000
kill_port 3000 "Backend"

# Stop frontend on port 3001
kill_port 3001 "Frontend"

echo "✅ All development servers stopped"