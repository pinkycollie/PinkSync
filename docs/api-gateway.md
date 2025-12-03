# PinkSync API Gateway Documentation

## Overview

PinkSync provides a unified REST API gateway for both the web application and browser extension. The API follows RESTful principles and uses JSON for all request/response payloads.

## Base URL

### Development
```
http://localhost:3000/api
```

### Production
```
https://pinksync.mbtq.dev/api
```

## Authentication

Most endpoints require authentication via Bearer token:

```
Authorization: Bearer <token>
```

Tokens are obtained through the login endpoint and stored securely by the client.

## Extension API Endpoints

These endpoints are specifically designed for the PinkSync browser extension:

### 1. Login
**POST** `/api/auth`

Get authentication token for the extension.

**Request:**
```json
{
  "action": "login",
  "credentials": {
    "username": "user@example.com",
    "password": "password123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "token": "token_user_123_abc...",
  "user": {
    "id": "user_123",
    "username": "user@example.com",
    "email": "user@example.com",
    "displayName": "John Doe",
    "preferences": {
      "simplifyText": true,
      "visualEnhancements": true,
      "signLanguage": false,
      "transcription": true,
      "captioning": true,
      "colorScheme": "light",
      "fontSize": "medium",
      "animations": true
    }
  }
}
```

### 2. Get Preferences
**GET** `/api/auth/preferences`

Retrieve current user preferences (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "simplifyText": true,
    "visualEnhancements": true,
    "signLanguage": false,
    "transcription": true,
    "captioning": true,
    "colorScheme": "light",
    "fontSize": "medium",
    "animations": true
  },
  "user": {
    "id": "user_123",
    "username": "user@example.com",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

### 3. Update Preferences
**POST** `/api/auth`

Update user preferences.

**Request:**
```json
{
  "action": "update-preferences",
  "userId": "user_123",
  "preferences": {
    "simplifyText": false,
    "fontSize": "large"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

### 4. Logout
**POST** `/api/auth`

Invalidate authentication token.

**Request:**
```json
{
  "action": "logout",
  "token": "token_user_123_abc..."
}
```

**Response:**
```json
{
  "success": true
}
```

### 5. Validate Token
**POST** `/api/auth`

Check if a token is still valid.

**Request:**
```json
{
  "action": "validate",
  "token": "token_user_123_abc..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "user@example.com",
    "email": "user@example.com",
    "preferences": { ... }
  }
}
```

## Platform API Endpoints

### Platform Status
**GET** `/api/platform`

Get platform status and configuration.

**Response:**
```json
{
  "success": true,
  "platform": {
    "name": "PinkSync",
    "version": "1.0.0",
    "status": "operational",
    "services": {
      "deafauth": "active",
      "pinkflow": "active",
      "rag-engine": "active",
      "workers": "active"
    }
  }
}
```

### Content Transformation
**POST** `/api/transform`

Transform content using PinkFlow engine.

**Request:**
```json
{
  "content": "Complex text to simplify",
  "transformations": ["simplify", "visualize"]
}
```

**Response:**
```json
{
  "success": true,
  "transformed": {
    "original": "Complex text to simplify",
    "simplified": "Easy text to understand",
    "visualized": "<enhanced HTML>"
  }
}
```

### Search Providers
**POST** `/api/providers`

Search for service providers.

**Request:**
```json
{
  "action": "search",
  "query": "ASL interpreter",
  "filters": {
    "type": "interpreter",
    "location": "CA"
  }
}
```

### Research & Learning
**POST** `/api/research`

Access RAG engine for research and recommendations.

**Request:**
```json
{
  "action": "search",
  "query": "deaf accessibility best practices"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

- `AUTH_FAILED` - Authentication failed
- `NO_TOKEN` - No authentication token provided
- `INVALID_TOKEN` - Token is invalid or expired
- `INVALID_ACTION` - Invalid action specified
- `AUTH_ERROR` - General authentication error
- `VALIDATION_ERROR` - Request validation failed
- `SERVER_ERROR` - Internal server error

## Rate Limiting

- **Standard endpoints**: 100 requests per minute
- **Auth endpoints**: 10 requests per minute
- **Extension sync**: 1 request per 5 minutes (enforced by extension)

## CORS

The API supports CORS for browser extension origins:

```
Access-Control-Allow-Origin: chrome-extension://*
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Webhook Events

The extension can subscribe to real-time events:

### Preference Update
Triggered when preferences are updated on any device.

### Provider Update
Triggered when new providers become available.

### Service Alert
Triggered for important platform notifications.

## Extension Integration Flow

```
1. User installs extension
   ↓
2. Extension shows login screen
   ↓
3. User enters credentials → POST /api/auth (login)
   ↓
4. Extension receives token + preferences
   ↓
5. Extension saves token locally
   ↓
6. Extension starts periodic sync (every 5 min)
   ↓
7. Extension fetches preferences → GET /api/auth/preferences
   ↓
8. Extension applies preferences to all websites
   ↓
9. User changes preference in extension
   ↓
10. Extension updates → POST /api/auth (update-preferences)
    ↓
11. All tabs receive update and re-apply
```

## Security Best Practices

### For Extension
- Store tokens in `chrome.storage.local` (encrypted by Chrome)
- Never expose tokens in console logs
- Use HTTPS for all API calls
- Validate API responses before use
- Clear tokens on logout

### For API
- Use secure token generation
- Implement token expiration (24 hours recommended)
- Rate limit authentication attempts
- Log failed authentication attempts
- Use HTTPS only in production

## Testing

### Using cURL

```bash
# Login
curl -X POST https://pinksync.mbtq.dev/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"login","credentials":{"username":"test","password":"test"}}'

# Get preferences
curl -X GET https://pinksync.mbtq.dev/api/auth/preferences \
  -H "Authorization: Bearer <token>"
```

### Using Extension DevTools

```javascript
// In extension background console
chrome.runtime.sendMessage({
  type: 'LOGIN',
  credentials: { username: 'test', password: 'test' }
}, response => {
  console.log('Login response:', response);
});
```

## Support

- GitHub Issues: https://github.com/pinkycollie/PinkSync/issues
- API Status: https://status.pinksync.mbtq.dev
- Documentation: https://docs.pinksync.mbtq.dev

## Version History

- **v1.0.0** (2024-12-03) - Initial release
  - Core authentication endpoints
  - Extension integration support
  - Preference sync functionality
