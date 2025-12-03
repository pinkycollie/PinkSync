# PinkSync Complete Architecture

## Executive Summary

PinkSync is a comprehensive accessibility platform consisting of two primary components:

1. **DeafAUTH Backend** - Authentication and preference management system
2. **PinkSync Browser Extension** - Client-side accessibility enforcement

Together, they provide seamless accessibility across all websites by storing preferences centrally and applying them locally.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PINKSYNC ECOSYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐     ┌──────────────────────────────┐
│    DeafAUTH Backend (API)    │     │  PinkSync Extension (Client) │
│                              │     │                              │
│  ┌────────────────────────┐  │     │  ┌────────────────────────┐ │
│  │  Authentication        │  │     │  │  Background Worker     │ │
│  │  - Login/Register      │  │     │  │  - Sync every 5 min    │ │
│  │  - Token management    │  │     │  │  - Manage state        │ │
│  │  - Session handling    │  │     │  │  - Broadcast updates   │ │
│  └────────────────────────┘  │     │  └────────────────────────┘ │
│                              │     │                              │
│  ┌────────────────────────┐  │     │  ┌────────────────────────┐ │
│  │  Preference Storage    │  │     │  │  Content Scripts       │ │
│  │  - User settings       │  │     │  │  - Run on every page   │ │
│  │  - Accessibility prefs │  │     │  │  - Apply preferences   │ │
│  │  - Multi-device sync   │  │     │  │  - Enable captions     │ │
│  └────────────────────────┘  │     │  │  - Visual alerts       │ │
│                              │     │  │  - Auto-fill forms     │ │
│  ┌────────────────────────┐  │     │  └────────────────────────┘ │
│  │  PinkFlow Engine       │  │     │                              │
│  │  - Text simplification │  │     │  ┌────────────────────────┐ │
│  │  - Content transform   │  │     │  │  Popup UI              │ │
│  │  - Visual enhancement  │  │     │  │  - Quick settings      │ │
│  └────────────────────────┘  │     │  │  - Status display      │ │
│                              │     │  │  - Login interface     │ │
│  ┌────────────────────────┐  │     │  └────────────────────────┘ │
│  │  Service Integrations  │  │     │                              │
│  │  - Sign-Speak          │  │     └──────────────────────────────┘
│  │  - Interpreters        │  │                   │
│  │  - vCODE               │  │                   │
│  │  - Providers           │  │                   │
│  └────────────────────────┘  │                   │
│                              │                   │
└──────────────┬───────────────┘                   │
               │                                   │
               │     REST API (HTTPS)              │
               │     - POST /api/auth (login)      │
               │     - GET /api/auth/preferences   │
               │     - POST /api/auth (update)     │
               └───────────────────────────────────┘
                                │
                                ▼
               ┌────────────────────────────────────┐
               │         Target Websites            │
               │  ✓ YouTube → Captions enabled      │
               │  ✓ Netflix → Subtitles on          │
               │  ✓ Zoom → Live captions active     │
               │  ✓ Teams → Captions enabled        │
               │  ✓ Hotels → Accessibility checked  │
               │  ✓ All → Visual enhancements       │
               └────────────────────────────────────┘
```

## Component Details

### 1. DeafAUTH Backend (The Brain)

**Purpose**: Centralized authentication and preference management

**Technology Stack**:
- Next.js 15 (App Router)
- TypeScript
- Node.js runtime
- In-memory session storage (production: Redis/Database)

**Key Services**:

#### a. Authentication Service (`/services/deafauth`)
```typescript
- authenticate(credentials, verification) → Token
- register(credentials, profile) → User
- validateToken(token) → User | null
- logout(token) → void
- updatePreferences(userId, preferences) → void
```

#### b. Event Orchestrator (`/services/event-orchestrator`)
```typescript
- userAuth(userId, platform, metadata) → Event
- preferenceUpdate(userId, platform, preferences) → Event
- contentTransform(content, type) → Event
- subscribe(eventType, handler) → Subscription
```

#### c. PinkFlow Engine (`/services/pinkflow`)
```typescript
- simplify(text) → SimplifiedText
- visualize(content) → EnhancedHTML
- transcribe(audio) → Text
- transform(content, types[]) → TransformedContent
```

**API Endpoints**:
```
POST   /api/auth              - Login, register, logout, validate
GET    /api/auth/preferences  - Get user preferences
POST   /api/transform         - Content transformation
POST   /api/providers         - Search providers
POST   /api/research          - RAG engine search
GET    /api/platform          - Platform status
```

**Storage Model**:
```typescript
interface DeafUser {
  id: string;
  username: string;
  email: string;
  profile: {
    displayName: string;
    communicationPreferences: {
      preferredLanguage: string;
      textComplexity: 'simple' | 'medium' | 'complex';
      visualAids: boolean;
      captioning: boolean;
    };
  };
  preferences: AccessibilityPreferences;
  deafAuthVerified: boolean;
}

