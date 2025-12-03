# PinkSync Microservices Catalog

> **Complete catalog of all microservices across all branches**  
> Last Updated: December 2025

## 📊 Overview

PinkSync's architecture uses a distributed microservices approach with features developed across multiple Git branches. This document catalogs all services, their purposes, and which branches contain them.

## 🏗️ Architecture Pattern

```
                    ┌─────────────────────┐
                    │   Kong Gateway      │
                    │   (API Gateway)     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
         │ Core    │     │Extended │     │Feature  │
         │Services │     │Services │     │Services │
         └─────────┘     └─────────┘     └─────────┘
              │                │                │
         ┌────┴────┐      ┌───┴────┐      ┌────┴────┐
         │Database │      │Cache   │      │Storage  │
         │(Supabase│      │(Redis) │      │(S3/IPFS)│
         └─────────┘      └────────┘      └─────────┘
```

---

## 🎯 Core Microservices (Main Branch: `feat-Pinksync-AI`)

### 1. **deafauth** 🔐
**Branch**: `feat-Pinksync-AI`  
**Port**: 3000  
**Purpose**: Visual-first authentication and identity management

**Features**:
- Sign language video authentication
- Biometric visual patterns
- Multi-device profile sync
- Deaf cultural identity verification
- JWT token generation
- Session management

**API Endpoints**:
```
POST   /auth/register
POST   /auth/login
POST   /auth/video-verify
GET    /auth/profile
PUT    /auth/preferences
DELETE /auth/logout
```

**Dependencies**:
- PostgreSQL (user data)
- Redis (sessions)
- S3 (video storage)

**Tech Stack**: Deno, PostgreSQL, Redis

---

### 2. **event-orchestrator** 🎭
**Branch**: `feat-Pinksync-AI`  
**Port**: 3010  
**Purpose**: Real-time event processing and routing

**Features**:
- WebSocket event streaming
- Event pattern matching
- Cross-service communication
- Real-time notifications
- Event replay capabilities

**Events Handled**:
```typescript
- user.login
- user.preference.changed
- content.accessibility.needed
- video.caption.requested
- asl.recognition.detected
- interpreter.booking.created
```

**Tech Stack**: Deno, Redis Streams, WebSocket

---

### 3. **rag-engine** 🤖
**Branch**: `feat-Pinksync-AI`  
**Port**: 3020  
**Purpose**: Research-Augmented Generation for accessibility

**Features**:
- Vector similarity search
- Research document indexing
- Community feedback analysis
- Semantic search
- Contextual recommendations

**API Endpoints**:
```
POST   /rag/search
POST   /rag/index
GET    /rag/recommendations
POST   /rag/feedback
```

**Tech Stack**: Deno, Qdrant (Vector DB), OpenAI Embeddings

---

### 4. **workers** 👷
**Branch**: `feat-Pinksync-AI`  
**Port**: 3030  
**Purpose**: Background job processing

**Job Types**:
- Content transformation (audio → text)
- Video processing (caption generation)
- Research indexing
- Email notifications
- Data aggregation

**Queue System**: BullMQ with Redis

**Tech Stack**: Deno, BullMQ, Redis

---

### 5. **api-broker** 🌉
**Branch**: `feat-Pinksync-AI`  
**Port**: 3040  
**Purpose**: Unified gateway to partner services

**Integrated Partners**:
- Vocational rehabilitation services
- Educational platforms
- Employment services
- Healthcare providers
- Community organizations

**API Endpoints**:
```
GET    /partners
POST   /partners/:id/connect
GET    /partners/:id/services
POST   /partners/:id/request
```

**Tech Stack**: Deno, REST APIs

---

### 6. **pinkflow** 🌊
**Branch**: `feat-Pinksync-AI`  
**Port**: 3050  
**Purpose**: Real-time accessibility transformation

**Features**:
- Dynamic content simplification
- Visual enhancement processing
- Sign language overlay injection
- Color contrast adjustment
- Font size optimization

