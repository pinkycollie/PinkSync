# PinkSync Extension Configuration

## Development vs Production

The extension needs to connect to different API endpoints depending on the environment.

### Development Configuration

For local development (testing with `npm run dev`):

**Edit `scripts/background.js` line 7:**
```javascript
const DEAFAUTH_API_URL = 'http://localhost:3000';
```

### Production Configuration

For production deployment:

**Edit `scripts/background.js` line 7:**
```javascript
const DEAFAUTH_API_URL = 'https://your-production-domain.com';
```

Or use environment-based configuration:

```javascript
const DEAFAUTH_API_URL = typeof chrome !== 'undefined' && chrome.runtime 
  ? (chrome.runtime.id === 'development-id' 
      ? 'http://localhost:3000' 
      : 'https://your-production-domain.com')
  : 'http://localhost:3000';
```

## Testing Configuration

### 1. Test with Local Backend

```bash
# Terminal 1: Start backend
cd /path/to/PinkSync
npm run dev

# Terminal 2: Load extension
1. Open chrome://extensions
2. Enable Developer mode
3. Click "Load unpacked"
4. Select extension directory
```

### 2. Test with Production Backend

Update `DEAFAUTH_API_URL` to production URL and reload extension.

## Environment Variables

For more flexibility, you can use a config file:

**Create `scripts/config.js`:**

```javascript
// Auto-detect environment
const isDevelopment = !('update_url' in chrome.runtime.getManifest());

const CONFIG = {
  apiUrl: isDevelopment 
    ? 'http://localhost:3000'
    : 'https://pinksync.mbtq.dev',
  syncInterval: 5 * 60 * 1000, // 5 minutes
  debug: isDevelopment
};

export default CONFIG;
```

**Update `manifest.json`:**
```json
{
  "background": {
    "service_worker": "scripts/background.js",
    "type": "module"
  }
}
```

**Update `scripts/background.js`:**
```javascript
import CONFIG from './config.js';
const DEAFAUTH_API_URL = CONFIG.apiUrl;
```

## CORS Configuration

The backend must allow extension origins.

**For Development:**
```
Access-Control-Allow-Origin: *
```

**For Production:**
```
Access-Control-Allow-Origin: chrome-extension://<extension-id>
```

The extension ID is assigned by Chrome when you publish or load the extension.

## Manifest Configuration

### Development Manifest (manifest.json)

```json
{
  "name": "PinkSync - Accessibility Companion (Dev)",
  "version": "0.1.0",
  ...
}
```

### Production Manifest

```json
{
  "name": "PinkSync - Accessibility Companion",
  "version": "1.0.0",
  ...
}
```

## Build Process

For production:

1. **Update API URL** in `scripts/background.js`
2. **Update version** in `manifest.json`
3. **Generate icons** (see `icons/README.md`)
4. **Test thoroughly**
5. **Create ZIP package**:
   ```bash
   cd extension
   zip -r ../pinksync-v1.0.0.zip . \
     -x "*.DS_Store" \
     -x "*README.md" \
     -x "*.js~" \
     -x "icons/*.svg" \
     -x "icons/create-icons.js"
   ```

## Troubleshooting

### CORS Errors

If you see CORS errors in console:

1. Check API URL is correct
2. Verify backend is running
3. Check backend CORS configuration
4. In dev, you may need to temporarily disable CORS in browser

### Extension Not Loading

1. Check manifest.json syntax with JSON validator
2. Verify all file paths exist
3. Check console for specific errors
4. Try reloading extension

### API Connection Failed

1. Verify backend is running (`npm run dev`)
2. Check API URL matches backend
3. Check network tab for failed requests
4. Verify credentials are correct

## Security Notes

- Never commit API keys or secrets in the extension
- Use HTTPS in production
- Validate all API responses
- Store tokens securely in chrome.storage.local
- Clear sensitive data on logout

## Next Steps

1. Start backend: `npm run dev`
2. Load extension in Chrome
3. Test login flow
4. Test on various websites
5. Check console for any errors
6. Iterate and improve!
