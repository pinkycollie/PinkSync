/**
 * Test Setup File
 * Configures global test environment for all tests
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test utilities
globalThis.testUtils = {
  generateMockUserId: () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  generateMockProviderId: () => `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  generateMockEventId: () => `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // Mock delay for async testing
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Environment setup for tests
  setupTestEnv: () => {
    process.env.NODE_ENV = 'test';
    process.env.NEXT_TELEMETRY_DISABLED = '1';
  },
};

// Setup test environment
globalThis.testUtils.setupTestEnv();

// Extend expect matchers if needed
declare global {
  var testUtils: {
    generateMockUserId: () => string;
    generateMockProviderId: () => string;
    generateMockEventId: () => string;
    delay: (ms: number) => Promise<void>;
    setupTestEnv: () => void;
  };
}
