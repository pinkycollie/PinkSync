/**
 * PinkSync Extension Configuration
 * 
 * Auto-detects environment and provides appropriate configuration
 */

// Detect if running in development or production
// In development, the extension has no update_url in manifest
const isDevelopment = (() => {
  try {
    const manifest = chrome.runtime.getManifest();
    return !manifest.update_url;
  } catch {
    return true; // Default to development
  }
})();

// Configuration object
const CONFIG = {
  // API endpoint - auto-selects based on environment
  apiUrl: isDevelopment 
    ? 'http://localhost:3000'
    : 'https://pinksync.mbtq.dev', // Update this for your production URL
  
  // Sync interval (5 minutes)
  syncInterval: 5 * 60 * 1000,
  
  // Enable debug logging
  debug: isDevelopment,
  
  // Environment name
  environment: isDevelopment ? 'development' : 'production'
};

// Helper function for debug logging
CONFIG.log = function(...args) {
  if (CONFIG.debug) {
    console.log('[PinkSync]', ...args);
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

// Make available globally for non-module scripts
if (typeof window !== 'undefined') {
  window.PINKSYNC_CONFIG = CONFIG;
}

// For service worker
if (typeof self !== 'undefined') {
  self.PINKSYNC_CONFIG = CONFIG;
}