interface AccessibilityPreferences {
  simplifyText: boolean;
  visualEnhancements: boolean;
  signLanguage: boolean;
  transcription: boolean;
  captioning: boolean;
  colorScheme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  animations: boolean;
}
```

### 2. PinkSync Browser Extension (The Hands)

**Purpose**: Apply accessibility preferences to all websites

**Technology Stack**:
- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- Chrome Storage API
- Chrome Messaging API

**Components**:

#### a. Background Service Worker (`scripts/background.js`)
```javascript
Responsibilities:
- Authenticate with DeafAUTH API
- Store auth token securely
- Sync preferences every 5 minutes
- Broadcast updates to all tabs
- Handle login/logout
- Manage extension state

Key Functions:
- startPeriodicSync()
- syncPreferences()
- handleLogin(credentials)
- handleLogout()
```

#### b. Content Script (`scripts/content.js`)
```javascript
Responsibilities:
- Runs on every webpage
- Receives preferences from background
- Applies accessibility modifications
- Observes DOM changes
- Platform-specific enhancements

Key Functions:
- applyAccessibility()
- enableAutoCaptions()
- applyVisualEnhancements()
- interceptAudioAlerts()
- applyPlatformSpecific()

Platform Handlers:
- enableYouTubeCaptions()
- enableNetflixCaptions()
- applyZoomEnhancements()
- applyTeamsEnhancements()
- applyHotelBookingEnhancements()
```

#### c. Popup UI (`popup.html`, `scripts/popup.js`)
```javascript
Responsibilities:
- Extension settings interface
- Login/logout
- Quick preference toggles
- Sync status display
- Connection indicator

Views:
- Login View (unauthenticated)
- Main View (authenticated)
- Loading View (transitional)
```

## Data Flow

### Initial Setup Flow
```
1. User installs PinkSync extension from Chrome Web Store
2. Extension icon appears in Chrome toolbar
3. User clicks extension → Popup opens
4. Popup shows login form
5. User enters DeafAUTH credentials
6. Extension → POST /api/auth { action: 'login', credentials }
7. API validates → Returns { token, user, preferences }
8. Extension stores token in chrome.storage.local
9. Background worker starts periodic sync (every 5 min)
10. Extension injects content scripts into all tabs
11. Content scripts apply preferences
```

### Ongoing Sync Flow
```
Every 5 minutes:
1. Background worker → GET /api/auth/preferences (with token)
2. API validates token → Returns latest preferences
3. Background saves to chrome.storage.local
4. Background broadcasts to all tabs
5. Each tab's content script receives update
6. Content scripts re-apply accessibility
```

### Preference Update Flow
```
1. User changes setting in popup (e.g., toggle "Simplify Text")
2. Popup → chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE' })
3. Background receives message
4. Background → POST /api/auth { action: 'update-preferences' }
5. API updates in storage
6. Background broadcasts to all tabs
7. Content scripts re-apply with new preferences
```

### Page Load Flow
```
1. User navigates to youtube.com
2. Chrome loads page
3. Content script auto-injected (manifest.json config)
4. Content script → chrome.runtime.sendMessage({ type: 'GET_PREFERENCES' })
5. Background returns current preferences
6. Content script applies:
   - Enables captions on YouTube player
   - Applies visual enhancements
   - Sets up visual alerts
   - Observes for dynamic content
