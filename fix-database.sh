#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/fix-database.sh

echo "🔧 Fixing Database Authentication Issues..."

# Find PostgreSQL container
POSTGRES_CONTAINER=$(docker ps --filter "name=postgres" --format "{{.Names}}" | head -n1)

if [ -z "$POSTGRES_CONTAINER" ]; then
    POSTGRES_CONTAINER=$(docker ps --filter "ancestor=postgres" --format "{{.Names}}" | head -n1)
fi

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "❌ No PostgreSQL container found!"
    echo "🚀 Starting new PostgreSQL container..."
    
    docker run --name elyx-postgres \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=elyx_secure_password_2024 \
        -e POSTGRES_DB=elyx_care_chronicle \
        -p 5432:5432 \
        -d postgres:15
    
    POSTGRES_CONTAINER="elyx-postgres"
    sleep 10
fi

echo "🐳 Using PostgreSQL container: $POSTGRES_CONTAINER"

# Reset database and user
echo "🗄️ Resetting database and user..."
docker exec $POSTGRES_CONTAINER psql -U postgres -c "DROP DATABASE IF EXISTS elyx_care_chronicle;" 2>/dev/null || true
docker exec $POSTGRES_CONTAINER psql -U postgres -c "DROP USER IF EXISTS elyx_user;" 2>/dev/null || true

# Create fresh database and user
docker exec $POSTGRES_CONTAINER psql -U postgres -c "CREATE USER elyx_user WITH PASSWORD 'elyx_secure_password_2024';"
docker exec $POSTGRES_CONTAINER psql -U postgres -c "ALTER USER elyx_user CREATEDB;"
docker exec $POSTGRES_CONTAINER psql -U postgres -c "CREATE DATABASE elyx_care_chronicle OWNER elyx_user;"
docker exec $POSTGRES_CONTAINER psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE elyx_care_chronicle TO elyx_user;"

# Test connection
echo "🔍 Testing database connection..."
if docker exec $POSTGRES_CONTAINER psql -U elyx_user -d elyx_care_chronicle -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed. Using postgres user instead..."
    
    # Fallback to postgres user
    cat > backend/.env.local << EOF
DATABASE_URL=postgresql://postgres:elyx_secure_password_2024@localhost:5432/elyx_care_chronicle
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3001,http://127.0.0.1:3001
EOF
    
    # Ensure database exists for postgres user
    docker exec $POSTGRES_CONTAINER psql -U postgres -c "CREATE DATABASE elyx_care_chronicle;" 2>/dev/null || true
    
    export DATABASE_URL="postgresql://postgres:elyx_secure_password_2024@localhost:5432/elyx_care_chronicle"
fi

# Update backend environment
cat > backend/.env.local << EOF
DATABASE_URL=postgresql://elyx_user:elyx_secure_password_2024@localhost:5432/elyx_care_chronicle
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3001,http://127.0.0.1:3001
EOF

echo ""
echo "✅ Database fixed! Now restart your backend:"
echo "   cd backend"
echo "   export DATABASE_URL=postgresql://elyx_user:elyx_secure_password_2024@localhost:5432/elyx_care_chronicle"
echo "   npx prisma migrate deploy"
echo "   npm run dev"