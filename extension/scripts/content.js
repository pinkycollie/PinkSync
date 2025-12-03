/**
 * PinkSync Content Script
 * 
 * Runs on every webpage and applies accessibility preferences
 */

// Current preferences
let preferences = null;

// Initialize
(async function init() {
  console.log('PinkSync content script loaded');
  
  // Get preferences from background
  const response = await chrome.runtime.sendMessage({ type: 'GET_PREFERENCES' });
  if (response.preferences) {
    preferences = response.preferences;
    applyAccessibility();
  }
  
  // Listen for preference updates
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PREFERENCES_UPDATED') {
      preferences = message.preferences;
      applyAccessibility();
    } else if (message.type === 'LOGGED_OUT') {
      preferences = null;
      removeAccessibility();
    }
  });
  
  // Watch for DOM changes
  observeDOMChanges();
})();

/**
 * Apply accessibility preferences to the page
 */
function applyAccessibility() {
  if (!preferences) return;
  
  console.log('Applying PinkSync accessibility preferences', preferences);
  
  // Apply each preference
  if (preferences.simplifyText) {
    applyTextSimplification();
  }
  
  if (preferences.visualEnhancements) {
    applyVisualEnhancements();
  }
  
  if (preferences.transcription || preferences.captioning) {
    enableAutoCaptions();
  }
  
  applyColorScheme(preferences.colorScheme);
  applyFontSize(preferences.fontSize);
  
  // Apply platform-specific enhancements
  applyPlatformSpecific();
  
  // Apply visual alerts
  interceptAudioAlerts();
}

/**
 * Remove accessibility modifications
 */
function removeAccessibility() {
  document.body.classList.remove('pinksync-active');
  const styleElements = document.querySelectorAll('style[data-pinksync]');
  styleElements.forEach(el => el.remove());
}

/**
 * Apply text simplification
 */
function applyTextSimplification() {
  // This would be enhanced with actual simplification in production
  document.body.classList.add('pinksync-simplified-text');
}

/**
 * Apply visual enhancements
 */
function applyVisualEnhancements() {
  document.body.classList.add('pinksync-visual-enhanced');
  
  // Add visual indicators for important elements
  const style = document.createElement('style');
  style.setAttribute('data-pinksync', 'visual');
  style.textContent = `
    .pinksync-visual-enhanced button,
    .pinksync-visual-enhanced [role="button"] {
      outline: 2px solid #FF1493 !important;
      outline-offset: 2px !important;
    }
    
    .pinksync-visual-enhanced a {
      text-decoration: underline !important;
      text-decoration-color: #FF1493 !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Apply color scheme preference
 */
function applyColorScheme(scheme) {
  if (scheme === 'dark') {
    document.documentElement.classList.add('pinksync-dark-mode');
  } else if (scheme === 'high-contrast') {
    document.documentElement.classList.add('pinksync-high-contrast');
  }
}

/**
 * Apply font size preference
 */
function applyFontSize(size) {
  const sizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '20px',
  };
  
  if (sizeMap[size]) {
    const style = document.createElement('style');
    style.setAttribute('data-pinksync', 'font-size');
    style.textContent = `
      body {
        font-size: ${sizeMap[size]} !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Enable auto-captions on video elements
 */
function enableAutoCaptions() {
  // HTML5 video elements
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    enableVideoCaption(video);
  });
  
  // YouTube specific
  if (window.location.hostname.includes('youtube.com')) {
    enableYouTubeCaptions();
  }
  
  // Netflix specific
  if (window.location.hostname.includes('netflix.com')) {
    enableNetflixCaptions();
  }
  
  // Vimeo specific
  if (window.location.hostname.includes('vimeo.com')) {
    enableVimeoCaptions();
  }
}

/**
 * Enable captions on HTML5 video element
 */
function enableVideoCaption(video) {
  // Enable text tracks if available
  const tracks = video.textTracks;
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (track.kind === 'captions' || track.kind === 'subtitles') {
      track.mode = 'showing';
      console.log('PinkSync: Enabled captions on video', video);
      break;
    }
  }
}

/**
 * Enable YouTube captions
 */
function enableYouTubeCaptions() {
  // Try to click the CC button
  const ccButton = document.querySelector('.ytp-subtitles-button');
  if (ccButton && ccButton.getAttribute('aria-pressed') === 'false') {
    ccButton.click();
    console.log('PinkSync: Enabled YouTube captions');
  }
}

/**
 * Enable Netflix captions
 */
function enableNetflixCaptions() {
  // Netflix caption control
  const ccButton = document.querySelector('[data-uia="controls-captions"]');
  if (ccButton) {
    ccButton.click();
    console.log('PinkSync: Enabled Netflix captions');
  }
}

