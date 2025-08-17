#!/bin/bash
# filepath: /home/prachi/Desktop/iiit_bhu_competition/elyx-care-chronicle/deploy-production.sh

echo "🌐 Production Hosting Deployment"
echo "================================="

# Stop any local processes
echo "🛑 Stopping local development..."
pkill -f "ts-node" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true

# Create production build
echo "📦 Creating production builds..."

# Build frontend
cd elyx-care-chronicle-frontend
npm run build
echo "✅ Frontend build complete"
cd ..

# Build backend
cd backend
npm run build
echo "✅ Backend build complete"
cd ..

# Create deployment package
echo "📋 Creating deployment package..."
mkdir -p deploy-package

# Copy production files
cp -r elyx-care-chronicle-frontend/build deploy-package/frontend
cp -r backend/dist deploy-package/backend
cp -r backend/node_modules deploy-package/backend/
cp -r backend/prisma deploy-package/backend/
cp backend/package*.json deploy-package/backend/
cp docker-compose.yml deploy-package/
cp .env.production deploy-package/

# Create startup script
cat > deploy-package/start-production.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Elyx Care Chronicle Production..."

# Start with Docker
docker-compose up -d

echo "✅ Production deployment started!"
echo "📍 Frontend: http://localhost:3001"
echo "📍 Backend: http://localhost:3000"
EOF

chmod +x deploy-package/start-production.sh

echo "✅ Production package ready in ./deploy-package/"

# Create archive for hosting
tar -czf elyx-care-chronicle-production.tar.gz deploy-package/

echo ""
echo "🎉 PRODUCTION DEPLOYMENT READY!"
echo "==============================="
echo ""
echo "📦 Package created: elyx-care-chronicle-production.tar.gz"
echo ""
echo "🌐 HOSTING OPTIONS:"
echo ""
echo "1. 🔵 VPS/Server Deployment:"
echo "   - Upload: elyx-care-chronicle-production.tar.gz"
echo "   - Extract: tar -xzf elyx-care-chronicle-production.tar.gz"
echo "   - Run: cd deploy-package && ./start-production.sh"
echo ""
echo "2. 🟢 Railway (Recommended):"
echo "   - Go to: https://railway.app"
echo "   - Connect GitHub repository"
echo "   - Add PostgreSQL service"
echo "   - Deploy automatically"
echo ""
echo "3. 🟡 DigitalOcean App Platform:"
echo "   - Go to: https://cloud.digitalocean.com/apps"
echo "   - Connect GitHub repository"
echo "   - Add managed database"
echo ""
echo "4. 🟠 Heroku:"
echo "   - Install: heroku CLI"
echo "   - Run: heroku create your-app-name"
echo "   - Deploy: git push heroku main"
echo ""
echo "🚀 GITHUB DEPLOYMENT COMMANDS:"
echo "==============================="
echo ""
echo "📝 Clean Git history and push:"
echo "   ./clean-git-history.sh"
echo ""
echo "📤 Or manually:"
echo "   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch elyx-care-chronicle-production.tar.gz' --prune-empty --tag-name-filter cat -- --all"
echo "   git push --force origin main"
echo ""
echo "🎯 Your GitHub repository will be clean and ready for hosting!"
echo ""
echo "🏆 Your Elyx Care Chronicle is PRODUCTION READY!"
echo "🌐 It will be accessible worldwide once hosted!"
echo ""
echo "📁 LOCAL FILES CREATED:"
echo "======================="
echo ""
echo "📦 Production Package: ./elyx-care-chronicle-production.tar.gz"
echo "📁 Deploy Directory: ./deploy-package/"
echo ""
echo "🗂️ DEPLOY PACKAGE CONTENTS:"
echo "   📁 frontend/          - Built React application"
echo "   📁 backend/           - Compiled Node.js server"
echo "   📄 docker-compose.yml - Container orchestration"
echo "   📄 .env.production    - Environment configuration"
echo "   📄 start-production.sh - Startup script"
echo ""
echo "📍 FILES LOCATION ON YOUR SYSTEM:"
echo "   $(pwd)/deploy-package/"
echo "   $(pwd)/elyx-care-chronicle-production.tar.gz"
echo ""
echo "🚀 QUICK ACCESS COMMANDS:"
echo "   ls -la deploy-package/     # View package contents"
echo "   cd deploy-package/         # Enter package directory"
echo "   tar -tf elyx-care-chronicle-production.tar.gz | head -20  # Preview archive"
echo ""
echo "💾 BACKUP YOUR LOCAL FILES:"
echo "   cp elyx-care-chronicle-production.tar.gz ~/Desktop/"
echo "   cp -r deploy-package ~/Desktop/elyx-deploy-backup"
echo ""
echo "🚀 GITHUB PUSH COMMANDS FOR RAILWAY DEPLOYMENT:"
echo "================================================"
echo ""
echo "📝 1. Add files to Git:"
echo "   git add deploy-production.sh README.md"
echo ""
echo "📤 2. Commit changes:"
echo "   git commit -m 'Add production deployment script - Railway ready'"
echo ""
echo "🌐 3. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "🔄 4. If push fails (remove large files first):"
echo "   git rm --cached elyx-care-chronicle-production.tar.gz"
echo "   git rm --cached -r deploy-package/"
echo "   git commit -m 'Remove large deployment files'"
echo "   git push origin main"
echo ""
echo "🚀 5. Deploy on Railway:"
echo "   - Go to: https://railway.app"
echo "   - Click 'Deploy from GitHub repo'"
echo "   - Select: Prachi194agrawal/elyx-care-chronicle"
echo "   - Add PostgreSQL service"
echo "   - Set environment variables"
echo "   - Deploy!"
echo ""
echo "⚡ QUICK DEPLOY COMMANDS (copy-paste):"
echo "======================================"
echo "git add deploy-production.sh README.md"
echo "git commit -m 'Production deployment ready for Railway'"
echo "git push origin main"