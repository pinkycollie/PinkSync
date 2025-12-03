# PinkSync Quick Reference Guide

> **Quick commands and references for PinkSync developers**

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync

# Start development server
deno task dev

# Open in browser
open http://localhost:8000
```

---

## 📦 Branch Quick Access

### Checkout Specific Feature Branch
```bash
# VCode Platform (AI + Video)
git checkout -b vcode origin/vcode

# 360 Magicians (Business Platform)
git checkout -b integrated-360-Magicians origin/integrated-360-Magicians

# QR Code & Holograms
git checkout -b QR-Code-Holograms origin/QR-Code-Holograms

# Video Processing
git checkout -b video-processor origin/video-processor

# Admin Console
git checkout -b admin-console origin/admin-console

# DeafLifeOS
git checkout -b deaflifeos origin/deaflifeos
```

### List All Feature Branches
```bash
git branch -r | grep -v HEAD | sort
```

---

## 🔧 Common Commands

### Development
```bash
# Start dev server with hot reload
deno task dev

# Type check
deno check server.ts

# Format code
deno fmt

# Lint code
deno lint

# Run tests
deno test --allow-all
```

### Docker
```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up deafauth event-orchestrator -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up --build
```

### Microservices
```bash
# Start individual service
cd services/deafauth
deno run --allow-net --allow-env server.ts

# Test service endpoint
curl http://localhost:3000/health

# View service logs
tail -f logs/deafauth.log
```

---

## 🌐 Service Endpoints

### Core Services (Port Range: 3000-3099)
```
3000  deafauth          http://localhost:3000
3010  event-orchestrator http://localhost:3010
3020  rag-engine        http://localhost:3020
3030  workers           http://localhost:3030
3040  api-broker        http://localhost:3040
3050  pinkflow          http://localhost:3050
3060  asl-glosser       http://localhost:3060
3070  sign-speak        http://localhost:3070
3080  vcode             http://localhost:3080
3090  interpreters      http://localhost:3090
```

### Extended Services (Port Range: 4000-4099)
```
4000  accessibility-api     http://localhost:4000
4010  deaf-first-identity   http://localhost:4010
4020  sign-language-auth    http://localhost:4020
```

### VCode Services (Port Range: 5000-5099)
```
5000  ai-service        http://localhost:5000
5010  content-service   http://localhost:5010
5020  user-service      http://localhost:5020
5030  vr-service        http://localhost:5030
```

### Analytics Services (Port Range: 6000-6099)
```
6000  pink-sync-analytics  http://localhost:6000
6010  pink-sync-preloader  http://localhost:6010
```

### Infrastructure
```
8000  Main Deno Server     http://localhost:8000
8001  Kong Admin API       http://localhost:8001
8002  Kong Admin GUI       http://localhost:8002
6333  Qdrant Vector DB     http://localhost:6333
5432  PostgreSQL           localhost:5432
6379  Redis                localhost:6379
```

---

## 🔑 Environment Variables

### Required
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pinksync

# Redis
REDIS_URL=redis://localhost:6379

# Vector Database
QDRANT_URL=http://localhost:6333

# AI Services
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key

# Video Services
LIVEKIT_URL=wss://your-livekit.com
LIVEKIT_API_KEY=your_api_key
LIVEKIT_SECRET_KEY=your_secret_key
MUX_TOKEN_ID=your_mux_token
MUX_TOKEN_SECRET=your_mux_secret

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET=pinksync-videos
```

### Optional
```bash
# Monitoring
SENTRY_DSN=your_sentry_dsn
GRAFANA_URL=http://localhost:3001

# Third-party APIs
ASSEMBLYAI_API_KEY=your_assemblyai_key
CLERK_SECRET_KEY=your_clerk_key

# Feature Flags
ENABLE_ASL_DETECTION=true
ENABLE_VR_FEATURES=false
ENABLE_BLOCKCHAIN_IDENTITY=false
```

---

## 📚 API Examples

### Authentication
```bash
# Register new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "fullName": "John Doe",
    "preferredSignLanguage": "ASL"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get profile
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### RAG Search
```bash
# Search accessibility research
curl -X POST http://localhost:3020/rag/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "best practices for deaf accessibility",
    "limit": 10
  }'
```

### Event Publishing
```bash
# Publish event
curl -X POST http://localhost:3010/events/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "event": "user.preference.changed",
    "data": {
      "userId": "123",
      "preferences": { "fontSize": "large" }
    }
  }'
```

### VCode Processing
```bash
# Process video for transcription
curl -X POST http://localhost:3080/vcode/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "videoUrl": "https://example.com/video.mp4",
    "generateCaptions": true,
    "detectASL": true
  }'
```

---

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
deno test --allow-all

# Run specific test file
deno test tests/deafauth.test.ts --allow-all

# Run with coverage
deno test --allow-all --coverage=coverage

# Generate coverage report
deno coverage coverage --lcov > coverage.lcov
```

