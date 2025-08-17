#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/fix-port-conflict.sh

echo "🔧 Fixing Port 3000 Conflict Issue..."

echo "🔍 Current processes on port 3000:"
lsof -i:3000 2>/dev/null || echo "No processes found"

echo ""
echo "🔍 All elyx-care-chronicle related processes:"
ps aux | grep -E "(elyx-care-chronicle|ts-node.*index\.ts)" | grep -v grep || echo "No processes found"

echo ""
echo "🛑 Killing ALL backend processes..."

# Method 1: Kill by port
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Method 2: Kill by process name pattern
pkill -f "ts-node src/index.ts" 2>/dev/null || true
pkill -f "elyx-care-chronicle.*ts-node" 2>/dev/null || true

# Method 3: Kill specific PID mentioned in error
kill -9 170149 2>/dev/null || true

# Method 4: Kill all nodemon processes
pkill -f "nodemon" 2>/dev/null || true

# Method 5: Kill all npm run dev processes
pgrep -f "npm run dev" | xargs kill -9 2>/dev/null || true

echo "⏳ Waiting for processes to terminate..."
sleep 5

# Verify port is free
if lsof -i:3000 >/dev/null 2>&1; then
    echo "❌ Port 3000 still in use. Showing remaining processes:"
    lsof -i:3000
    echo ""
    echo "🔨 Force killing remaining processes..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Final check
if lsof -i:3000 >/dev/null 2>&1; then
    echo "❌ CRITICAL: Cannot free port 3000!"
    echo "Manual intervention required:"
    lsof -i:3000
    exit 1
else
    echo "✅ Port 3000 is now free!"
fi

echo ""
echo "🚀 Ready to start backend cleanly"
echo "Run: cd backend && npm run dev"