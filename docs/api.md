# PinkSync API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Platform API

### Get Platform Status
Get current platform configuration and service statistics.

**Endpoint**: `GET /api/platform`

**Response**:
```json
{
  "success": true,
  "data": {
    "environment": "standalone",
    "features": {
      "deafAuth": true,
      "eventOrchestrator": true,
      "ragEngine": true,
      "backgroundWorkers": true,
      "apiBroker": true,
      "pinkFlow": true,
      "signalSystem": true,
      "notificator": true
    },
    "services": {
      "eventOrchestrator": {
        "handlerCount": 5,
        "globalHandlerCount": 2,
        "queueLength": 0,
        "middlewareCount": 1
      },
      "ragEngine": {
        "documentCount": 10,
        "indexedTerms": 250,
        "verifiedDocuments": 8
      },
      "apiBroker": {
        "totalProviders": 4,
        "activeProviders": 4,
        "averageAccessibilityScore": 87.5
      }
    }
  }
}
```

---

## Authentication API

### Login
Authenticate user with visual verification.

**Endpoint**: `POST /api/auth`

**Request**:
```json
{
  "action": "login",
  "credentials": {
    "username": "user123",
    "password": "secure_password"
  },
  "verification": {
    "pattern": ["1", "3", "5"],
    "type": "image-selection"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "username": "user123",
      "email": "user@example.com",
      "preferences": {
        "simplifyText": true,
        "visualEnhancements": true
      }
    },
    "token": "token_abc123"
  }
}
```

### Register
Register a new user account.

**Endpoint**: `POST /api/auth`

**Request**:
```json
{
  "action": "register",
  "credentials": {
    "username": "newuser",
    "password": "secure_password"
  },
  "profile": {
    "email": "newuser@example.com",
    "displayName": "New User",
    "communicationPreferences": {
      "preferredLanguage": "en",
      "textComplexity": "simple",
      "visualAids": true,
      "captioning": true
    }
  }
}
```

### Update Preferences
Update user accessibility preferences.

**Endpoint**: `POST /api/auth`

**Request**:
```json
{
  "action": "update-preferences",
  "userId": "user_123",
  "preferences": {
    "simplifyText": true,
    "visualEnhancements": true,
    "signLanguage": false,
    "transcription": true
  }
}
```

### Logout
End user session.

**Endpoint**: `POST /api/auth`

**Request**:
```json
{
  "action": "logout",
  "token": "token_abc123"
}
```

---

## Content Transformation API

### Transform Content
Transform content using PinkFlow engine.

**Endpoint**: `POST /api/transform`

**Request**:
```json
{
  "content": "The vocational rehabilitation assessment process necessitates comprehensive documentation.",
  "type": "simplify",
  "userId": "user_123",
  "preferences": {
    "textComplexity": "simple"
  },
  "async": false
}
```

**Transformation Types**:
- `simplify` - Simplify complex text
- `visualize` - Add visual elements
- `transcribe` - Convert audio to text
- `sign-language` - Add sign language markers
- `structure` - Improve content structure

**Response** (sync):
```json
{
  "success": true,
  "data": {
    "id": "transform_123",
    "originalContent": "The vocational rehabilitation...",
    "transformedContent": "The job support evaluation needs these documents:\n• Learning assessments\n• What you can do at work",
    "transformationType": "simplify",
    "metadata": {
      "complexity": 65,
      "readabilityScore": 85,
      "confidence": 0.9,
      "processingTime": 45
    }
  }
}
```

**Response** (async):
```json
{
  "success": true,
  "data": {
    "jobId": "job_456",
    "status": "queued"
  }
}
```

### Get Transformation
Retrieve a previous transformation.

**Endpoint**: `GET /api/transform?id={transformationId}`

### Get User Transformations
Get all transformations for a user.

**Endpoint**: `GET /api/transform?userId={userId}`

---

## Providers API

### Get All Providers
Retrieve all service providers.