**Processing Pipeline**:
```
Input → Analyze → Transform → Cache → Output
```

**Tech Stack**: Deno, Sharp (image processing), FFmpeg

---

### 7. **asl-glosser** 🤟
**Branch**: `feat-Pinksync-AI`  
**Port**: 3060  
**Purpose**: ASL glossing and sign language processing

**Features**:
- ASL-to-English conversion
- Sign language dictionary
- Gloss notation generation
- Cultural context preservation
- Multi-dialect support

**API Endpoints**:
```
POST   /gloss/translate
GET    /gloss/dictionary/:word
POST   /gloss/analyze-video
GET    /gloss/cultural-context
```

**Tech Stack**: Deno, ML Models, Video processing

---

### 8. **sign-speak** 🗣️
**Branch**: `feat-Pinksync-AI`  
**Port**: 3070  
**Purpose**: Comprehensive sign language service

**Features**:
- Real-time sign language recognition
- Multiple sign languages (ASL, BSL, ISL, etc.)
- Gesture analysis
- Sign-to-text conversion
- Text-to-sign generation

**Supported Languages**:
- ASL (American Sign Language)
- BSL (British Sign Language)
- ISL (Irish Sign Language)
- Auslan (Australian Sign Language)
- JSL (Japanese Sign Language)

**Tech Stack**: Deno, TensorFlow, MediaPipe

---

### 9. **vcode** 📹
**Branch**: `feat-Pinksync-AI`  
**Port**: 3080  
**Purpose**: Core video communication service

**Features**:
- Deaf-first video calling
- Platform integration (Zoom, Meet, Teams)
- Evidence generation
- Meeting transcription
- Visual indicators

**Tech Stack**: Deno, WebRTC, LiveKit

---

### 10. **interpreters** 👥
**Branch**: `feat-Pinksync-AI`  
**Port**: 3090  
**Purpose**: Interpreter booking and management

**Features**:
- Interpreter scheduling
- Availability management
- Real-time booking
- Session recording
- Payment processing

**API Endpoints**:
```
GET    /interpreters/available
POST   /interpreters/book
GET    /interpreters/sessions
POST   /interpreters/cancel
```

**Tech Stack**: Deno, PostgreSQL, Calendar APIs

---

## 🎨 Extended Microservices

### 360 Magicians Platform (`integrated-360-Magicians`)

#### 11. **accessibility-api** ♿
**Port**: 4000  
**Purpose**: Accessibility feature APIs

**Features**:
- WCAG AAA compliance checking
- Visual feedback systems
- Deaf-first design patterns
- Multi-modal accessibility

**Tech Stack**: Python, FastAPI

---

#### 12. **deaf-first-identity** 🎭
**Port**: 4010  
**Purpose**: Cultural identity management

**Features**:
- Deaf community networking
- Cultural celebration tracking
- Advocacy tools
- Community resources

**Tech Stack**: Python, PostgreSQL

---

#### 13. **sign-language-auth** 🔏
**Port**: 4020  
**Purpose**: Advanced sign language authentication

**Features**:
- Video-based identity verification
- Cultural competency validation
- Secure access control
- Biometric sign patterns

**Tech Stack**: Python, OpenCV, PyTorch

---

### VCode Platform (`vcode`)

#### 14. **ai-service** 🧠
**Port**: 5000  
**Purpose**: AI and ML processing

**Features**:
- Groq AI integration
- Whisper transcription
- Specialized models (Medical, Legal, Technical)
- Real-time AI assistance
- ASL processing

**Models Used**:
- `whisper-large-v3` - Transcription
- `llama-3.1-70b-versatile` - Analysis
- `mixtral-8x7b-32768` - Technical discussions

**Tech Stack**: Python, Groq API, TensorFlow

---

#### 15. **content-service** 📝
**Port**: 5010  
**Purpose**: Content management

