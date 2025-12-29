# PinkSync Configuration Validation Guide

## 🚨 Current Issue

Your GitHub Actions workflow is failing on the **"Validate Configurations"** check. This is because the validation script is missing or not properly configured.

## 🔧 Quick Fix (Immediate Solution)

Run this command in your repository root:

```bash
# Download and run the quick fix script
curl -fsSL https://raw.githubusercontent.com/pinkycollie/pinksync/feat-Pinksync-AI/quick-fix-ci.sh | bash

# Or create it manually:
cat > quick-fix-ci.sh << 'EOF'
[paste the Quick Fix script content]
EOF

chmod +x quick-fix-ci.sh
./quick-fix-ci.sh
```

Then commit and push:

```bash
git add scripts/validate-config.ts .github/workflows/validate-config.yml
git commit -m "fix: add configuration validation script for CI"
git push origin feat-Pinksync-AI
```

## 📋 What Gets Fixed

### 1. **Validation Script** (`scripts/validate-config.ts`)
Creates a Deno script that validates:
- ✅ Docker Compose syntax and service definitions
- ✅ Nginx configuration files
- ✅ Deno configuration (deno.json)
- ✅ Port conflict detection
- ✅ File structure integrity

### 2. **GitHub Actions Workflow** (`.github/workflows/validate-config.yml`)
Sets up automated checks that run on:
- Push to `main` or `feat-Pinksync-AI` branches
- Pull requests
- Manual trigger

### 3. **Service Port Mapping**
Validates the correct port assignments from your PR:

| Service | Port | Path | Status |
|---------|------|------|--------|
| PinkSync | 3000 | `/` | ✅ |
| DeafAuth | 8001 | `/auth/` | ✅ |
| PinkFlow | 8002 | `/pinkflow/` | ✅ |
| PinkyAI | 8003 | `/pinkyai/` | ✅ |
| PinkFlowAI | 5000 | `/ai/` | ✅ |
| Business Magician | 8080 | `/magician/` | ✅ |
| Nginx | 80, 443 | All | ✅ |

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                           │
│                  (DDoS Protection + SSL)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Nginx Master (80/443)                      │
│           Single Entry Point for All Services               │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌─────────┐          ┌─────────────┐
    │ Path    │          │ WebSocket   │
    │ Routing │          │ Upgrade     │
    └────┬────┘          └──────┬──────┘
         │                      │
    ┌────┴──────────────────────┴────┐
    │    Internal Service Network    │
    │        (Docker Compose)        │
    ├────────────────────────────────┤
    │ • PinkSync      :3000          │
    │ • DeafAuth      :8001          │
    │ • PinkFlow      :8002          │
    │ • PinkyAI       :8003          │
    │ • PinkFlowAI    :5000          │
    │ • Magician      :8080          │
    └────────────────────────────────┘
```

## 🔍 Validation Checks Explained

### 1. Docker Compose Validation
```typescript
// Checks for:
- Valid YAML syntax
- Services section exists
- Port conflict detection
- Expected services present
- Volume configurations
- Network definitions
```

### 2. Nginx Configuration
```typescript
// Checks for:
- Valid nginx syntax
- Upstream definitions
- Location blocks
- SSL configuration
- Proxy settings
- Path routing
```

### 3. Deno Configuration
```typescript
// Checks for:
- Valid JSON syntax
- Tasks defined (dev, start)
- Import maps configured
- Compiler options
- Test configurations
```

### 4. Port Availability
```typescript
// Checks for:
- Port conflicts (80, 443, 3000, 5000, 8001-8003, 8080)
- Listening status
- Process occupying ports
```

### 5. File Structure
```typescript
// Checks for:
Critical files:
  - docker-compose.yml
  - nginx.conf
  - deno.json
  - server.ts

Recommended files:
  - scripts/start-all.sh
  - scripts/health-check.sh
  - PORT_MAP.md
  - SETUP_GUIDE.md
```

## 🧪 Testing Locally

### Run Validation Manually
```bash
# Install Deno if needed
curl -fsSL https://deno.land/install.sh | sh

# Run validation
deno run --allow-all scripts/validate-config.ts

# Or use task
deno task validate
```

### Expected Output
```
🔍 PinkSync Configuration Validator

================================================================================

