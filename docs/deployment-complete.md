# PinkSync Deployment Guide

## Overview

This guide covers deploying both components of PinkSync:
1. **Backend (DeafAUTH API)** - The central server
2. **Browser Extension** - The client application

## Prerequisites

- Node.js 18+ installed
- Git installed
- Chrome browser (for extension testing)
- Domain name (for production backend)
- SSL certificate (for production)

## Backend Deployment

### Option 1: Vercel (Recommended for Quick Start)

Vercel provides the easiest deployment with zero configuration.

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd /path/to/PinkSync
   vercel
   ```

4. **Configure Environment**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     ```
     NODE_ENV=production
     API_URL=https://your-domain.vercel.app
     ```

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

**Result**: Your API will be live at `https://your-project.vercel.app`

### Option 2: Docker Deployment

For self-hosted or cloud deployments.

**1. Create Dockerfile** (already exists in project root if needed):

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**2. Build Docker Image**
```bash
docker build -t pinksync:latest .
```

**3. Run Container**
```bash
docker run -d \
  --name pinksync \
  -p 3000:3000 \
  -e NODE_ENV=production \
  pinksync:latest
```

**4. With Docker Compose** (create `docker-compose.yml`):

```yaml
version: '3.8'

services:
  pinksync:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=https://your-domain.com
    restart: unless-stopped
    
  # Optional: Redis for session storage
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

### Option 3: Traditional VPS (DigitalOcean, AWS, etc.)

**1. Setup Server**
```bash
# SSH into your server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

**2. Clone and Setup**
```bash
# Clone repository
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync

# Install dependencies
npm install --legacy-peer-deps

# Build
npm run build
```

**3. Configure PM2**
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'pinksync',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 2,
    exec_mode: 'cluster'
  }]
}
```

**4. Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**5. Setup Nginx Reverse Proxy**
```bash
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/pinksync
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/pinksync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**6. Setup SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 4: Kubernetes

For large-scale deployments.

**1. Create Kubernetes manifests**

`k8s/deployment.yaml`:
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
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

`k8s/service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pinksync
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: pinksync
```

**2. Deploy**
```bash
kubectl apply -f k8s/
```

## Browser Extension Deployment

### Development Testing

**1. Load Extension in Chrome**
```bash
1. Open Chrome
2. Go to chrome://extensions/
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select /path/to/PinkSync/extension directory
6. Extension is now loaded!
```

**2. Test Extension**
```
1. Click extension icon in toolbar
2. Login with test credentials
3. Visit youtube.com
4. Verify captions are enabled automatically
5. Check console for PinkSync messages
```

### Production - Chrome Web Store

**Prerequisites:**
- Google Chrome Developer account ($5 one-time fee)
- Extension tested and working
- All icons created (16x16, 48x48, 128x128)
- Privacy policy URL
- Screenshots (1280x800 or 640x400)

**Steps:**

**1. Prepare Extension Package**

Update `extension/manifest.json` with production API URL:
```json
{
  "name": "PinkSync - Accessibility Companion",
  "version": "1.0.0",
  "description": "Automatically applies accessibility preferences across all websites.",
  ...
}
```

Update `extension/scripts/background.js`:
```javascript
const DEAFAUTH_API_URL = 'https://your-production-api.com';
```

**2. Create Icons**

Generate required icons (see `extension/icons/README.md`):
- icon16.png (16x16)
- icon48.png (48x48)
- icon128.png (128x128)

**3. Create ZIP Package**
```bash
cd extension
zip -r ../pinksync-extension.zip . -x "*.DS_Store" -x "*README.md"
```

**4. Create Chrome Web Store Listing**

Go to: https://chrome.google.com/webstore/devconsole

1. Click "New Item"
2. Upload `pinksync-extension.zip`
3. Fill in details:
   - **Name**: PinkSync - Accessibility Companion
   - **Summary**: Automatic accessibility for deaf users across all websites
   - **Description**: (Use content from extension/README.md)
   - **Category**: Accessibility
   - **Language**: English
   - **Privacy Policy**: URL to your privacy policy
   
4. Add Screenshots (at least 1, max 5):
   - Take screenshots of extension in action
   - Show popup UI
   - Show before/after of website with accessibility

5. Add Icon:
   - Upload 128x128 icon

6. Set Visibility:
   - Public (visible to everyone)
   - Or Unlisted (only accessible via direct link)

7. Save as Draft

**5. Submit for Review**

1. Review all information
2. Click "Submit for Review"
3. Wait 1-7 days for Google's review
4. Once approved, extension goes live!

**6. Update Extension**

For future updates:
```bash
1. Increment version in manifest.json
2. Make your changes
3. Create new ZIP
4. Upload to Chrome Web Store
5. Submit for review
```

### Enterprise Deployment (Private Distribution)

For organizations that want to distribute internally.

**1. Create Enterprise Policy**

`policy.json`:
```json
{
  "ExtensionInstallForcelist": [
    "extension-id;https://your-server.com/updates.xml"
  ],
  "ExtensionSettings": {
    "extension-id": {
      "installation_mode": "force_installed",
      "update_url": "https://your-server.com/updates.xml"
    }
  }
}
```