**Features**:
- Multi-modal evidence generation
- Meeting content analysis
- Document management
- Transcription storage

**Tech Stack**: Node.js, MongoDB

---

#### 16. **user-service** 👤
**Port**: 5020  
**Purpose**: User profile management

**Features**:
- Profile CRUD operations
- Preference storage
- Session management
- Deaf user customization

**Tech Stack**: Node.js, PostgreSQL

---

#### 17. **vr-service** 🥽
**Port**: 5030  
**Purpose**: Virtual reality accessibility

**Features**:
- VR meeting accessibility
- Immersive sign language environments
- 3D visual communication
- Spatial audio alternatives

**Tech Stack**: Node.js, WebXR, Three.js

---

### Analytics Platform (`videoized`)

#### 18. **pink-sync-analytics** 📊
**Port**: 6000  
**Purpose**: Usage analytics and insights

**Features**:
- User engagement tracking
- Accessibility metrics
- Platform performance
- A/B testing
- Funnel analysis

**Tech Stack**: TypeScript, ClickHouse, Grafana

---

#### 19. **pink-sync-preloader** ⚡
**Port**: 6010  
**Purpose**: Performance optimization

**Features**:
- Resource preloading
- Asset optimization
- CDN integration
- Cache management
- Fast initial loads

**Tech Stack**: TypeScript, Cloudflare Workers

---

## 🎯 Feature-Specific Services

### QR Code System (`QR-Code-Holograms`)

#### 20. **scanqr-service**
**Purpose**: QR code processing and AR holograms

**Features**:
- QR code scanning
- AR sign language holograms
- Visual information accessibility
- Library management

**API Routes**:
```
POST   /api/scanqr/process
POST   /api/scanqr/sync
GET    /api/scanqr/library
GET    /api/scanqr/library/:id
```

---

### Registration System (`REGISTRATION`)

#### 21. **registration-service**
**Purpose**: Enhanced user registration

**Features**:
- Multi-step registration
- Video verification
- Accessibility questionnaire
- Sign language preference selection

---

### Admin Console (`admin-console`)

#### 22. **admin-service**
**Purpose**: Platform administration

**Features**:
- User management
- Service monitoring
- Configuration management
- Data seeding

**API Routes**:
```
POST   /api/admin/seed-pinksync-info
GET    /api/admin/users
PUT    /api/admin/config
GET    /api/admin/metrics
```

---

### Video Processing (`data-processor-worker`, `video-processor`)

#### 23. **video-processor-service**
**Purpose**: Video processing and analytics

**Features**:
- Mux integration
- Video encoding
- Caption generation
- Multi-tenant support
- WebSocket streaming

**Tech Stack**: Node.js, Mux, FFmpeg

---

## 📋 Service Dependency Matrix

| Service | Depends On | Used By |
|---------|-----------|---------|
| deafauth | PostgreSQL, Redis | All services |
| event-orchestrator | Redis | All services |
| rag-engine | Qdrant, OpenAI | pinkflow, workers |
| workers | Redis, All services | Background tasks |
| api-broker | External APIs | Web app, extension |
| pinkflow | Sharp, FFmpeg | Extension, web app |
| asl-glosser | ML models | sign-speak, extension |
| sign-speak | MediaPipe, TensorFlow | Extension, vcode |
| vcode | WebRTC, LiveKit | Web app, extension |
| interpreters | PostgreSQL | Web app |

---

## 🚀 Deployment Architecture

### Development
```bash
# Start all core services
docker-compose up -d

# Start specific service
docker-compose up deafauth
```