/**
 * Enable Vimeo captions
 */
function enableVimeoCaptions() {
  // Vimeo caption button
  const ccButton = document.querySelector('[aria-label="Closed captions"]');
  if (ccButton) {
    ccButton.click();
    console.log('PinkSync: Enabled Vimeo captions');
  }
}

/**
 * Apply platform-specific enhancements
 */
function applyPlatformSpecific() {
  const hostname = window.location.hostname;
  
  // Zoom
  if (hostname.includes('zoom.us')) {
    applyZoomEnhancements();
  }
  
  // Microsoft Teams
  if (hostname.includes('teams.microsoft.com')) {
    applyTeamsEnhancements();
  }
  
  // Hotel booking sites
  if (isHotelBookingSite(hostname)) {
    applyHotelBookingEnhancements();
  }
}

/**
 * Apply Zoom enhancements
 */
function applyZoomEnhancements() {
  console.log('PinkSync: Applying Zoom enhancements');
  
  // Try to enable live captions
  setTimeout(() => {
    // Find caption button - try multiple possible selectors
    const captionButton = document.querySelector('[aria-label*="Caption"]') ||
                         document.querySelector('[aria-label*="caption"]') ||
                         document.querySelector('[aria-label*="CAPTION"]');
    if (captionButton && captionButton.getAttribute('aria-pressed') !== 'true') {
      captionButton.click();
      console.log('PinkSync: Enabled Zoom captions');
    }
  }, 2000);
}

/**
 * Apply Microsoft Teams enhancements
 */
function applyTeamsEnhancements() {
  console.log('PinkSync: Applying Teams enhancements');
  
  // Try to enable live captions in Teams
  setTimeout(() => {
    const moreButton = document.querySelector('[data-tid="callingButtons-showMoreBtn"]');
    if (moreButton) {
      moreButton.click();
      setTimeout(() => {
        // Try multiple possible selectors for caption button
        const captionButton = document.querySelector('[data-tid*="Caption"]') ||
                             document.querySelector('[data-tid*="caption"]') ||
                             document.querySelector('[data-tid*="CAPTION"]');
        if (captionButton) {
          captionButton.click();
          console.log('PinkSync: Enabled Teams captions');
        }
      }, 500);
    }
  }, 2000);
}

/**
 * Check if site is a hotel booking site
 */
function isHotelBookingSite(hostname) {
  const hotelSites = [
    'booking.com',
    'hotels.com',
    'expedia.com',
    'marriott.com',
    'hilton.com',
    'hyatt.com',
    'airbnb.com',
  ];
  return hotelSites.some(site => hostname.includes(site));
}

/**
 * Apply hotel booking enhancements
 */
function applyHotelBookingEnhancements() {
  console.log('PinkSync: Applying hotel booking enhancements');
  
  // Auto-check accessibility options
  setTimeout(() => {
    const accessibilityCheckboxes = document.querySelectorAll(
      'input[type="checkbox"][name*="accessible" i], ' +
      'input[type="checkbox"][name*="disability" i], ' +
      'input[type="checkbox"][value*="accessible" i]'
    );
    
    accessibilityCheckboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('PinkSync: Auto-checked accessibility option', checkbox);
      }
    });
  }, 1000);
}

/**
 * Intercept audio alerts and convert to visual
 */
function interceptAudioAlerts() {
  // Override window.alert to show visual notification
  const originalAlert = window.alert;
  window.alert = function(message) {
    showVisualAlert(message);
    return originalAlert.call(window, message);
  };
  
  // Override console methods for visual feedback
  const originalError = console.error;
  console.error = function(...args) {
    showVisualNotification('error', args.join(' '));
    return originalError.apply(console, args);
  };
}

/**
 * Show visual alert with flash
 */
function showVisualAlert(message) {
  // Flash the screen
  flashScreen('#FF1493', 300);
  
  // Show notification banner
  showVisualNotification('alert', message);
}

/**
 * Flash the screen with a color
 */
function flashScreen(color, duration) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${color};
    opacity: 0.3;
    z-index: 999999;
    pointer-events: none;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  }, duration);
}

/**
 * Show visual notification banner
 */
function showVisualNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = 'pinksync-notification';
  notification.setAttribute('data-type', type);
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ff4444' : '#FF1493'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 999999;
    max-width: 400px;
    font-size: 16px;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Observe DOM changes to apply accessibility to new content
 */
function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    if (!preferences) return;
    
    // Check for new video elements
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'VIDEO') {
            enableVideoCaption(node);
          } else if (node.querySelector) {
            const videos = node.querySelectorAll('video');
            videos.forEach(enableVideoCaption);
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.setAttribute('data-pinksync', 'animations');
animationStyles.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(animationStyles);

console.log('PinkSync content script initialized');