7. User has accessible experience
```

## Platform-Specific Implementations

### YouTube Captions
```javascript
// Content script detects YouTube
if (window.location.hostname.includes('youtube.com')) {
  // Wait for player to load
  setTimeout(() => {
    // Find and click CC button
    const ccButton = document.querySelector('.ytp-subtitles-button');
    if (ccButton && ccButton.getAttribute('aria-pressed') === 'false') {
      ccButton.click();
    }
  }, 1000);
}
```

### Zoom Enhancements
```javascript
// Content script detects Zoom
if (window.location.hostname.includes('zoom.us')) {
  // Enable live captions
  const captionButton = document.querySelector('[aria-label*="caption"]');
  if (captionButton) {
    captionButton.click();
  }
  
  // Request ASL interpreter if available
  // (Implementation depends on Zoom's API)
}
```

### Hotel Booking Auto-Fill
```javascript
// Content script detects hotel sites
const hotelSites = ['booking.com', 'hotels.com', 'marriott.com'];
if (hotelSites.some(site => window.location.hostname.includes(site))) {
  // Find accessibility checkboxes
  const accessibilityOptions = document.querySelectorAll(
    'input[name*="accessible"]'
  );
  
  // Auto-check them
  accessibilityOptions.forEach(checkbox => {
    if (!checkbox.checked) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
}
```

## Security Architecture

### Authentication
```
1. Password-based login (DeafAUTH)
2. Token-based sessions
3. Token stored in chrome.storage.local (encrypted by Chrome)
4. Token sent in Authorization header
5. Token expires after 24 hours
6. Automatic re-authentication on expiry
```

### Data Privacy
```
✓ No browsing history collected
✓ No website content sent to API
✓ Only preferences synced
✓ Tokens stored locally
✓ HTTPS for all API calls
✓ No third-party analytics
✓ Open source and auditable
```

### CORS Configuration
```javascript
// Next.js API routes support extension origins
headers: {
  'Access-Control-Allow-Origin': 'chrome-extension://*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
```

## Deployment Architecture

### Backend Deployment

**Option 1: Vercel (Recommended)**
```bash
cd /home/runner/work/PinkSync/PinkSync
vercel deploy
```

**Option 2: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Option 3: Kubernetes**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pinksync-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: pinksync
        image: pinksync:latest
        ports:
        - containerPort: 3000
```

### Extension Deployment

**Chrome Web Store**
```
1. Create developer account
2. Prepare extension package
3. Create listing with:
   - Name: PinkSync - Accessibility Companion
   - Description: Automatic accessibility for deaf users
   - Category: Accessibility
   - Screenshots: 5-10 images
   - Privacy policy: URL to policy
4. Upload extension ZIP
5. Submit for review
6. Publish (7-14 day review)
```

**Enterprise Deployment**
```
1. Package extension as CRX
2. Host on internal server
3. Deploy via Chrome Enterprise Policies
4. Configure API endpoint in manifest
5. Pre-configure with SSO tokens
```

## Scalability Considerations

### Backend Scaling
```
- Horizontal scaling via load balancer
- Session storage in Redis cluster
- Database sharding by user ID
- CDN for static assets
- Rate limiting per user
- Caching layer (Redis)
```

### Extension Performance
```
- Lazy load platform-specific handlers
- Debounce DOM observations
- Cache API responses (5 min)
- Minimize content script payload
- Use passive event listeners
- Batch DOM modifications
```

## Monitoring & Analytics

### Backend Metrics
```
- API response times
- Authentication success/failure rates
- Preference sync frequency
- Active user count
- Error rates by endpoint
- Token expiration patterns
```

### Extension Metrics
```
- Installation count
- Active users (DAU/MAU)
- Sync success rate
- Platform-specific usage
- Feature toggle rates
- Login success rate
```

## Future Enhancements

### Phase 2 (Q1 2025)
- [ ] Real-time WebSocket sync
- [ ] Offline mode with local cache
- [ ] Multi-language support
- [ ] Custom user scripts
- [ ] Advanced visual customization

### Phase 3 (Q2 2025)
- [ ] Firefox extension
- [ ] Safari extension
- [ ] Mobile app (iOS/Android)
- [ ] Desktop app (Electron)
- [ ] API for third-party integrations

### Phase 4 (Q3 2025)
- [ ] AI-powered accessibility suggestions
- [ ] Community marketplace for scripts
- [ ] Enterprise SSO integration
- [ ] Advanced analytics dashboard
- [ ] White-label options

## Conclusion

PinkSync provides a complete, production-ready accessibility platform that bridges the gap between centralized preference management (DeafAUTH) and universal accessibility enforcement (Browser Extension). The architecture is designed for scalability, security, and extensibility while maintaining simplicity for end users.

Users install the extension once, log in once, and enjoy consistent accessibility across all websites automatically. Changes made on any device sync instantly, and new accessibility features are deployed seamlessly through extension updates.

This architecture serves as the foundation for building the most comprehensive accessibility platform for the deaf community.
