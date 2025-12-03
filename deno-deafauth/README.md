# DeafAUTH for Deno

A standalone, Deno-compatible version of DeafAUTH - a visual-first authentication system designed specifically for deaf users.

## Features

- 🎯 **Visual-First Authentication** - No audio CAPTCHAs or voice verification
- 🔒 **Secure Token-Based Sessions** - Using Deno's native crypto
- ♿ **Accessibility Preferences** - Store and sync user accessibility settings
- 🦕 **Deno Native** - Built for Deno and Deno Fresh
- 📦 **Zero Dependencies** - Pure TypeScript, no external packages needed
- 🔌 **Framework Agnostic** - Works with Deno Fresh, Oak, or any Deno framework

## Quick Start

### Installation

```typescript
// Import from local file or deno.land
import { deafAuthService } from "./deno-deafauth/mod.ts";
// Or import types
import type { DeafUser, AuthCredentials } from "./deno-deafauth/types.ts";
```

### Basic Usage

```typescript
import { deafAuthService } from "./deno-deafauth/mod.ts";

// Authenticate a user
const result = await deafAuthService.authenticate(
  { username: "user@example.com", password: "password123" },
  { pattern: ["1", "2", "3"], type: "pattern-matching" }
);

if (result.success) {
  console.log("User authenticated:", result.user);
  console.log("Token:", result.token);
} else {
  console.error("Auth failed:", result.error);
}

// Validate a token
const user = await deafAuthService.validateToken(result.token!);
console.log("Validated user:", user);

// Update preferences
await deafAuthService.updatePreferences(user!.id, {
  simplifyText: false,
  fontSize: "large",
});

// Logout
await deafAuthService.logout(result.token!);
```

## Usage with Deno Fresh

### 1. Create API Routes

In your Deno Fresh project, create route handlers in `routes/api/auth/`:

**`routes/api/auth/login.ts`:**
```typescript
import { Handlers } from "$fresh/server.ts";
import { loginHandler } from "../../../deno-deafauth/routes.ts";

export const handler: Handlers = {
  POST: loginHandler,
};
```

**`routes/api/auth/preferences.ts`:**
```typescript
import { Handlers } from "$fresh/server.ts";
import { preferencesHandler } from "../../../deno-deafauth/routes.ts";

export const handler: Handlers = {
  GET: preferencesHandler,
};
```

**`routes/api/auth/logout.ts`:**
```typescript
import { Handlers } from "$fresh/server.ts";
import { logoutHandler } from "../../../deno-deafauth/routes.ts";

export const handler: Handlers = {
  POST: logoutHandler,
};
```

### 2. Use in Your Application

```typescript
// In your Fresh islands or routes
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    credentials: {
      username: "user@example.com",
      password: "password123",
    },
    verification: {
      pattern: ["1", "2", "3"],
      type: "pattern-matching",
    },
  }),
});

const data = await response.json();
if (data.success) {
  // Store token and redirect
  localStorage.setItem("authToken", data.token);
}
```

## API Reference

### DeafAuthService

#### `authenticate(credentials, verification): Promise<AuthResult>`

Authenticate a user with visual verification.

**Parameters:**
- `credentials`: `{ username: string, password: string }`
- `verification`: `{ pattern: string[], type: 'image-selection' | 'pattern-matching' | 'gesture-based' }`

**Returns:** `AuthResult` with `success`, `user`, `token`, and optional `error`

#### `validateToken(token): Promise<DeafUser | null>`

Validate an authentication token and return the associated user.

#### `register(credentials, profile): Promise<AuthResult>`

Register a new user.

**Parameters:**
- `credentials`: `{ username: string, password: string }`
- `profile`: `{ email: string, displayName: string, communicationPreferences: any }`

#### `updatePreferences(userId, preferences): Promise<void>`

Update user accessibility preferences.

#### `logout(token): Promise<void>`

Invalidate a user session.

#### `getCurrentUser(): DeafUser | null`

Get the currently authenticated user.

#### `isUsernameAvailable(username): Promise<boolean>`

Check if a username is available for registration.

## Types

### DeafUser

```typescript
interface DeafUser {
  id: string;
  username: string;
  email: string;
  profile: UserProfile;
  preferences: AccessibilityPreferences;
  deafAuthVerified: boolean;
}
```

### AccessibilityPreferences

```typescript
interface AccessibilityPreferences {
  simplifyText: boolean;
  visualEnhancements: boolean;
  signLanguage: boolean;
  transcription: boolean;
  captioning?: boolean;
  colorScheme?: 'light' | 'dark' | 'high-contrast';
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  animations?: boolean;
}
```

## Browser Extension Integration

DeafAUTH for Deno is fully compatible with the PinkSync browser extension. The extension can authenticate against a Deno Fresh backend using the same API endpoints.

**Extension Configuration:**

Update your extension's `config.js` to point to your Deno Fresh backend:

```javascript
const CONFIG = {
  apiUrl: 'https://your-deno-fresh-app.deno.dev',
  syncInterval: 5 * 60 * 1000,
};
```

The extension will work seamlessly with these endpoints:
- `POST /api/auth/login` - Authentication
- `GET /api/auth/preferences` - Get user preferences
- `POST /api/auth/update-preferences` - Update preferences
- `POST /api/auth/logout` - Logout

## Production Considerations

### Token Generation

In production, replace the simple token generation with a proper JWT library:

```typescript
// Install djwt: https://deno.land/x/djwt
import { create } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

const token = await create({ alg: "HS512", typ: "JWT" }, { userId }, key);
```

### Database Integration

Replace in-memory session storage with a persistent database:

**Deno KV Example:**
```typescript
const kv = await Deno.openKv();

// Store session
await kv.set(["sessions", token], user);

// Retrieve session
const result = await kv.get(["sessions", token]);
const user = result.value as DeafUser;
```

**Supabase Example:**
```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_KEY")!
);

// Authenticate
const { data, error } = await supabase.auth.signInWithPassword({
  email: credentials.username,
  password: credentials.password,
});
```

### CORS Configuration

In production, configure CORS properly:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'chrome-extension://your-extension-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

## Deployment

### Deno Deploy

```bash
# Install Deno Deploy CLI
deno install -Arf https://deno.land/x/deploy/deployctl.ts

# Deploy your Fresh app with DeafAUTH
deployctl deploy --project=your-project
```

### Self-Hosted

```bash
# Run your Deno Fresh app
deno task start
```

## Differences from Next.js Version

- ✅ No Next.js dependencies
- ✅ Uses Deno's native `crypto.randomUUID()`
- ✅ No event orchestrator integration (can be added separately)
- ✅ Deno-style imports with `.ts` extensions
- ✅ Compatible with Deno Fresh handlers
- ✅ Works with Deno Deploy

## Migration from Next.js

If you're migrating from the Next.js version:

1. Replace imports:
   ```typescript
   // Before (Next.js)
   import { deafAuthService } from '@/services/deafauth';
   
   // After (Deno)
   import { deafAuthService } from './deno-deafauth/mod.ts';
   ```

2. Update API routes to use Deno Fresh handlers (see examples above)

3. Replace Next.js `NextRequest`/`NextResponse` with standard `Request`/`Response`

4. Configure CORS headers manually (no automatic CORS in Deno)

## Examples

See `routes.ts` for complete Deno Fresh route handler examples.

## License

[Same as PinkSync main project]

## Contributing

Contributions welcome! This is part of the larger PinkSync accessibility platform.

## Support

- GitHub Issues: https://github.com/pinkycollie/PinkSync/issues
- Documentation: See main PinkSync docs

---

**Built for the deaf community with ❤️**
