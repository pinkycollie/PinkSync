/**
 * Test Constants
 * Shared constants for all tests
 */

// AI Service Validation Constants
export const AI_CONSTANTS = {
  // Performance thresholds
  SIMPLE_REQUEST_TIMEOUT_MS: 200,
  BATCH_PROCESSING_TIMEOUT_MS: 500,
  AVERAGE_LATENCY_MS: 100,
  MAX_LATENCY_MS: 150,
  
  // Confidence thresholds
  MIN_CONFIDENCE: 0.9,
  HIGH_CONFIDENCE: 0.95,
  EXPECTED_CONFIDENCE: 0.95,
  
  // Resource limits
  MAX_MEMORY_MB: 500,
  MAX_CPU_PERCENT: 100,
  
  // Batch sizes
  DEFAULT_BATCH_SIZE: 10,
  PERFORMANCE_TEST_ITERATIONS: 50,
  BENCHMARK_ITERATIONS: 20,
};

// Event System Constants
export const EVENT_CONSTANTS = {
  // Delays for async operations
  SHORT_DELAY_MS: 10,
  MEDIUM_DELAY_MS: 20,
  LONG_DELAY_MS: 50,
  
  // Concurrent operation limits
  CONCURRENT_EVENTS: 100,
  PERFORMANCE_TEST_COUNT: 20,
};

// Provider Constants
export const PROVIDER_CONSTANTS = {
  // Accessibility scores
  MIN_ACCESSIBILITY_SCORE: 70,
  GOOD_ACCESSIBILITY_SCORE: 85,
  EXCELLENT_ACCESSIBILITY_SCORE: 95,
  MAX_ACCESSIBILITY_SCORE: 100,
  MIN_SCORE: 0,
  
  // Default provider data
  DEFAULT_SCORE: 85,
  TEST_SCORE: 80,
};

// Browser Test Constants
export const BROWSER_CONSTANTS = {
  // Timeouts
  PAGE_LOAD_TIMEOUT_MS: 3000,
  DOM_CONTENT_LOAD_MS: 2000,
  
  // Viewport sizes
  MOBILE_WIDTH: 375,
  MOBILE_HEIGHT: 667,
  TABLET_WIDTH: 768,
  TABLET_HEIGHT: 1024,
  DESKTOP_WIDTH: 1920,
  DESKTOP_HEIGHT: 1080,
};

// ASL and Sign Language Constants
export const SIGN_LANGUAGE_CONSTANTS = {
  DEFAULT_CONFIDENCE: 0.95,
  MIN_SIGN_CONFIDENCE: 0.9,
  WORD_DURATION_MULTIPLIER: 0.1,
  PAUSE_DURATION: 0.1,
  
  LANGUAGES: {
    ASL: 'American Sign Language',
    BSL: 'British Sign Language',
    ISL: 'International Sign Language',
  },
};

// Visual Alert Constants
export const VISUAL_ALERT_CONSTANTS = {
  DEFAULT_DURATION_MS: 2000,
  URGENT_COLOR: '#FF0000',
  ALERT_TYPES: {
    FLASH: 'flash',
    NOTIFICATION: 'notification',
    URGENT: 'urgent',
  },
};

// Coverage Targets
export const COVERAGE_CONSTANTS = {
  MIN_LINES: 70,
  MIN_FUNCTIONS: 70,
  MIN_BRANCHES: 70,
  MIN_STATEMENTS: 70,
};

export default {
  AI_CONSTANTS,
  EVENT_CONSTANTS,
  PROVIDER_CONSTANTS,
  BROWSER_CONSTANTS,
  SIGN_LANGUAGE_CONSTANTS,
  VISUAL_ALERT_CONSTANTS,
  COVERAGE_CONSTANTS,
};
