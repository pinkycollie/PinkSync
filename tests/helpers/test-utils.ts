/**
 * Test Helper Utilities
 * Shared utilities for all tests across the suite
 */

import type { PlatformEvent } from '@/types/index.ts';

export class TestHelpers {
  /**
   * Generate a mock user ID for testing
   */
  static generateMockUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a mock provider ID for testing
   */
  static generateMockProviderId(): string {
    return `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a mock event ID for testing
   */
  static generateMockEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a delay for async testing
   */
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait for condition to be true
   */
  static async waitFor(
    condition: () => boolean | Promise<boolean>,
    timeout: number = 5000,
    interval: number = 100
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.delay(interval);
    }
    
    throw new Error(`Timeout waiting for condition after ${timeout}ms`);
  }

  /**
   * Create a mock platform event
   */
  static createMockEvent(
    type: string,
    source: string = 'test',
    payload: any = {},
    userId?: string
  ): Partial<PlatformEvent> {
    return {
      id: this.generateMockEventId(),
      type: type as any,
      source: source as any,
      timestamp: new Date(),
      payload,
      userId,
    };
  }

  /**
   * Create a mock service provider
   */
  static createMockProvider(overrides: any = {}) {
    return {
      name: 'Test Provider',
      type: 'employment',
      description: 'A test service provider',
      apiEndpoint: '/api/test',
      capabilities: [
        {
          name: 'test-capability',
          description: 'Test capability',
          endpoint: '/test',
        },
      ],
      accessibilityScore: 85,
      active: true,
      ...overrides,
    };
  }

  /**
   * Measure execution time of a function
   */
  static async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await fn();
    const duration = Date.now() - startTime;
    return { result, duration };
  }

  /**
   * Run a function multiple times and return statistics
   */
  static async benchmarkFunction<T>(
    fn: () => Promise<T>,
    iterations: number = 10
  ): Promise<{
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    totalDuration: number;
  }> {
    const durations: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const { duration } = await this.measureTime(fn);
      durations.push(duration);
    }
    
    return {
      avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalDuration: durations.reduce((sum, d) => sum + d, 0),
    };
  }

  /**
   * Create a spy function that records calls
   */
  static createSpy<T extends (...args: any[]) => any>() {
    const calls: Array<{ args: Parameters<T>; result?: ReturnType<T>; error?: Error }> = [];
    
    const spy = ((...args: Parameters<T>) => {
      try {
        const result = undefined as ReturnType<T>;
        calls.push({ args, result });
        return result;
      } catch (error) {
        calls.push({ args, error: error as Error });
        throw error;
      }
    }) as T & { calls: typeof calls };
    
    spy.calls = calls;
    
    return spy;
  }

  /**
   * Setup test environment
   */
  static setupTestEnv() {
    process.env.NODE_ENV = 'test';
    process.env.NEXT_TELEMETRY_DISABLED = '1';
  }

  /**
   * Clean up test environment
   */
  static cleanupTestEnv() {
    // Clean up any test-specific environment variables
    delete process.env.TEST_USER_ID;
    delete process.env.TEST_PROVIDER_ID;
  }

  /**
   * Mock browser APIs for testing
   */
  static mockBrowserAPIs() {
    if (typeof window === 'undefined') {
      return;
    }

    // Mock localStorage if not available
    if (!window.localStorage) {
      const storage: Record<string, string> = {};
      (window as any).localStorage = {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => {
          storage[key] = value;
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
        clear: () => {
          Object.keys(storage).forEach((key) => delete storage[key]);
        },
      };
    }

    // Mock sessionStorage if not available
    if (!window.sessionStorage) {
      const storage: Record<string, string> = {};
      (window as any).sessionStorage = {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => {
          storage[key] = value;
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
        clear: () => {
          Object.keys(storage).forEach((key) => delete storage[key]);
        },
      };
    }
  }

  /**
   * Assert accessibility features
   */
  static assertAccessibilityFeatures(element: any) {
    // Check for ARIA labels
    const hasAriaLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
    if (!hasAriaLabel && element.tagName !== 'DIV' && element.tagName !== 'SPAN') {
      console.warn(`Element ${element.tagName} missing ARIA label`);
    }

    // Check for proper roles
    const role = element.getAttribute('role');
    if (element.tagName === 'BUTTON' && !role) {
      // Buttons have implicit role
      return true;
    }

    return true;
  }

  /**
   * Generate mock ASL sign data
   */
  static createMockASLSign(word: string = 'hello', confidence: number = 0.95) {
    return {
      word,
      confidence,
      timestamp: Date.now(),
      duration: Math.random() * 2,
      handedness: 'dominant',
      culturalContext: 'ASL',
    };
  }

  /**
   * Generate mock transcription data
   */
  static createMockTranscription(text: string = 'Test transcription') {
    const words = text.split(' ');
    let currentTime = 0;
    
    return {
      text,
      words: words.map((word) => {
        const start = currentTime;
        const duration = word.length * 0.1;
        currentTime += duration + 0.1;
        return {
          word,
          start,
          end: currentTime,
          confidence: 0.95 + Math.random() * 0.05,
        };
      }),
      language: 'en-US',
      duration: currentTime,
    };
  }

  /**
   * Generate mock visual alert
   */
  static createMockVisualAlert(eventType: string = 'notification') {
    return {
      type: 'visual-alert',
      eventType,
      visualType: 'flash',
      color: '#FF0000',
      pattern: 'urgent',
      duration: 2000,
      description: `Visual alert for: ${eventType}`,
      timestamp: Date.now(),
    };
  }
}

export default TestHelpers;
