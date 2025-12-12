# MBTQ Platform Scripts

This directory contains automation scripts for managing the MBTQ platform infrastructure.

## Available Scripts

### 🚀 Deployment Scripts

#### `start-all.sh`
Starts all MBTQ services using docker-compose.master.yml

```bash
./scripts/start-all.sh
```

Features:
- Checks for port conflicts on 80 and 443
- Starts all services in correct order
- Displays access URLs
- Includes error handling with `set -e`

#### `generate-ssl-certs.sh`
Generates self-signed SSL certificates for development

```bash
./scripts/generate-ssl-certs.sh
```

Creates:
- `ssl/cert.pem` - SSL certificate
- `ssl/key.pem` - Private key

⚠️ For production, use real certificates from Let's Encrypt

### 🏥 Testing & Monitoring Scripts

#### `health-check.sh`
Comprehensive health check for all platform services

```bash
./scripts/health-check.sh
```

Tests:
- Docker container status
- Service endpoint accessibility
- Accessibility features
- Port conflict detection

Exit codes:
- `0` - All systems operational
- `1` - Issues detected (check output)

#### `test-accessibility.sh`
Dedicated accessibility testing for deaf users

```bash
./scripts/test-accessibility.sh
```

Tests:
- WCAG AAA compliance
- Deaf accessibility features:
  - Visual alerts API
  - Sign language support
  - Caption services
- AI tools integration (PinkFlowAI, PinkyAI)
- Platform service connectivity

Environment variables:
- `PINKFLOW_URL` - Override PinkFlow URL (default: https://localhost/pinkflow)
- `AI_URL` - Override AI service URL (default: https://localhost/ai)
- `PINKYAI_URL` - Override PinkyAI URL (default: https://localhost/pinkyai)

### 🔧 Configuration Scripts

#### `update-config.sh`
Configuration management and validation

```bash
./scripts/update-config.sh
```

Features:
- Validates mbtq.dev infrastructure
- Checks configuration freshness
- Generates CONFIG_STATUS.md documentation
- Provides helper functions for adding new services

## Usage Examples

### Development Workflow

```bash
# 1. Generate SSL certificates (first time)
./scripts/generate-ssl-certs.sh

# 2. Start all services
./scripts/start-all.sh

# 3. Run health check
./scripts/health-check.sh

# 4. Test accessibility features
./scripts/test-accessibility.sh
```

### CI/CD Integration

These scripts are integrated with GitHub Actions:
- `health-check.sh` - Runs on every push/PR
- `test-accessibility.sh` - Runs for accessibility compliance
- Configuration validation - Runs on workflow triggers

See `.github/workflows/platform-health-check.yml` for details.

### Production Deployment

```bash
# 1. Update configurations for production domain
vim nginx-master.conf  # Update server_name to mbtq.dev

# 2. Generate real SSL certificates
certbot certonly --nginx -d mbtq.dev -d *.mbtq.dev

# 3. Start services
./scripts/start-all.sh

# 4. Validate deployment
./scripts/health-check.sh
./scripts/test-accessibility.sh

# 5. Monitor configuration
./scripts/update-config.sh
```

## Script Requirements

### System Dependencies
- `bash` (version 4.0+)
- `docker` and `docker-compose`
- `curl` (for health checks)
- `lsof` (for port checking)
- `openssl` (for SSL certificate generation)

### Optional Dependencies
- `jq` (for JSON parsing in tests)
- `certbot` (for production SSL certificates)

## Error Handling

All scripts use `set -e` to exit on errors. This prevents:
- Partial deployments
- Incomplete SSL certificate generation
- Running tests against failed services

## Color Coding

Scripts use ANSI color codes:
- 🟢 **Green** - Success/OK
- 🔴 **Red** - Error/Failure
- 🟡 **Yellow** - Warning/Info
- 🔵 **Blue** - Info/Testing

## Adding New Services

To add a new service to the platform:

1. Update `docker-compose.master.yml`:
   ```yaml
   new-service:
     image: new-service:latest
     container_name: new-service
     environment:
       - PORT=8004
     expose:
       - "8004"
     networks:
       - mbtq-network
   ```

2. Update `nginx-master.conf`:
   ```nginx
   upstream new_service {
       server new-service:8004;
   }
   
   location /new-service/ {
       rewrite ^/new-service/(.*) /$1 break;
       proxy_pass http://new_service;
       proxy_set_header Host $host;
   }
   ```

3. Update `health-check.sh` to include the new service

4. Run configuration update:
   ```bash
   ./scripts/update-config.sh
   ```

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :80

# Kill the process
kill <PID>

# Or stop other docker-compose stacks
docker-compose -f docker-compose.yml down
```

### Services Not Starting
```bash
# Check logs
docker-compose -f docker-compose.master.yml logs -f

# Check individual service
docker-compose -f docker-compose.master.yml logs <service-name>
```

### Health Check Failures
```bash
# Restart services
docker-compose -f docker-compose.master.yml restart

# Rebuild and restart
docker-compose -f docker-compose.master.yml up -d --build
```

## Security Notes

- SSL certificates in `ssl/` are excluded from git (.gitignore)
- Never commit real SSL private keys
- Use environment variables for secrets
- Review script permissions before running

## Support

For issues or questions:
- Check SETUP_GUIDE.md
- Review PORT_MAP.md for port allocations
- See VALIDATION_CHECKLIST.md for implementation status
