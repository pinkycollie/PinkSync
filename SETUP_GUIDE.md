# Master Configuration Setup Guide

This guide explains how to use the master nginx configuration to run all MBTQ services without port conflicts.

## Quick Start

### 1. Generate SSL Certificates (First Time Only)

```bash
./scripts/generate-ssl-certs.sh
```

This creates self-signed certificates in the `ssl/` directory for HTTPS support.

### 2. Start All Services

```bash
./scripts/start-all.sh
```

This will:
- Check for port conflicts on ports 80 and 443
- Start all services using `docker-compose.master.yml`
- Display access URLs

## What's New

### Port Conflict Resolution

The old configuration had multiple services trying to use the same ports:
- DeafAuth, PinkFlow, and PinkyAI all used port 8000
- Multiple nginx instances tried to bind to ports 80/443

**New port assignments:**
- DeafAuth: 8001 (changed from 8000)
- PinkFlow: 8002 (changed from 8000)
- PinkyAI: 8003 (changed from 8000)
- PinkSync: 3000 (unchanged)
- PinkFlowAI: 5000 (unchanged)
- Business Magician: 8080 (unchanged)

### Single Entry Point

All services are now accessed through a single nginx reverse proxy:
- HTTP: http://localhost
- HTTPS: https://localhost

## Service Access

| Service | URL | Description |
|---------|-----|-------------|
| PinkSync | https://localhost/ | Main platform |
| DeafAuth | https://localhost/auth/ | Authentication API |
| PinkFlow | https://localhost/pinkflow/ | Accessibility testing |
| PinkFlowAI | https://localhost/ai/ | AI processing |
| PinkyAI | https://localhost/pinkyai/ | AI chat API |
| Business Magician | https://localhost/magician/ | Business tools |
| Health Check | https://localhost/health | System health |

## Files

- **nginx-master.conf** - Master nginx configuration with all service routing
- **docker-compose.master.yml** - Complete Docker Compose orchestration
- **PORT_MAP.md** - Detailed port allocation documentation
- **nginx.conf.old** - Backup of original configuration
- **scripts/start-all.sh** - Quick start script
- **scripts/generate-ssl-certs.sh** - SSL certificate generator

## Development Mode

For local development without Docker, each service can run on its assigned port:

```bash
# Terminal 1 - PinkSync
npm run dev  # Port 3000

# Terminal 2 - DeafAuth
cd deno-deafauth && deno run --allow-all server.ts  # Port 8001

# Terminal 3 - PinkFlow
uvicorn main:app --port 8002  # Port 8002

# etc...
```

Access services directly:
- PinkSync: http://localhost:3000
- DeafAuth: http://localhost:8001
- PinkFlow: http://localhost:8002

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using the port
lsof -i :80
lsof -i :443

# Stop conflicting processes
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.prod.yml down
```

### Services Not Starting

Check Docker Compose logs:

```bash
docker-compose -f docker-compose.master.yml logs -f
```

### SSL Certificate Warnings

Self-signed certificates will trigger browser warnings. This is expected for development.

For production, use real certificates from Let's Encrypt or another CA.

## Migration from Old Setup

If you were using the old `nginx.conf` and `docker-compose.yml`:

1. Stop old services: `docker-compose down`
2. Update service configurations to use new ports
3. Generate SSL certificates: `./scripts/generate-ssl-certs.sh`
4. Start with new setup: `./scripts/start-all.sh`

## Production Deployment

For production:

1. Replace self-signed certificates with real SSL certificates
2. Update `server_name` in nginx-master.conf to your domain
3. Uncomment the HTTPS redirect in the HTTP server block
4. Set `NODE_ENV=production` and other production environment variables
5. Use proper secrets management for sensitive data

## Support

See [PORT_MAP.md](PORT_MAP.md) for detailed port allocation information.
