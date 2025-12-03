/**
 * PinkSync Background Service Worker
 * 
 * Syncs with DeafAUTH API and manages user preferences across all tabs
 */

// Configuration
// For production, update this to your production API URL
// For development, use http://localhost:3000
const DEAFAUTH_API_URL = 'http://localhost:3000'; // Change to production URL before publishing
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

// State management
let userPreferences = null;
let authToken = null;
let syncTimer = null;

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('PinkSync extension installed');
  
  // Load saved auth token and preferences
  const storage = await chrome.storage.local.get(['authToken', 'userPreferences']);
  authToken = storage.authToken || null;
  userPreferences = storage.userPreferences || null;
  
  // Start sync if authenticated
  if (authToken) {
    startPeriodicSync();
    await syncPreferences();
  }
});

/**
 * Start periodic preference sync
 */
function startPeriodicSync() {
  if (syncTimer) {
    clearInterval(syncTimer);
  }
  
  syncTimer = setInterval(async () => {
    if (authToken) {
      await syncPreferences();
    }
  }, SYNC_INTERVAL);
}

/**
 * Sync preferences from DeafAUTH API
 */
async function syncPreferences() {
  if (!authToken) {
    console.log('No auth token, skipping sync');
    return;
  }
  
  try {
    const response = await fetch(`${DEAFAUTH_API_URL}/api/auth/preferences`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      userPreferences = data.preferences;
      
      // Save to storage
      await chrome.storage.local.set({ userPreferences });
      
      // Notify all tabs to update
      const tabs = await chrome.tabs.query({});
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'PREFERENCES_UPDATED',
          preferences: userPreferences,
        }).catch(() => {
          // Tab may not have content script loaded
        });
      });
      
      console.log('Preferences synced successfully');
    } else if (response.status === 401) {
      // Token expired
      await handleLogout();
    }
  } catch (error) {
    console.error('Failed to sync preferences:', error);
  }
}

/**
 * Handle login from popup
 */
async function handleLogin(credentials) {
  try {
    const response = await fetch(`${DEAFAUTH_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const data = await response.json();
      authToken = data.token;
      userPreferences = data.user.preferences;
      
      // Save to storage
      await chrome.storage.local.set({
        authToken,
        userPreferences,
        user: data.user,
      });
      
      // Start syncing
      startPeriodicSync();
      await syncPreferences();
      
      return { success: true, user: data.user };
    } else {
      const error = await response.json();
      return { success: false, error: error.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  // Clear state
  authToken = null;
  userPreferences = null;
  
  // Clear storage
  await chrome.storage.local.clear();
  
  // Stop syncing
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  
  // Notify all tabs
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, {
      type: 'LOGGED_OUT',
    }).catch(() => {});
  });
}

/**
 * Message handler from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'LOGIN':
      handleLogin(message.credentials).then(sendResponse);
      return true; // Async response
      
    case 'LOGOUT':
      handleLogout().then(() => sendResponse({ success: true }));
      return true;
      
    case 'GET_PREFERENCES':
      sendResponse({ preferences: userPreferences, authToken });
      break;
      
    case 'SYNC_NOW':
      syncPreferences().then(() => sendResponse({ success: true }));
      return true;
      
    case 'UPDATE_PREFERENCE':
      if (userPreferences) {
        userPreferences = { ...userPreferences, ...message.update };
        chrome.storage.local.set({ userPreferences });
        
        // Notify all tabs
        chrome.tabs.query({}).then(tabs => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              type: 'PREFERENCES_UPDATED',
              preferences: userPreferences,
            }).catch(() => {});
          });
        });
      }
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

/**
 * Handle tab updates - inject accessibility on new pages
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && userPreferences) {
    // Send preferences to newly loaded page
    chrome.tabs.sendMessage(tabId, {
      type: 'PREFERENCES_UPDATED',
      preferences: userPreferences,
    }).catch(() => {
      // Content script not ready yet
    });
  }
});

console.log('PinkSync background service worker loaded');
