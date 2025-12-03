# PinkSync Browser Extension

## Overview

PinkSync is a Chrome browser extension that provides automatic accessibility enhancements for deaf users across all websites. It connects to the DeafAUTH API to sync user preferences and applies them consistently across the web.

## Features

### 🎯 Auto-Enable Captions
- **YouTube** - Automatically enables closed captions
- **Netflix** - Enables subtitles on videos
- **Vimeo** - Activates captions
- **Zoom** - Enables live captions in meetings
- **Microsoft Teams** - Activates live captions
- **HTML5 Videos** - Enables text tracks when available

### 👁️ Visual Enhancements
- Highlights important elements (buttons, links)
- Improves contrast and visibility
- Adds visual indicators for interactive elements

### 📝 Text Simplification
- Converts complex text to simpler language
- Improves readability for ASL users
- Adjusts line spacing and word spacing

### 🔔 Visual Alerts
- Converts audio alerts to visual notifications
- Flashes screen for important alerts
- Shows notification banners for errors and warnings

### 🏨 Auto-Fill Forms
- Automatically checks accessibility options on hotel booking sites
- Pre-fills accessibility needs on forms
- Saves time and ensures accessibility needs are communicated

### 🎨 Customization
- Adjustable font size
- Dark mode and high contrast modes
- Customizable color schemes
- Persistent preferences across devices

## Installation

### For Development

1. Clone the repository:
```bash
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync/extension
```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `extension` directory

6. The extension is now installed! Look for the PinkSync icon in your toolbar.

### For Production

1. Visit the Chrome Web Store
2. Search for "PinkSync"
3. Click "Add to Chrome"
4. Follow the installation prompts

## Setup

1. Click the PinkSync icon in your Chrome toolbar
2. Sign in with your DeafAUTH credentials
3. Your preferences will sync automatically
4. Browse any website - accessibility is applied automatically!

## Architecture

```
┌─────────────────┐
│   DeafAUTH API  │ ← Backend (Stores preferences)
│   (The Brain)   │
└────────┬────────┘
         │
         │ REST API
         │ GET /api/auth/preferences
         │ POST /api/auth/login
         ▼
┌─────────────────┐
│  PinkSync Ext   │ ← Browser Extension
│  (The Hands)    │
└────────┬────────┘
         │
         │ Content Scripts
         │ Inject & Modify DOM
         ▼
┌─────────────────────────────────┐
│  ANY WEBSITE                     │
│  ✓ Captions enabled              │
│  ✓ Visual enhancements applied   │
│  ✓ Forms auto-filled             │
└─────────────────────────────────┘
```

## Components

### Background Service Worker (`scripts/background.js`)
- Manages authentication with DeafAUTH API
- Syncs preferences every 5 minutes
- Handles login/logout
- Broadcasts preference updates to all tabs

### Content Script (`scripts/content.js`)
- Runs on every webpage
- Applies accessibility preferences
- Enables auto-captions on videos
- Converts audio alerts to visual
- Auto-fills accessibility forms
- Platform-specific enhancements

### Popup UI (`popup.html`, `scripts/popup.js`)
- Extension settings interface
- Quick preference toggles
- Sync status display
- Login/logout interface

## Configuration

### API Endpoint

Update the `DEAFAUTH_API_URL` in `scripts/background.js`:

```javascript
const DEAFAUTH_API_URL = 'https://your-deafauth-api.com';
```

### Sync Interval

Adjust the preference sync interval (default: 5 minutes):

```javascript
const SYNC_INTERVAL = 5 * 60 * 1000; // milliseconds
```

## Supported Platforms

### Video Platforms
- ✅ YouTube
- ✅ Netflix
- ✅ Vimeo
- ✅ Prime Video
- ✅ HTML5 video players

### Meeting Platforms
- ✅ Zoom
- ✅ Microsoft Teams
- ✅ Google Meet (coming soon)
- ✅ Webex (coming soon)

### Booking Platforms
- ✅ Booking.com
- ✅ Hotels.com
- ✅ Expedia
- ✅ Marriott
- ✅ Hilton
- ✅ Hyatt
- ✅ Airbnb

## Permissions

The extension requires the following permissions:

- **storage** - Store authentication token and preferences locally
- **tabs** - Access tab information to apply preferences
- **activeTab** - Interact with the current tab
- **scripting** - Inject content scripts
- **notifications** - Show visual notifications
- **host_permissions** - Apply accessibility to all websites

## Privacy & Security

- Authentication tokens are stored locally and encrypted
- No browsing data is collected or transmitted
- Only syncs user preferences from DeafAUTH
- No third-party analytics or tracking
- Open source and auditable

## Development

### File Structure
```
extension/
├── manifest.json           # Extension configuration
├── popup.html             # Popup UI
├── scripts/
│   ├── background.js      # Background service worker
│   ├── content.js         # Content script (runs on pages)
│   └── popup.js           # Popup logic
├── styles/
│   ├── popup.css          # Popup styles
│   └── content.css        # Content script styles
└── icons/
    ├── icon16.png         # 16x16 icon
    ├── icon48.png         # 48x48 icon
    └── icon128.png        # 128x128 icon
```

### Building

No build step required - the extension runs directly from source files.

### Testing

1. Make changes to the code
2. Go to `chrome://extensions`
3. Click the refresh icon on the PinkSync extension
4. Test on various websites

## Troubleshooting

### Extension not working
- Check if you're logged in (click the extension icon)
- Verify your internet connection
- Try syncing manually
- Check the browser console for errors

### Captions not enabling
- Some sites may block automatic interaction
- Try refreshing the page
- Manually enable once, extension will remember

### Preferences not syncing
- Check your login status
- Verify API endpoint is correct
- Check network tab for API errors

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

- GitHub Issues: https://github.com/pinkycollie/PinkSync/issues
- Email: support@pinksync.com
- Discord: https://discord.gg/pinksync

## License

[License information to be added]

## Acknowledgments

Built for and with the deaf community to enhance digital accessibility and independence.
