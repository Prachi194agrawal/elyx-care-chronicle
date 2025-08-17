#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/kill-all.sh

echo "🔨 Force killing all Elyx Care Chronicle processes..."

# Kill specific PID if provided
if [ "$1" ]; then
    echo "🎯 Killing specific PID: $1"
    kill -9 $1 2>/dev/null || true
fi

# Kill the exact process you mentioned
kill -9 168061 2>/dev/null || true

# Kill all processes on ports 3000 and 3001
for port in 3000 3001; do
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "🔨 Force killing all processes on port $port"
        echo "$pids" | xargs kill -9 2>/dev/null || true
    fi
done

# Kill all node processes containing our project path
ps aux | grep -E "elyx-care-chronicle.*ts-node" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Kill all npm processes in project directory
ps aux | grep -E "npm.*(dev|start)" | grep elyx-care-chronicle | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

echo "✅ All processes killed. Checking ports..."

# Verify ports are free
for port in 3000 3001; do
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "❌ Port $port still in use!"
        lsof -ti:$port
    else
        echo "✅ Port $port is free"
    fi
done

echo "🚀 Ready to start fresh!"