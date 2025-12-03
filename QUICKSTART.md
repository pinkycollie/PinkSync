# 🚀 PinkSync Quick Start Guide

Get PinkSync up and running in 5 minutes!

## What You'll Need

- Node.js 18+ installed
- Google Chrome browser
- 10 minutes of your time

## Step 1: Start the Backend (2 minutes)

```bash
# Clone the repository (if not already done)
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3000
```

**Keep this terminal open!** The backend needs to stay running.

## Step 2: Load the Extension (1 minute)

1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Toggle **"Developer mode"** ON (top right corner)
4. Click **"Load unpacked"**
5. Navigate to: `PinkSync/extension`
6. Click **"Select Folder"**

You should see the PinkSync extension appear in your extensions list! ✅

## Step 3: Test the Extension (2 minutes)

### 3.1 Open the Extension

Click the PinkSync icon in your Chrome toolbar (you may need to pin it first).

You'll see a login screen.

### 3.2 Login

For testing, you can use any credentials:
- **Username**: `test`
- **Password**: `test`

Click **"Sign In"**

The extension will:
1. Authenticate with the local API
2. Fetch your preferences
3. Show the main dashboard

### 3.3 Test Accessibility Features

**Try YouTube:**
1. Open a new tab
2. Go to `youtube.com`
3. Play any video
4. Watch the extension automatically enable captions! 🎯

**Try the Visual Alerts:**
1. Open a new tab
2. Open the browser console (F12)
3. Type: `alert('Test alert')`
4. Press Enter
5. You'll see a pink flash and visual notification!

**Try Zoom (if you have an account):**
1. Join a Zoom meeting
2. The extension will attempt to enable live captions automatically

## What's Working?

After following these steps, you have:

✅ Backend API running locally  
✅ Browser extension loaded and active  
✅ Authentication working  
✅ Preferences syncing  
✅ Auto-captions on YouTube  
✅ Visual alerts system  
✅ Extension popup interface  

## Troubleshooting

### Backend won't start?

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### Extension won't load?

1. Check for errors in `chrome://extensions/`
2. Click "Errors" button if shown
3. Common issues:
   - **Manifest error**: Check `extension/manifest.json` syntax
   - **File not found**: Verify all files exist
   - **Permission denied**: Check file permissions

### Login fails?

1. Check the backend is running (`http://localhost:3000`)
2. Open browser DevTools (F12) → Console
3. Look for network errors
4. The demo API accepts any credentials, so it should work!

### Extension not working on websites?

1. Click the extension icon
2. Check if you're logged in (green status)
3. Try the "Sync Now" button
4. Refresh the webpage
5. Check browser console for PinkSync messages

## Next Steps

Now that everything works:

### 1. Customize Preferences

Click the extension icon and toggle preferences:
- ☑️ Simplify Text
- ☑️ Visual Enhancements  
- ☑️ Auto-Enable Captions
- ☑️ Visual Alerts

Changes apply instantly to all tabs!

### 2. Test on Different Sites

Try these to see the extension in action:
- **YouTube** - Auto-enables captions
- **Netflix** - Enables subtitles
- **Vimeo** - Activates captions
- **Booking.com** - Auto-checks accessibility options
- **Any website** - Visual enhancements and alerts

### 3. Check the Logs

Open browser console (F12) on any page to see:
```
PinkSync content script loaded
PinkSync: Applying accessibility preferences
PinkSync: Enabled YouTube captions
```

### 4. Explore the Code

Check out these key files:
- `extension/scripts/background.js` - Syncs with API
- `extension/scripts/content.js` - Applies accessibility
- `extension/scripts/popup.js` - Extension UI
- `app/api/auth/route.ts` - Backend authentication

### 5. Read the Documentation

- [Extension README](extension/README.md) - Detailed extension docs
- [API Gateway](docs/api-gateway.md) - API documentation
- [Complete Architecture](docs/architecture-complete.md) - System design
- [Deployment Guide](docs/deployment-complete.md) - Production deployment

## Production Deployment

Ready to deploy? Follow these guides:

1. **Backend**: See [docs/deployment-complete.md](docs/deployment-complete.md)
2. **Extension**: See [extension/README.md](extension/README.md)

### Quick Production Checklist

Backend:
- [ ] Update API endpoint in extension code
- [ ] Deploy to Vercel/VPS
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Set up monitoring

Extension:
- [ ] Update `DEAFAUTH_API_URL` in `scripts/background.js`
- [ ] Generate proper icons (see `extension/icons/README.md`)
- [ ] Update version in `manifest.json`
- [ ] Test thoroughly
- [ ] Package as ZIP
- [ ] Submit to Chrome Web Store

## Getting Help

- **GitHub Issues**: https://github.com/pinkycollie/PinkSync/issues
- **Documentation**: Check the `docs/` folder
- **Discord**: (Coming soon)
- **Email**: support@pinksync.com

## What Makes PinkSync Special?

### The Problem
Deaf users face challenges on every website:
- Videos without captions
- Audio alerts they can't hear
- Accessibility options scattered everywhere
- No consistency across sites

### The Solution
PinkSync provides:
- ✅ **One-time setup** - Install extension, log in, done!
- ✅ **Works everywhere** - Every website gets accessibility
- ✅ **Automatic** - No manual configuration needed
- ✅ **Synced** - Preferences follow you across devices
- ✅ **Smart** - Platform-specific enhancements (YouTube, Zoom, etc.)

### The Architecture

```
DeafAUTH (Backend)          PinkSync (Extension)
     ↓                              ↓
Stores preferences    →    Applies to all websites
     ↓                              ↓
User logs in once    →    Accessibility everywhere
```

## Success!

You now have a working PinkSync installation! 🎉

The extension is running in your browser, syncing with the local API, and automatically making websites more accessible.

Try browsing your favorite sites and see the difference!

## Advanced Usage

### Sync Interval

The extension syncs with the API every 5 minutes. To change this:

Edit `extension/scripts/background.js`:
```javascript
const SYNC_INTERVAL = 2 * 60 * 1000; // 2 minutes instead of 5
```

### Manual Sync

Click the extension icon → "🔄 Sync Now" button

### Debug Mode

Open DevTools (F12) and check:
- Console tab for PinkSync messages
- Network tab for API calls
- Application → Storage → Local Storage for saved data

### Platform-Specific Features

The extension has special handlers for:
- **YouTube**: `.ytp-subtitles-button` click
- **Netflix**: `[data-uia="controls-captions"]` click
- **Zoom**: `[aria-label*="caption"]` detection
- **Teams**: Auto-enable captions in settings
- **Hotels**: Auto-check accessibility fields

See `extension/scripts/content.js` for implementation details.

## Contributing

Want to improve PinkSync?

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

We especially welcome:
- New platform handlers (Google Meet, Webex, etc.)
- Accessibility improvements
- Bug fixes
- Documentation improvements
- Translations

## License

[License information to be added]

---

**Built with ❤️ for the deaf community**

*Making the web accessible, one website at a time.*
