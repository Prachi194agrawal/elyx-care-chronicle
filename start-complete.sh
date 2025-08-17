#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/start-complete.sh

echo "🚀 Starting Complete Elyx Care Chronicle System..."

# Fix deployment first
./fix-deployment.sh

echo ""
echo "🔄 Starting services..."

# Read the database URL from the generated config
source backend/.env.local

# Navigate to backend and start it
echo "🚀 Starting backend..."
cd backend
export DATABASE_URL="$DATABASE_URL"

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed. Trying with generation only..."
    npx prisma generate
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 10

# Start frontend
echo "🌐 Starting frontend..."
cd ../elyx-care-chronicle-frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Complete system started!"
echo "📍 Frontend: http://localhost:3001"
echo "📍 Backend: http://localhost:3000"
echo "📍 Data Management: http://localhost:3001/data-management"
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT
wait