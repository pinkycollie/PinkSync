# PinkSync DevOps & Deployment Guide

Complete guide for deploying and managing PinkSync in production.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployments](#cloud-deployments)
4. [CI/CD Pipelines](#cicd-pipelines)
5. [Monitoring & Logging](#monitoring--logging)
6. [Backup & Recovery](#backup--recovery)
7. [Security](#security)
8. [Troubleshooting](#troubleshooting)

## Quick Start

### Automated Deployment

Use the provided deployment script:

```bash
./deploy.sh
```

Select your deployment target:
1. Docker (Local) - For development
2. Docker (Production) - Full production stack
3. Vercel - Next.js deployment
4. Deno Deploy - DeafAUTH service
5. Build Extension - Package browser extension
6. Run Tests - Validate everything

### Manual Deployment

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the application
npm run build

# Start production server
npm start
```

## Docker Deployment

### Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services available:
- Next.js: http://localhost:3000
- Deno DeafAUTH: http://localhost:8000
- Redis: localhost:6379
- Nginx: http://localhost

### Production Environment

```bash
# Create environment file
cp .env.example .env
# Edit .env with production values

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Docker Images

Build individual images:

```bash
# Next.js application
docker build -t pinksync:latest .

# Deno DeafAUTH
docker build -f Dockerfile.deno -t deafauth-deno:latest .
```

Push to registry:

```bash
docker tag pinksync:latest your-registry/pinksync:latest
docker push your-registry/pinksync:latest
```

## Cloud Deployments

### Vercel (Next.js)

**Prerequisites:**
- Vercel account
- Vercel CLI: `npm install -g vercel`

**Deploy:**

```bash
# First-time setup
vercel login
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Environment Variables:**

Configure in Vercel dashboard or via CLI:

```bash
vercel env add API_URL
vercel env add DATABASE_URL
```

### Deno Deploy (DeafAUTH)

**Prerequisites:**
- Deno Deploy account
- Deno installed
- deployctl: `deno install -Arf https://deno.land/x/deploy/deployctl.ts`

**Deploy:**

```bash
cd deno-deafauth

# Deploy to preview
deployctl deploy --project=deafauth mod.ts

# Deploy to production
deployctl deploy --project=deafauth --prod mod.ts
```

**Configuration:**

Set environment variables in Deno Deploy dashboard:
- `DENO_ENV=production`
- `DATABASE_URL=...`
- `REDIS_URL=...`

### AWS (EC2 + ECS)

**EC2 Deployment:**

```bash
# 1. Launch EC2 instance (Ubuntu 22.04 LTS)
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# 4. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. Clone and deploy
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync
cp .env.example .env
# Edit .env
docker-compose -f docker-compose.prod.yml up -d
```

**ECS Deployment:**

```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t pinksync .
docker tag pinksync:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/pinksync:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/pinksync:latest

# Create ECS task definition and service
# Deploy via AWS Console or CLI
```

### DigitalOcean

**App Platform:**

```yaml
# app.yaml
name: pinksync
services:
  - name: web
    github:
      repo: pinkycollie/PinkSync
      branch: main
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
    health_check:
      http_path: /api/platform
```

**Kubernetes:**

```bash
# Create cluster
doctl kubernetes cluster create pinksync-cluster

# Deploy
kubectl apply -f k8s/
```

## CI/CD Pipelines

### GitHub Actions

The repository includes several workflows:

1. **`ci-cd.yml`** - Main CI/CD pipeline
   - Runs on all branches
   - Linting, testing, building
   - Automated quality checks

2. **`deploy.yml`** - Deployment workflow
   - Deploys to staging/production
   - Runs on main/develop branches
   - Manual deployment option

3. **`deno-deafauth.yml`** - Deno-specific pipeline
   - Checks Deno code
   - Deploys to Deno Deploy
   - Runs on changes to deno-deafauth/

**Workflow Configuration:**

Set up these secrets in GitHub:
- `VERCEL_TOKEN` - Vercel deployment
- `DENO_DEPLOY_TOKEN` - Deno Deploy
- `DOCKER_HUB_TOKEN` - Docker registry
- `AWS_ACCESS_KEY_ID` - AWS deployments
- `AWS_SECRET_ACCESS_KEY` - AWS deployments

**Manual Deployment:**

```bash
# Trigger deployment workflow
gh workflow run deploy.yml -f environment=production
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci --legacy-peer-deps
    - npm run build

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/pinksync pinksync=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
```

## Monitoring & Logging

### Application Monitoring

**Health Checks:**

```bash
# Next.js
curl http://localhost:3000/api/platform

# Deno DeafAUTH
curl http://localhost:8000/health

# Nginx
curl http://localhost/health
```

**Prometheus Integration:**

Add to `docker-compose.yml`:

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

**Grafana Dashboards:**

```yaml
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Log Management

**Docker Logs:**

```bash
# View logs
docker-compose logs -f app

# Save logs to file
docker-compose logs > logs.txt

# Filter logs
docker-compose logs app | grep ERROR
```

**Centralized Logging:**

Use ELK stack (Elasticsearch, Logstash, Kibana):

```yaml
services:
  elasticsearch:
    image: elasticsearch:8.10.0
    ports:
      - "9200:9200"
  
  kibana:
    image: kibana:8.10.0
    ports:
      - "5601:5601"
```

## Backup & Recovery

### Database Backup

**PostgreSQL:**

```bash
# Manual backup
docker exec -t postgres pg_dumpall -c -U pinksync > backup.sql

# Automated daily backup (cron)
0 2 * * * docker exec -t postgres pg_dumpall -c -U pinksync > /backups/pinksync-$(date +\%Y\%m\%d).sql
```

**Restore:**

```bash
cat backup.sql | docker exec -i postgres psql -U pinksync
```

### Redis Backup

```bash
# Trigger save
docker exec redis redis-cli BGSAVE

# Copy backup
docker cp redis:/data/dump.rdb ./backup/
```

### File Backup

```bash
# Backup uploads and config
tar -czf backup-$(date +%Y%m%d).tar.gz ./public/uploads .env

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-bucket/backups/
```

## Security

### SSL/TLS Configuration

**Let's Encrypt:**

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal (cron)
0 0 1 * * certbot renew --quiet
```

**Manual Certificates:**

Place certificates in `./ssl/`:
- `cert.pem` - Certificate
- `key.pem` - Private key

### Security Headers

Nginx configuration includes:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Secrets Management

Use environment variables or secrets management:

```bash
# AWS Secrets Manager
aws secretsmanager create-secret --name pinksync/db --secret-string '{"password":"..."}'

# Docker Secrets
echo "my-secret" | docker secret create db_password -
```

## Troubleshooting

### Common Issues

**Build Failures:**

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

**Container Issues:**

```bash
# Check container logs
docker-compose logs app

# Restart container
docker-compose restart app

# Rebuild container
docker-compose build --no-cache app
docker-compose up -d app
```

**Port Conflicts:**

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Database Connection:**

```bash
# Test connection
docker-compose exec app node -e "require('pg').Client({connectionString: process.env.DATABASE_URL}).connect().then(() => console.log('OK'))"
```

### Performance Issues

**Memory Usage:**

```bash
# Check memory
docker stats

# Increase memory limit
docker-compose.yml:
  services:
    app:
      mem_limit: 2g
```

**CPU Usage:**

```bash
# CPU profiling
docker-compose exec app npm run profile
```

## Support

- Documentation: This guide + main README
- Issues: https://github.com/pinkycollie/PinkSync/issues
- CI/CD: `.github/workflows/`
- Templates: `templates/`

## Checklists

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] SSL certificates ready
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Security review complete

### Post-Deployment

- [ ] Health checks passing
- [ ] SSL working
- [ ] Monitoring active
- [ ] Logs accessible
- [ ] Backup verified
- [ ] Documentation updated

---

**Built for production. Deploy with confidence.** 🚀