**2. Host Extension**
- Package extension as CRX
- Host on internal server
- Create update manifest (updates.xml)
- Deploy via Chrome Enterprise policies

## Configuration

### Backend Environment Variables

Create `.env.local` for production:

```env
# Environment
NODE_ENV=production

# API Configuration
API_URL=https://your-domain.com
PORT=3000

# CORS (for extension)
CORS_ORIGIN=chrome-extension://*

# Session Configuration
SESSION_SECRET=your-secret-key-here
SESSION_TIMEOUT=86400000

# Optional: Database
DATABASE_URL=postgresql://user:pass@host:5432/pinksync

# Optional: Redis for session storage
REDIS_URL=redis://localhost:6379
```

### Extension Configuration

Update in `extension/scripts/background.js`:

```javascript
// Production API endpoint
const DEAFAUTH_API_URL = 'https://api.pinksync.com';

// Sync interval (5 minutes)
const SYNC_INTERVAL = 5 * 60 * 1000;
```

## Monitoring & Maintenance

### Backend Monitoring

**1. Health Check Endpoint**

Add to your API:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

**2. Setup Monitoring**
- Use services like UptimeRobot or Pingdom
- Monitor `/api/health` endpoint
- Set up alerts for downtime

**3. Logging**
```bash
# PM2 logs
pm2 logs pinksync

# Docker logs
docker logs pinksync

# Kubernetes logs
kubectl logs -f deployment/pinksync
```

### Extension Monitoring

**1. Chrome Web Store Dashboard**
- Monitor installation count
- Check reviews and ratings
- Track crash reports

**2. User Feedback**
- Add feedback mechanism in extension
- Monitor GitHub issues
- Set up support email

## Security Checklist

- [ ] HTTPS enabled on backend
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Extension uses secure token storage
- [ ] No sensitive data in logs
- [ ] Regular security updates
- [ ] Privacy policy in place
- [ ] Terms of service available

## Backup & Recovery

### Backend Backup

**1. Database Backup** (if using database)
```bash
# PostgreSQL
pg_dump pinksync > backup.sql

# Automated daily backup
0 0 * * * pg_dump pinksync > /backups/pinksync-$(date +\%Y\%m\%d).sql
```

**2. File Backup**
```bash
# Backup uploaded files
tar -czf backup-files.tar.gz /app/public/uploads

# Backup configuration
tar -czf backup-config.tar.gz /app/.env.local /app/config
```

### Extension Backup

- Keep source code in Git
- Tag releases: `git tag v1.0.0`
- Store published ZIPs
- Maintain changelog

## Troubleshooting

### Backend Issues

**Build Fails**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

**Port Already in Use**
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

**API Not Responding**
```bash
# Check if running
pm2 status

# Restart
pm2 restart pinksync

# Check logs
pm2 logs pinksync --lines 50
```

### Extension Issues

**Extension Not Loading**
- Check manifest.json syntax
- Verify all file paths are correct
- Check Chrome console for errors
- Try reloading extension

**API Connection Failed**
- Verify API URL in background.js
- Check CORS configuration
- Verify SSL certificate (HTTPS required)
- Check network tab in DevTools

**Preferences Not Syncing**
- Check authentication token
- Verify API endpoint is accessible
- Check background worker logs
- Try manual sync button

## Performance Optimization

### Backend

**1. Enable Caching**
```typescript
// Add caching headers
export async function GET() {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=300'
    }
  });
}
```

**2. Use CDN**
- Deploy to Vercel (includes CDN)
- Or use Cloudflare
- Cache static assets

**3. Database Optimization**
- Add indexes
- Use connection pooling
- Enable query caching

### Extension

**1. Minimize Bundle Size**
- Remove unused code
- Minify JavaScript
- Compress assets

**2. Optimize Performance**
- Debounce DOM observations
- Cache API responses
- Lazy load platform handlers

## Cost Estimates

### Backend Hosting

- **Vercel Free Tier**: $0/month (hobby projects)
- **Vercel Pro**: $20/month (production)
- **DigitalOcean Droplet**: $6-12/month (basic VPS)
- **AWS EC2**: $10-50/month (varies by usage)

### Extension

- **Chrome Web Store**: $5 one-time fee
- **Hosting costs**: Included in backend costs

### Total Estimate

- **Minimum**: $5 one-time + $0/month (free hosting)
- **Recommended**: $5 one-time + $20/month (Vercel Pro)
- **Enterprise**: $5 one-time + $50-200/month (VPS + monitoring)

## Support & Resources

- **Documentation**: https://docs.pinksync.com
- **GitHub Issues**: https://github.com/pinkycollie/PinkSync/issues
- **Discord Community**: https://discord.gg/pinksync
- **Email Support**: support@pinksync.com

## Next Steps

After deployment:

1. Test both backend and extension thoroughly
2. Monitor for errors and performance
3. Gather user feedback
4. Iterate and improve
5. Add new features based on feedback
6. Keep dependencies updated
7. Regular security audits

## Conclusion

You now have a complete, production-ready deployment of PinkSync with both the backend API and browser extension. Users can install the extension, log in with their DeafAUTH credentials, and enjoy consistent accessibility across all websites!
