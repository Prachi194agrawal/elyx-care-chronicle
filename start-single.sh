#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/start-single.sh

echo "🚀 Starting Single Instance Mode..."

# Fix port conflicts first
./fix-port-conflict.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "🎯 Starting backend in single instance mode..."
    cd backend
    
    # Create a PID file to track our process
    echo $$ > .backend.pid
    
    # Start backend
    npm run dev &
    BACKEND_PID=$!
    echo $BACKEND_PID > .backend.pid
    
    echo "✅ Backend started with PID: $BACKEND_PID"
    echo "📍 Backend: http://localhost:3000"
    echo "📊 Health: http://localhost:3000/health"
    
    # Monitor backend
    trap "echo '🛑 Stopping backend...'; kill $BACKEND_PID 2>/dev/null; rm -f .backend.pid; exit 0" INT
    
    wait $BACKEND_PID
else
    echo "❌ Cannot start due to port conflicts"
    exit 1
fi