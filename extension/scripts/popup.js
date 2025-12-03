/**
 * PinkSync Popup Script
 * 
 * Manages the extension popup UI
 */

// DOM elements
let loginView, mainView, loadingView;
let loginForm, loginError, loginBtn;
let userDisplay, syncStatus, connectionStatus, lastSyncDisplay;
let prefSimplifyText, prefVisualEnhancements, prefCaptioning, prefVisualAlerts;
let syncBtn, settingsBtn, logoutBtn;

// State
let currentUser = null;
let preferences = null;

/**
 * Initialize popup
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  loginView = document.getElementById('login-view');
  mainView = document.getElementById('main-view');
  loadingView = document.getElementById('loading-view');
  
  loginForm = document.getElementById('login-form');
  loginError = document.getElementById('login-error');
  loginBtn = document.getElementById('login-btn');
  
  userDisplay = document.getElementById('user-display');
  syncStatus = document.getElementById('sync-status');
  connectionStatus = document.getElementById('connection-status');
  lastSyncDisplay = document.getElementById('last-sync');
  
  prefSimplifyText = document.getElementById('pref-simplify-text');
  prefVisualEnhancements = document.getElementById('pref-visual-enhancements');
  prefCaptioning = document.getElementById('pref-captioning');
  prefVisualAlerts = document.getElementById('pref-visual-alerts');
  
  syncBtn = document.getElementById('sync-btn');
  settingsBtn = document.getElementById('settings-btn');
  logoutBtn = document.getElementById('logout-btn');
  
  // Setup event listeners
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  syncBtn.addEventListener('click', handleSync);
  settingsBtn.addEventListener('click', openFullSettings);
  
  // Preference checkboxes
  [prefSimplifyText, prefVisualEnhancements, prefCaptioning, prefVisualAlerts].forEach(checkbox => {
    checkbox.addEventListener('change', handlePreferenceChange);
  });
  
  // Register link
  const registerLink = document.getElementById('register-link');
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'http://localhost:3000' }); // Update to production URL
  });
  
  // Check authentication status
  await checkAuthStatus();
});

/**
 * Check if user is authenticated
 */
async function checkAuthStatus() {
  showView('loading');
  
  const storage = await chrome.storage.local.get(['authToken', 'user', 'userPreferences']);
  
  if (storage.authToken && storage.user) {
    currentUser = storage.user;
    preferences = storage.userPreferences;
    showMainView();
  } else {
    showLoginView();
  }
}

/**
 * Show login view
 */
function showLoginView() {
  showView('login');
}

/**
 * Show main view
 */
function showMainView() {
  if (!currentUser) return;
  
  // Update user info
  userDisplay.textContent = currentUser.username || currentUser.displayName || 'User';
  
  // Update preferences checkboxes
  if (preferences) {
    prefSimplifyText.checked = preferences.simplifyText || false;
    prefVisualEnhancements.checked = preferences.visualEnhancements || false;
    prefCaptioning.checked = preferences.transcription || preferences.captioning || false;
    prefVisualAlerts.checked = true; // Always enabled
  }
  
  // Update last sync time
  updateLastSync();
  
  showView('main');
}

/**
 * Show specific view
 */
function showView(viewName) {
  loginView.style.display = 'none';
  mainView.style.display = 'none';
  loadingView.style.display = 'none';
  
  switch (viewName) {
    case 'login':
      loginView.style.display = 'block';
      break;
    case 'main':
      mainView.style.display = 'block';
      break;
    case 'loading':
      loadingView.style.display = 'block';
      break;
  }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Show loading state
  loginBtn.querySelector('.btn-text').style.display = 'none';
  loginBtn.querySelector('.spinner').style.display = 'inline';
  loginBtn.disabled = true;
  loginError.style.display = 'none';
  
  try {
    // Send login request to background
    const response = await chrome.runtime.sendMessage({
      type: 'LOGIN',
      credentials: { username, password },
    });
    
    if (response.success) {
      currentUser = response.user;
      preferences = response.user.preferences;
      showMainView();
    } else {
      loginError.textContent = response.error || 'Login failed';
      loginError.style.display = 'block';
    }
  } catch (error) {
    loginError.textContent = 'Connection error. Please try again.';
    loginError.style.display = 'block';
  } finally {
    // Reset button state
    loginBtn.querySelector('.btn-text').style.display = 'inline';
    loginBtn.querySelector('.spinner').style.display = 'none';
    loginBtn.disabled = false;
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  await chrome.runtime.sendMessage({ type: 'LOGOUT' });
  currentUser = null;
  preferences = null;
  showLoginView();
}

/**
 * Handle sync button
 */
async function handleSync() {
  syncStatus.textContent = '⏳ Syncing...';
  connectionStatus.textContent = '⏳ Syncing...';
  
  try {
    await chrome.runtime.sendMessage({ type: 'SYNC_NOW' });
    
    // Reload preferences
    const storage = await chrome.storage.local.get(['userPreferences']);
    preferences = storage.userPreferences;
    
    // Update UI
    if (preferences) {
      prefSimplifyText.checked = preferences.simplifyText || false;
      prefVisualEnhancements.checked = preferences.visualEnhancements || false;
      prefCaptioning.checked = preferences.transcription || preferences.captioning || false;
    }
    
    syncStatus.textContent = '✓ Synced';
    connectionStatus.textContent = '✓ Connected';
    updateLastSync();
  } catch (error) {
    syncStatus.textContent = '❌ Sync failed';
    connectionStatus.textContent = '❌ Error';
  }
}

/**
 * Handle preference change
 */
async function handlePreferenceChange(e) {
  const checkbox = e.target;
  const update = {};
  
  // Map checkbox to preference
  if (checkbox.id === 'pref-simplify-text') {
    update.simplifyText = checkbox.checked;
  } else if (checkbox.id === 'pref-visual-enhancements') {
    update.visualEnhancements = checkbox.checked;
  } else if (checkbox.id === 'pref-captioning') {
    update.transcription = checkbox.checked;
    update.captioning = checkbox.checked;
  }
  
  // Send update to background
  await chrome.runtime.sendMessage({
    type: 'UPDATE_PREFERENCE',
    update,
  });
  
  // Update local preferences
  preferences = { ...preferences, ...update };
  
  // Show feedback
  syncStatus.textContent = '✓ Updated';
  setTimeout(() => {
    syncStatus.textContent = '✓ Synced';
  }, 2000);
}

/**
 * Open full settings in DeafAUTH
 */
function openFullSettings() {
  // In production, update to your production URL
  chrome.tabs.create({ url: 'http://localhost:3000' }); // Change to production URL
}

/**
 * Update last sync display
 */
function updateLastSync() {
  lastSyncDisplay.textContent = 'Just now';
  
  // Update every minute
  setInterval(() => {
    const storage = chrome.storage.local.get(['lastSync']);
    storage.then(data => {
      if (data.lastSync) {
        const diff = Date.now() - data.lastSync;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) {
          lastSyncDisplay.textContent = 'Just now';
        } else if (minutes === 1) {
          lastSyncDisplay.textContent = '1 minute ago';
        } else if (minutes < 60) {
          lastSyncDisplay.textContent = `${minutes} minutes ago`;
        } else {
          lastSyncDisplay.textContent = 'Over an hour ago';
        }
      }
    });
  }, 60000);
}

console.log('PinkSync popup initialized');