**Endpoint**: `GET /api/providers`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "provider_123",
      "name": "State Vocational Rehabilitation",
      "type": "vocational-rehabilitation",
      "description": "State-funded vocational rehabilitation services...",
      "accessibilityScore": 85,
      "active": true,
      "capabilities": [
        {
          "name": "job-assessment",
          "description": "Comprehensive job skills assessment"
        }
      ]
    }
  ]
}
```

### Get Provider by ID
**Endpoint**: `GET /api/providers?id={providerId}`

### Search Providers
**Endpoint**: `GET /api/providers?search={query}&type={type}`

**Types**:
- `vocational-rehabilitation`
- `education`
- `employment`
- `healthcare`
- `community`
- `government`
- `enterprise`

### Match Providers
Find providers matching user needs.

**Endpoint**: `POST /api/providers`

**Request**:
```json
{
  "action": "match",
  "userId": "user_123",
  "needs": {
    "type": "vocational-rehabilitation",
    "keywords": ["job training", "assessment"],
    "minAccessibilityScore": 80
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "provider_123",
      "name": "State Vocational Rehabilitation",
      "accessibilityScore": 85,
      "relevanceScore": 0.95
    }
  ]
}
```

### Call Provider API
Execute a provider capability.

**Endpoint**: `POST /api/providers`

**Request**:
```json
{
  "action": "call",
  "providerId": "provider_123",
  "capability": "job-assessment",
  "parameters": {
    "userId": "user_123",
    "assessmentType": "comprehensive"
  }
}
```

---

## Research API

### Search Research Documents
Search the RAG knowledge base.

**Endpoint**: `GET /api/research?query={searchQuery}&top={limit}&type={type}`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "document": {
        "id": "doc_123",
        "title": "Visual Authentication Best Practices",
        "content": "Visual authentication methods...",
        "type": "accessibility-guideline",
        "tags": ["authentication", "visual"],
        "communityVotes": 45,
        "verified": true
      },
      "score": 0.92
    }
  ]
}
```

### Get Document by ID
**Endpoint**: `GET /api/research?id={documentId}`

### Get Documents by Type
**Endpoint**: `GET /api/research?type={type}`

**Types**:
- `accessibility-guideline`
- `community-feedback`
- `usage-pattern`
- `best-practice`
- `provider-review`
- `technical-documentation`

### Index Document
Add a new research document.

**Endpoint**: `POST /api/research`

**Request**:
```json
{
  "action": "index",
  "document": {
    "title": "New Accessibility Research",
    "content": "Research content here...",
    "source": "Community Feedback",
    "type": "community-feedback",
    "tags": ["accessibility", "feedback"],
    "communityVotes": 0,
    "verified": false
  }
}
```

### Vote on Document
Vote for a research document.

**Endpoint**: `POST /api/research`

**Request**:
```json
{
  "action": "vote",
  "documentId": "doc_123",
  "increment": 1
}
```

### Get Recommendations
Get personalized research recommendations.

**Endpoint**: `POST /api/research`

**Request**:
```json
{
  "action": "recommend",
  "userId": "user_123",
  "preferences": {
    "interests": ["employment", "training"]
  }
}
```

---

## Workers API

### Get Job Status
Check status of a background job.

**Endpoint**: `GET /api/workers?id={jobId}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "job_123",
    "type": "content.simplify",
    "status": "completed",
    "priority": "normal",
    "result": {
      "transformedContent": "Simplified text..."
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "completedAt": "2025-01-01T00:00:05Z"
  }
}
```

### Get Jobs by Status
**Endpoint**: `GET /api/workers?status={status}`

**Statuses**: `pending`, `processing`, `completed`, `failed`, `cancelled`

### Queue Job
Submit a background job.

**Endpoint**: `POST /api/workers`

**Request**:
```json
{
  "action": "queue",
  "type": "content.simplify",
  "payload": {
    "content": "Complex text here...",
    "userId": "user_123"
  },
  "priority": "high"
}
```

**Job Types**:
- `content.simplify`
- `content.translate`
- `provider.sync`
- `research.index`
- `user.match`
- `notification.send`
- `analytics.process`

### Cancel Job
Cancel a pending job.

**Endpoint**: `POST /api/workers`

**Request**:
```json
{
  "action": "cancel",
  "jobId": "job_123"
}
```

### Get Worker Statistics
**Endpoint**: `POST /api/workers`

**Request**:
```json
{
  "action": "stats"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

**Common Error Codes**:
- `AUTH_FAILED` - Authentication failed
- `NOT_FOUND` - Resource not found
- `INVALID_INPUT` - Invalid request parameters
- `INVALID_ACTION` - Invalid action specified
- `PLATFORM_ERROR` - Internal platform error
- `TRANSFORM_ERROR` - Content transformation error
- `PROVIDER_ERROR` - Provider operation error
- `RESEARCH_ERROR` - Research operation error
- `WORKER_ERROR` - Worker operation error

---

## Rate Limiting

Rate limits are applied per IP address:
- **Authentication**: 10 requests per minute
- **Transformation**: 60 requests per minute
- **Search/Query**: 100 requests per minute
- **Provider APIs**: 30 requests per minute

---

## WebSocket API (Future)

Real-time events will be available via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('message', (event) => {
  console.log('Received:', event);
});
```

**Event Types**:
- `content.transformed` - Content transformation complete
- `provider.matched` - Provider match found
- `notification.new` - New notification
- `signal.received` - Real-time signal
