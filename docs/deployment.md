# PinkSync Deployment Guide

## Overview

PinkSync is designed for flexible deployment across multiple environments. This guide covers deployment options from development to production.

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- 4GB RAM minimum (8GB recommended for production)
- PostgreSQL (optional, for production)
- Redis (optional, for caching)

## Environment Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Platform Configuration
NEXT_PUBLIC_PLATFORM_ENV=standalone  # standalone, extension, embedded, api, signal, notificator
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database (Optional - for production)
DATABASE_URL=postgresql://user:password@localhost:5432/pinksync
RAG_DATABASE_URL=postgresql://user:password@localhost:5432/pinksync_rag
VECTOR_DB_URL=http://localhost:8000  # For vector database (e.g., Weaviate, Pinecone)

# Workers (Optional)
WORKER_QUEUE_URL=redis://localhost:6379

# Signal System (Optional)
SIGNAL_SERVICE_URL=ws://localhost:3000/ws

# MBTQ Integration
MBTQ_API_URL=https://mbtq.dev/api
MBTQ_SHARED_AUTH=true

# Security
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret-here

# External Services (Optional)
OPENAI_API_KEY=sk-...  # For advanced content transformation
TRANSCRIPTION_API_KEY=...  # For audio transcription
```

---

## Development Deployment

### Quick Start

```bash
# Clone repository
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

Access at: `http://localhost:3000`

### Development with Docker

```bash
# Build Docker image
docker build -t pinksync:dev .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_PLATFORM_ENV=standalone \
  pinksync:dev
```

---

## Production Deployment

### Option 1: Standalone Server

#### Build Application

```bash
# Install production dependencies
npm ci --production --legacy-peer-deps

# Build for production
npm run build

# Start production server
npm start
```

The application will run on port 3000 by default.

#### Using PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "pinksync" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

#### Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name pinksync.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 2: Docker Deployment

#### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  pinksync:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_PLATFORM_ENV=standalone
      - DATABASE_URL=postgresql://postgres:password@db:5432/pinksync
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=pinksync
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

Run with:
```bash
docker-compose up -d
```

### Option 3: Kubernetes Deployment

#### Kubernetes Manifests

`deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pinksync
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pinksync
  template:
    metadata:
      labels:
        app: pinksync
    spec:
      containers:
      - name: pinksync
        image: pinksync:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_PLATFORM_ENV
          value: "standalone"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: pinksync-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
```

`service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pinksync-service
spec:
  selector:
    app: pinksync
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

---

## Environment-Specific Deployments

### Browser Extension Deployment

1. Set environment: `NEXT_PUBLIC_PLATFORM_ENV=extension`
2. Build extension bundle:
```bash
npm run build:extension
```
3. Load in browser developer mode
4. Submit to extension stores

### Embedded Widget Deployment

1. Set environment: `NEXT_PUBLIC_PLATFORM_ENV=embedded`
2. Build widget:
```bash
npm run build:widget
```
3. Include script on host page:
```html
<script src="https://your-domain.com/widget.js"></script>
<div id="pinksync-widget"></div>
```

### API-Only Deployment

1. Set environment: `NEXT_PUBLIC_PLATFORM_ENV=api`
2. Disable UI components in build
3. Deploy as microservice
4. Configure API gateway

---

## Database Setup (Production)

### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE pinksync;

-- Create tables (run migrations)
\c pinksync

-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Research documents table
CREATE TABLE research_documents (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    community_votes INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_research_type ON research_documents(type);
CREATE INDEX idx_research_verified ON research_documents(verified);
```

### Redis Setup

```bash
# Install Redis
apt-get install redis-server

# Start Redis
systemctl start redis-server

# Enable on boot
systemctl enable redis-server

# Configure Redis (optional)
nano /etc/redis/redis.conf
```

---

## SSL/HTTPS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d pinksync.yourdomain.com

# Auto-renewal (cron)
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Monitoring & Logging

### Application Logs

```bash
# View PM2 logs
pm2 logs pinksync

# View Docker logs
docker-compose logs -f pinksync

# View Kubernetes logs
kubectl logs -f deployment/pinksync
```

### Health Checks

Setup health check endpoint monitoring:

```bash
# Check platform status
curl http://localhost:3000/api/platform

# Expected response: {"success": true, "data": {...}}
```

### Monitoring Tools

Recommended tools:
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **Sentry** - Error tracking
- **New Relic** - APM monitoring

---

## Backup & Recovery

### Database Backup

```bash
# Backup PostgreSQL
pg_dump -U postgres pinksync > backup_$(date +%Y%m%d).sql

# Restore PostgreSQL
psql -U postgres pinksync < backup_20250101.sql
```

### Application Backup

```bash
# Backup application files
tar -czf pinksync_backup_$(date +%Y%m%d).tar.gz \
  /opt/pinksync \
  --exclude='node_modules' \
  --exclude='.next'
```

---

## Scaling

### Horizontal Scaling

- Deploy multiple instances behind load balancer
- Use Redis for shared session storage
- Configure sticky sessions if needed
- Database connection pooling

### Vertical Scaling

Resource recommendations by load:
- **Light** (< 100 users): 2GB RAM, 1 CPU
- **Medium** (< 1000 users): 4GB RAM, 2 CPU
- **Heavy** (< 10000 users): 8GB RAM, 4 CPU
- **Enterprise** (10000+ users): 16GB+ RAM, 8+ CPU

---

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Always use HTTPS in production
3. **API Keys**: Rotate regularly
4. **Database**: Use strong passwords and encryption
5. **Updates**: Keep dependencies updated
6. **Firewall**: Configure firewall rules
7. **Rate Limiting**: Implement rate limiting
8. **CORS**: Configure CORS properly

---

## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Build Errors**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

**Database Connection Issues**:
- Check DATABASE_URL format
- Verify database is running
- Check firewall rules
- Verify credentials

---

## Support

For deployment issues:
- Check logs first
- Review environment variables
- Verify all services are running
- Check network connectivity

For additional help, refer to:
- Architecture documentation
- API documentation
- GitHub Issues