### Production
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Or use Helm
helm install pinksync ./charts/pinksync
```

### Service Discovery
All services register with Kong Gateway:
```
https://api.pinksync.io/auth/*      → deafauth
https://api.pinksync.io/events/*    → event-orchestrator
https://api.pinksync.io/rag/*       → rag-engine
https://api.pinksync.io/video/*     → vcode
```

---

## 📊 Performance Requirements

| Service | Response Time | Throughput | Availability |
|---------|--------------|------------|--------------|
| deafauth | < 100ms | 1000 req/s | 99.9% |
| event-orchestrator | < 50ms | 10000 events/s | 99.99% |
| rag-engine | < 500ms | 100 req/s | 99.5% |
| vcode | < 200ms | 500 connections | 99.9% |
| sign-speak | < 100ms | 1000 frames/s | 99.5% |

---

## 🔐 Security Considerations

### Authentication Flow
```
1. User → deafauth (video verification)
2. deafauth → JWT token
3. User → Any service (with JWT)
4. Service → Validate JWT with deafauth
5. Service → Process request
```

### Data Encryption
- All services use TLS 1.3
- Database encryption at rest
- Video storage encrypted
- JWT tokens with short expiry

---

## 📚 API Documentation

Each service has OpenAPI/Swagger documentation:

- `http://localhost:3000/docs` - deafauth
- `http://localhost:3010/docs` - event-orchestrator
- `http://localhost:3020/docs` - rag-engine
- etc.

---

## 🧪 Testing Strategy

### Unit Tests
```bash
# Test all services
deno test --allow-all

# Test specific service
cd services/deafauth && deno test
```

### Integration Tests
```bash
# E2E tests
npm run test:e2e
```

### Load Tests
```bash
# Load test with k6
k6 run tests/load/deafauth.js
```

---

## 📈 Monitoring

### Metrics
- Prometheus scrapes all services on `/metrics`
- Grafana dashboards for visualization
- Alertmanager for critical alerts

### Logging
- Structured JSON logging
- Centralized logging with Loki
- Log levels: DEBUG, INFO, WARN, ERROR

### Tracing
- OpenTelemetry for distributed tracing
- Jaeger for trace visualization

---

## 🔄 Service Communication

### Synchronous (REST)
```typescript
// Service-to-service REST call
const response = await fetch('http://deafauth:3000/auth/verify', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ userId })
});
```

### Asynchronous (Events)
```typescript
// Publish event
await eventOrchestrator.publish('user.preference.changed', {
  userId: '123',
  preferences: { /* ... */ }
});

// Subscribe to event
eventOrchestrator.subscribe('user.preference.changed', async (event) => {
  // Handle event
});
```

### Message Queue
```typescript
// Add job to queue
await workers.addJob('video.process', {
  videoUrl: 'https://...',
  userId: '123'
});
```

---

## 🛠️ Development Setup

### Prerequisites
```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh

# Install Docker
brew install docker

# Install dependencies
deno cache --reload server.ts
```

### Environment Variables
```bash
# .env.example
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
QDRANT_URL=http://localhost:6333
GROQ_API_KEY=...
OPENAI_API_KEY=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

### Running Locally
```bash
# Start infrastructure
docker-compose up postgres redis qdrant -d

# Start services
deno task dev
```

---

## 📖 Additional Resources

- [Architecture Documentation](./docs/architecture-complete.md)
- [API Gateway Guide](./docs/api-gateway.md)
- [Modern Integrations](./MODERN_INTEGRATIONS.md)
- [Contributing Guide](./docs/contributing.md)

---

## 🗺️ Service Roadmap

### Q1 2026
- [ ] Implement Kong Gateway
- [ ] Migrate to Qdrant
- [ ] Add MediaPipe ASL detection
- [ ] Deploy LiveKit

### Q2 2026
- [ ] Add more sign languages
- [ ] Improve video quality
- [ ] Scale to 10K users
- [ ] Mobile app support

### Q3 2026
- [ ] VR accessibility features
- [ ] Blockchain identity
- [ ] Multi-region deployment
- [ ] Advanced AI models

---

**Questions or Issues?**  
Open a GitHub issue or contact the PinkSync team.

**Want to Contribute?**  
See [CONTRIBUTING.md](./docs/contributing.md) for guidelines.
