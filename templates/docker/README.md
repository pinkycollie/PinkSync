# PinkSync Docker Deployment Template

Quick start template for deploying PinkSync with Docker.

## Quick Start

### Development

```bash
# Clone the repository
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Create environment file
cp .env.example .env
# Edit .env with your production values

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Services

The docker-compose setup includes:

1. **Next.js App** - Main PinkSync application (port 3000)
2. **Deno DeafAUTH** - Authentication service (port 8000)
3. **Redis** - Session storage and caching (port 6379)
4. **PostgreSQL** - Database (optional, port 5432)
5. **Nginx** - Reverse proxy and load balancer (ports 80/443)

## Configuration

### Environment Variables

Create `.env` file:

```env
# Database
POSTGRES_USER=pinksync
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=pinksync
DATABASE_URL=postgresql://pinksync:your-secure-password@postgres:5432/pinksync

# Redis
REDIS_URL=redis://redis:6379

# API
API_URL=https://your-domain.com

# Next.js
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### SSL Certificates

For HTTPS, place your SSL certificates in:
- `./ssl/cert.pem`
- `./ssl/key.pem`

Or use Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy to project
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
```

## Nginx Configuration

The included `nginx.conf` provides:

- SSL/TLS termination
- Reverse proxy to Next.js and Deno services
- Rate limiting for API endpoints
- CORS headers for browser extension
- Security headers
- Health check endpoint

Edit `nginx.conf` to update:
- Server name (your-domain.com)
- SSL certificate paths
- CORS origins for your extension

## Health Checks

Check service health:

```bash
# Next.js app
curl http://localhost:3000/api/platform

# Deno DeafAUTH
curl http://localhost:8000/health

# Nginx
curl http://localhost/health
```

## Scaling

Scale individual services:

```bash
# Scale Next.js app to 3 instances
docker-compose up -d --scale app=3

# Scale Deno service to 2 instances
docker-compose up -d --scale deno=2
```

## Monitoring

View resource usage:

```bash
# All services
docker-compose ps

# Service stats
docker stats

# Logs
docker-compose logs -f app
docker-compose logs -f deno
```

## Backup

Backup data volumes:

```bash
# PostgreSQL
docker exec -t postgres pg_dumpall -c -U pinksync > dump_$(date +%Y-%m-%d).sql

# Redis
docker exec redis redis-cli BGSAVE
docker cp redis:/data/dump.rdb ./backup/redis_$(date +%Y-%m-%d).rdb
```

## Restore

Restore from backup:

```bash
# PostgreSQL
cat dump_2024-12-03.sql | docker exec -i postgres psql -U pinksync

# Redis
docker cp ./backup/redis_2024-12-03.rdb redis:/data/dump.rdb
docker-compose restart redis
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Rebuild image
docker-compose build --no-cache app
docker-compose up -d app
```

### Database connection issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection
docker-compose exec app npm run db:test
```

### Port conflicts

If ports are already in use, edit `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3001:3000"  # Change host port
```

## Production Checklist

- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Update nginx.conf with your domain
- [ ] Configure database backups
- [ ] Set up log rotation
- [ ] Configure monitoring (Prometheus, Grafana)
- [ ] Set up alerting
- [ ] Test health check endpoints
- [ ] Configure firewall rules
- [ ] Enable automatic updates
- [ ] Test backup and restore procedures

## Security

- Use strong passwords for all services
- Keep SSL certificates up to date
- Regularly update Docker images
- Monitor logs for suspicious activity
- Use secrets management for sensitive data
- Enable network isolation
- Regular security audits

## Support

- Documentation: See main PinkSync docs
- Issues: https://github.com/pinkycollie/PinkSync/issues
