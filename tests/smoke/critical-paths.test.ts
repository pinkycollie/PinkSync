/**
 * Smoke Tests for PinkSync
 * Quick health checks for critical functionality across environments
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { eventOrchestrator } from '@/services/event-orchestrator/index.ts';
import { apiBroker } from '@/services/api-broker/index.ts';

describe('Smoke Tests - Critical Functionality', () => {
  describe('Service Availability', () => {
    it('should have event orchestrator available', () => {
      expect(eventOrchestrator).toBeDefined();
      expect(typeof eventOrchestrator.emit).toBe('function');
      expect(typeof eventOrchestrator.on).toBe('function');
    });

    it('should have API broker available', () => {
      expect(apiBroker).toBeDefined();
      expect(typeof apiBroker.registerProvider).toBe('function');
      expect(typeof apiBroker.matchProviders).toBe('function');
    });
  });

  describe('Core Service Functionality', () => {
    it('should emit and handle events', async () => {
      let eventReceived = false;
      
      const unsubscribe = eventOrchestrator.on('user.auth', () => {
        eventReceived = true;
      });

      await eventOrchestrator.emit('user.auth', 'web', { test: true }, 'smoke-test');
      await testUtils.delay(10);

      expect(eventReceived).toBe(true);
      unsubscribe();
    });

    it('should retrieve service providers', () => {
      const providers = apiBroker.getAllProviders();
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);
    });

    it('should search for providers', () => {
      const results = apiBroker.searchProviders('service');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('should have properly seeded provider data', () => {
      const providers = apiBroker.getAllProviders();
      
      providers.forEach(provider => {
        expect(provider.id).toBeTruthy();
        expect(provider.name).toBeTruthy();
        expect(provider.type).toBeTruthy();
        expect(provider.description).toBeTruthy();
        expect(provider.apiEndpoint).toBeTruthy();
        expect(Array.isArray(provider.capabilities)).toBe(true);
        expect(provider.accessibilityScore).toBeGreaterThanOrEqual(0);
        expect(provider.accessibilityScore).toBeLessThanOrEqual(100);
        expect(typeof provider.active).toBe('boolean');
      });
    });

    it('should have providers with valid capabilities', () => {
      const providers = apiBroker.getAllProviders();
      
      providers.forEach(provider => {
        provider.capabilities.forEach(capability => {
          expect(capability.name).toBeTruthy();
          expect(capability.description).toBeTruthy();
          expect(capability.endpoint).toBeTruthy();
        });
      });
    });
  });

  describe('Basic API Operations', () => {
    it('should register a new provider successfully', async () => {
      const providerId = await apiBroker.registerProvider({
        name: 'Smoke Test Provider',
        type: 'employment',
        description: 'Temporary provider for smoke testing',
        apiEndpoint: '/api/smoke-test',
        capabilities: [
          {
            name: 'test-capability',
            description: 'Test capability',
            endpoint: '/test',
          },
        ],
        accessibilityScore: 90,
        active: true,
      });

      expect(providerId).toBeTruthy();
      expect(providerId).toMatch(/^provider_/);

      const provider = apiBroker.getProvider(providerId);
      expect(provider).toBeTruthy();
      expect(provider?.name).toBe('Smoke Test Provider');
    });

    it('should match providers based on criteria', async () => {
      const matches = await apiBroker.matchProviders('smoke-test-user', {
        type: 'employment',
        minAccessibilityScore: 70,
      });

      expect(Array.isArray(matches)).toBe(true);
      matches.forEach(provider => {
        expect(provider.type).toBe('employment');
        expect(provider.accessibilityScore).toBeGreaterThanOrEqual(70);
      });
    });
  });

  describe('Event System Health', () => {
    it('should handle event subscriptions and emissions', async () => {
      const events: string[] = [];
      
      const unsubscribe1 = eventOrchestrator.on('user.auth', () => {
        events.push('auth');
      });
      
      const unsubscribe2 = eventOrchestrator.on('user.preference.update', () => {
        events.push('preference');
      });

      await eventOrchestrator.emit('user.auth', 'web', {}, 'test-user');
      await eventOrchestrator.emit('user.preference.update', 'web', {}, 'test-user');
      await testUtils.delay(20);

      expect(events).toContain('auth');
      expect(events).toContain('preference');

      unsubscribe1();
      unsubscribe2();
    });

    it('should report accurate event statistics', () => {
      eventOrchestrator.clear();
      
      const handler1 = () => {};
      const handler2 = () => {};
      
      eventOrchestrator.on('user.auth', handler1);
      eventOrchestrator.on('user.auth', handler2);
      eventOrchestrator.on('service.request', handler1);

      const stats = eventOrchestrator.getStats();
      
      expect(stats.handlerCount).toBe(3);
      expect(stats.queueLength).toBe(0);
      
      eventOrchestrator.clear();
    });
  });

  describe('Performance Check', () => {
    it('should handle basic operations quickly', async () => {
      const startTime = Date.now();

      // Perform basic operations
      apiBroker.getAllProviders();
      apiBroker.searchProviders('test');
      await apiBroker.matchProviders('user123', { type: 'employment' });
      
      await eventOrchestrator.emit('user.auth', 'web', {}, 'user123');
      await testUtils.delay(10);

      const duration = Date.now() - startTime;
      
      // All operations should complete within 200ms
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Error Handling Resilience', () => {
    it('should handle invalid inputs gracefully', () => {
      const nonExistentProvider = apiBroker.getProvider('invalid-id');
      expect(nonExistentProvider).toBeNull();

      const emptySearch = apiBroker.searchProviders('');
      expect(Array.isArray(emptySearch)).toBe(true);
    });

    it('should handle errors in event handlers', async () => {
      const errorHandler = () => {
        throw new Error('Test error');
      };
      const successHandler = () => {
        // This should still run
      };

      eventOrchestrator.on('user.auth', errorHandler);
      eventOrchestrator.on('user.auth', successHandler);

      // Should not throw
      await expect(
        eventOrchestrator.emit('user.auth', 'web', {}, 'test-user')
      ).resolves.not.toThrow();
      
      await testUtils.delay(10);
      eventOrchestrator.clear();
    });
  });
});

describe('Smoke Tests - Environment-Specific', () => {
  describe('Test Environment Configuration', () => {
    it('should run in test environment', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should have test utilities available', () => {
      expect(globalThis.testUtils).toBeDefined();
      expect(typeof globalThis.testUtils.generateMockUserId).toBe('function');
      expect(typeof globalThis.testUtils.delay).toBe('function');
    });
  });

  describe('Critical Path Validation', () => {
    it('should complete user authentication flow', async () => {
      const flow = {
        authReceived: false,
        preferenceLoaded: false,
        providerMatched: false,
      };

      const unsubAuth = eventOrchestrator.on('user.auth', () => {
        flow.authReceived = true;
      });

      const unsubPref = eventOrchestrator.on('user.preference.update', () => {
        flow.preferenceLoaded = true;
      });

      const unsubService = eventOrchestrator.on('service.request', () => {
        flow.providerMatched = true;
      });

      // Simulate user flow
      await eventOrchestrator.emit('user.auth', 'extension', { action: 'login' }, 'user123');
      await eventOrchestrator.emit('user.preference.update', 'api', { captionsEnabled: true }, 'user123');
      await eventOrchestrator.emit('service.request', 'web', { type: 'interpreter' }, 'user123');
      
      await testUtils.delay(30);

      expect(flow.authReceived).toBe(true);
      expect(flow.preferenceLoaded).toBe(true);
      expect(flow.providerMatched).toBe(true);

      unsubAuth();
      unsubPref();
      unsubService();
    });
  });
});