📁 Validating File Structure...
  ✓ Critical file 'docker-compose.yml' exists
  ✓ Critical file 'nginx.conf' exists
  ✓ Critical file 'deno.json' exists
  ✓ Critical file 'server.ts' exists

🐳 Validating Docker Compose...
  ✓ Service 'pinksync' found
  ✓ Service 'deafauth' found
  ✓ Service 'pinkflow' found

🌐 Validating Nginx Configuration...
  ✓ Found 6 upstream definitions
  ✓ Found 7 location blocks
  ✓ SSL configuration detected

🦕 Validating Deno Configuration...
  ✓ Task 'dev' defined
  ✓ Task 'start' defined

🔌 Checking Port Availability...
  ✓ Port 80 is available
  ✓ Port 443 is available
  ⚠️ Port 3000 is already in use

================================================================================
📊 VALIDATION SUMMARY

✅ All configurations are valid!
================================================================================
```

## 🚀 Deployment Integration

### GitHub Actions Integration
The validation runs automatically on:

```yaml
# Triggers
- Every push to main/feat-Pinksync-AI
- Every pull request
- Daily at 6 AM UTC
- Manual trigger via Actions tab
```

### Continuous Monitoring
```yaml
jobs:
  validate-configurations:
    - Check file existence
    - Run configuration validator
    - Validate Docker Compose syntax
    - Validate Nginx configuration
    - Check port configuration
    - Generate validation report
  
  platform-health-check:
    - Run health checks
    - Validate accessibility features
  
  accessibility-compliance:
    - WCAG AAA validation
    - ASL-native UX checks
```

## 📊 Monitoring Dashboard

### Key Metrics Tracked
```typescript
interface ValidationMetrics {
  configurationValid: boolean;
  servicesHealthy: number;
  portConflicts: number;
  accessibilityScore: number;
  lastValidation: Date;
}
```

### Supabase Integration
Store validation results:

```sql
CREATE TABLE config_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  validation_status BOOLEAN NOT NULL,
  errors JSONB,
  warnings JSONB,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Security Checks

### Environment Variables
```bash
# Required variables checked:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- ANTHROPIC_API_KEY
- DENO_DEPLOY_TOKEN (production)
```

### SSL Certificate Validation
```bash
# Checks for:
- Certificate expiration
- Certificate chain validity
- SSL configuration in nginx
- HTTPS enforcement
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Port already in use"
```bash
# Find process using port
lsof -i :8001

# Kill process
kill -9 <PID>

# Or use Docker cleanup
docker compose down --remove-orphans
```

#### 2. "Nginx configuration invalid"
```bash
# Test configuration
sudo nginx -t -c /path/to/nginx.conf

# Check syntax errors
nginx -t 2>&1 | grep error
```

#### 3. "Docker Compose syntax error"
```bash
# Validate syntax
docker compose config

# Check for YAML errors
yamllint docker-compose.yml
```

#### 4. "Deno task not found"
```bash
# Check deno.json exists
cat deno.json

# List available tasks
deno task

# Re-initialize Deno
deno init
```

## 📚 Additional Resources

### Documentation
- [Port Mapping Reference](PORT_MAP.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Validation Checklist](VALIDATION_CHECKLIST.md)
- [Health Check Documentation](scripts/README.md)

### External Links
- [Deno Documentation](https://deno.land/manual)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [GitHub Actions Guide](https://docs.github.com/en/actions)

## ✅ Success Criteria

Configuration is considered valid when:

1. ✅ All critical files exist
2. ✅ Docker Compose syntax is valid
3. ✅ Nginx configuration is valid
4. ✅ No port conflicts detected
5. ✅ Deno configuration is valid
6. ✅ All services can start successfully
7. ✅ Health checks pass
8. ✅ Accessibility compliance verified

## 🎯 Next Steps

After fixing the CI:

1. **Merge the PR** - Configuration fixes are ready
2. **Deploy to mbtq.dev** - Use validated configuration
3. **Monitor health** - Set up continuous monitoring
4. **Document changes** - Update team on new validation process

## 📞 Support

If validation continues to fail:

1. Check GitHub Actions logs for detailed errors
2. Run local validation: `deno run --allow-all scripts/validate-config.ts`
3. Review port conflicts: `./scripts/health-check.sh`
4. Open an issue with validation output

---

**Built with precision for MBTQ's Deaf-first ecosystem** 🧠✨