### Integration Tests
```bash
# Run E2E tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- --grep "authentication flow"
```

### Load Testing
```bash
# Install k6
brew install k6

# Run load test
k6 run tests/load/deafauth-load.js

# Run load test with options
k6 run --vus 100 --duration 60s tests/load/deafauth-load.js
```

---

## 🐛 Debugging

### View Logs
```bash
# Main server logs
deno task dev | tee logs/server.log

# Service logs
tail -f logs/deafauth.log

# Docker logs
docker-compose logs -f deafauth
```

### Debug Mode
```bash
# Start with debug logging
DEBUG=* deno task dev

# Debug specific service
DEBUG=deafauth:* deno run --allow-all services/deafauth/server.ts

# VS Code debugging - Add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Deno Debug",
  "program": "${workspaceFolder}/server.ts",
  "cwd": "${workspaceFolder}",
  "runtimeExecutable": "deno",
  "runtimeArgs": ["run", "--inspect-brk", "--allow-all"],
  "attachSimplePort": 9229
}
```

### Health Checks
```bash
# Check all services
./scripts/health-check.sh

# Check specific service
curl http://localhost:3000/health

# Check with timeout
curl -m 5 http://localhost:3000/health
```

---

## 🔄 Database Operations

### PostgreSQL
```bash
# Connect to database
psql $DATABASE_URL

# Run migrations
deno run --allow-all scripts/migrate.ts

# Seed database
deno run --allow-all scripts/seed.ts

# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Redis
```bash
# Connect to Redis
redis-cli

# Common commands
redis-cli PING
redis-cli KEYS "*"
redis-cli GET user:123
redis-cli FLUSHALL
```

### Qdrant
```bash
# Create collection
curl -X PUT http://localhost:6333/collections/accessibility_research \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    }
  }'

# Search vectors
curl -X POST http://localhost:6333/collections/accessibility_research/points/search \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.1, 0.2, ...],
    "limit": 10
  }'
```

---

## 📦 Deployment

### Build for Production
```bash
# Compile Deno app
deno compile --allow-all --output pinksync server.ts

# Build Docker image
docker build -t pinksync:latest .

# Build all services
docker-compose build
```

### Deploy to Production
```bash
# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Deploy to Kubernetes
kubectl apply -f k8s/

# Deploy to Deno Deploy
deployctl deploy --project=pinksync --prod server.ts
```

### Environment-specific
```bash
# Deploy to staging
./deploy.sh staging

# Deploy to production
./deploy.sh production

# Rollback deployment
kubectl rollout undo deployment/pinksync
```

---

## 🛡️ Security

### Generate Secrets
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate session secret
openssl rand -hex 32

# Generate API key
uuidgen | tr '[:upper:]' '[:lower:]'
```

### SSL Certificates
```bash
# Generate self-signed cert for development
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Let's Encrypt for production
certbot certonly --standalone -d api.pinksync.io
```

---

## 📊 Monitoring

### Prometheus Queries
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Grafana Dashboards
- Service Overview: http://localhost:3001/d/service-overview
- Performance Metrics: http://localhost:3001/d/performance
- Accessibility Metrics: http://localhost:3001/d/accessibility

---

## 🔗 Useful Links

### Documentation
- [Main README](./README.md)
- [Architecture](./docs/architecture-complete.md)
- [API Gateway](./docs/api-gateway.md)
- [Microservices Catalog](./MICROSERVICES_CATALOG.md)
- [Modern Integrations](./MODERN_INTEGRATIONS.md)

### External Resources
- [Deno Manual](https://deno.land/manual)
- [LiveKit Docs](https://docs.livekit.io)
- [Qdrant Docs](https://qdrant.tech/documentation)
- [Kong Gateway Docs](https://docs.konghq.com)
- [MediaPipe Guide](https://google.github.io/mediapipe)

---

## 💡 Pro Tips

### Performance Optimization
```bash
# Enable caching
export DENO_DIR=./.deno_cache

# Use --cached-only for offline work
deno run --cached-only --allow-all server.ts

# Profile performance
deno run --allow-all --v8-flags=--prof server.ts
```

### VS Code Setup
```json
// .vscode/settings.json
{
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": false,
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  }
}
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-service

# Keep branch updated
git fetch origin
git rebase origin/main

# Clean commit history
git rebase -i HEAD~5
```

---

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Permission denied:**
```bash
# Add necessary permissions
deno run --allow-net --allow-env --allow-read --allow-write server.ts
```

**Module not found:**
```bash
# Clear cache and reload
rm -rf .deno_cache
deno cache --reload server.ts
```

**Database connection failed:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Restart PostgreSQL
docker-compose restart postgres
```

---

## 📞 Support

- **GitHub Issues**: https://github.com/pinkycollie/PinkSync/issues
- **Documentation**: https://docs.pinksync.io
- **Community**: Join our Discord/Slack
- **Email**: support@pinksync.io

---

**Last Updated**: December 2025  
**Maintained by**: PinkSync Team
