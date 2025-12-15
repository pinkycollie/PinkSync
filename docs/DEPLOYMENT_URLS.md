# PinkSync Deployment URLs - Quick Reference

## 🌐 Live Deployments

### Main Staging
- **URL**: https://pinkycollie.github.io/PinkSync/
- **Branch**: `main`, `staging`
- **Purpose**: Main preview environment
- **Auto-deploy**: ✅ On push

### PR Previews
- **URL Pattern**: `https://pinkycollie.github.io/PinkSync/previews/pr-{NUMBER}/`
- **Example**: PR #42 → https://pinkycollie.github.io/PinkSync/previews/pr-42/
- **Purpose**: Review pull requests before merge
- **Auto-deploy**: ✅ On PR creation/update

---

## 🔧 Branch Deployments

### Core Microservices

| Branch | Service | Deployment URL |
|--------|---------|----------------|
| `feat-Pinksync-AI` | Main Platform | https://pinkycollie.github.io/PinkSync/feat-Pinksync-AI/ |
| `service-deafauth` | DeafAuth Service | https://pinkycollie.github.io/PinkSync/service-deafauth/ |
| `service-event-orchestrator` | Event Orchestrator | https://pinkycollie.github.io/PinkSync/service-event-orchestrator/ |
| `service-rag-engine` | RAG Engine | https://pinkycollie.github.io/PinkSync/service-rag-engine/ |
| `service-workers` | Background Workers | https://pinkycollie.github.io/PinkSync/service-workers/ |
| `service-api-broker` | API Broker | https://pinkycollie.github.io/PinkSync/service-api-broker/ |
| `service-pinkflow` | PinkFlow Engine | https://pinkycollie.github.io/PinkSync/service-pinkflow/ |
| `service-asl-glosser` | ASL Glosser | https://pinkycollie.github.io/PinkSync/service-asl-glosser/ |
| `service-sign-speak` | Sign Speak | https://pinkycollie.github.io/PinkSync/service-sign-speak/ |
| `service-vcode` | VCode | https://pinkycollie.github.io/PinkSync/service-vcode/ |
| `service-interpreters` | Interpreters | https://pinkycollie.github.io/PinkSync/service-interpreters/ |

### Extended Services

| Branch | Service | Deployment URL |
|--------|---------|----------------|
| `integrated-360-Magicians` | 360 Magicians | https://pinkycollie.github.io/PinkSync/integrated-360-Magicians/ |
| `vcode` | VCode Platform | https://pinkycollie.github.io/PinkSync/vcode/ |
| `videoized` | Analytics Platform | https://pinkycollie.github.io/PinkSync/videoized/ |
| `QR-Code-Holograms` | QR Scanner | https://pinkycollie.github.io/PinkSync/QR-Code-Holograms/ |
| `REGISTRATION` | Registration System | https://pinkycollie.github.io/PinkSync/REGISTRATION/ |
| `admin-console` | Admin Console | https://pinkycollie.github.io/PinkSync/admin-console/ |

### API Branches

| Branch | API | Deployment URL |
|--------|-----|----------------|
| `api-accessibility` | Accessibility API | https://pinkycollie.github.io/PinkSync/api-accessibility/ |
| `api-deaf-first-identity` | Identity API | https://pinkycollie.github.io/PinkSync/api-deaf-first-identity/ |
| `api-sign-language-auth` | Sign Language Auth | https://pinkycollie.github.io/PinkSync/api-sign-language-auth/ |
| `api-interpreters` | Interpreters API | https://pinkycollie.github.io/PinkSync/api-interpreters/ |

### Tool Branches

| Branch | Tool | Deployment URL |
|--------|------|----------------|
| `tool-scanqr` | QR Scanner Tool | https://pinkycollie.github.io/PinkSync/tool-scanqr/ |
| `tool-video-processor` | Video Processor | https://pinkycollie.github.io/PinkSync/tool-video-processor/ |

### Video Processing

| Branch | Service | Deployment URL |
|--------|---------|----------------|
| `video-processor` | Video Processor | https://pinkycollie.github.io/PinkSync/video-processor/ |
| `data-processor-worker` | Data Worker | https://pinkycollie.github.io/PinkSync/data-processor-worker/ |

---

## 🚀 How to Deploy Your Branch

### 1. Create a Branch
Use one of the supported branch patterns:
```bash
git checkout -b service-my-service
# or
git checkout -b api-my-api
# or
git checkout -b tool-my-tool
# or
git checkout -b feat-my-feature
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Your changes"
git push origin <branch-name>
```

### 3. Access Your Deployment
Your branch will be automatically deployed to:
```
https://pinkycollie.github.io/PinkSync/<branch-name>/
```

---

## 📋 Supported Branch Patterns

Branches matching these patterns automatically deploy to GitHub Pages:

- `service-*` - Service branches
- `api-*` - API branches
- `tool-*` - Tool branches
- `feat-*` - Feature branches
- `feature-*` - Feature branches (alternative)
- `video-*` - Video processing
- `data-*` - Data processing
- `integrated-*` - Integrations
- `QR-Code-*` - QR system
- `admin-*` - Admin tools
- Special: `vcode`, `videoized`, `REGISTRATION`

---

## 🔍 Check Deployment Status

1. Go to **Actions** tab
2. Select **Branch GitHub Pages Deployment**
3. Find your branch in the workflow runs
4. Click on the run to see deployment logs

---

## 📚 Documentation

- **Branch Deployments Guide**: [BRANCH_DEPLOYMENTS.md](./BRANCH_DEPLOYMENTS.md)
- **Staging Guide**: [STAGING.md](./STAGING.md)
- **Microservices Catalog**: [MICROSERVICES_CATALOG.md](../MICROSERVICES_CATALOG.md)

---

## 🎯 Production Deployments

### MBTQ Platform
- **Main**: https://mbtq.dev
- **Sync**: https://sync.mbtq.dev
- **API**: https://api.mbtq.dev
- **Auth**: https://auth.mbtq.dev

### Partner Platforms
- **360 Magicians**: https://360magicians.com
- **VR4Deaf**: https://vr4deaf.org

---

**💡 Tip**: Bookmark this page for quick access to all deployment URLs!
