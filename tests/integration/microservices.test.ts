/**
 * Microservices Integration Tests
 * Tests for verifying communication and alignment between microservices
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { eventOrchestrator, events } from '@/services/event-orchestrator/index.ts';
import { apiBroker } from '@/services/api-broker/index.ts';
import type { PlatformEvent } from '@/types/index.ts';

describe('Microservices Integration', () => {
  beforeEach(() => {
    eventOrchestrator.clear();
  });

  afterEach(() => {
    eventOrchestrator.clear();
  });

  describe('Event Orchestrator + API Broker Integration', () => {
    it('should emit events when providers are registered', async () => {
      const providerUpdateHandler = vi.fn();
      eventOrchestrator.on('provider.update', providerUpdateHandler);

      await apiBroker.registerProvider({
        name: 'Integration Test Provider',
        type: 'employment',
        description: 'Test provider for integration',
        apiEndpoint: '/api/integration-test',
        capabilities: [],
        accessibilityScore: 90,
        active: true,
      });

      await testUtils.delay(20);

      expect(providerUpdateHandler).toHaveBeenCalledTimes(1);
      expect(providerUpdateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider.update',
          source: 'api',
        })
      );
    });

    it('should emit events when provider status changes', async () => {
      const providerUpdateHandler = vi.fn();
      eventOrchestrator.on('provider.update', providerUpdateHandler);

      const providerId = await apiBroker.registerProvider({
        name: 'Status Test Provider',
        type: 'education',
        description: 'Test provider for status changes',
        apiEndpoint: '/api/status-test',
        capabilities: [],
        accessibilityScore: 85,
        active: true,
      });

      await testUtils.delay(20);
      providerUpdateHandler.mockClear();

      await apiBroker.updateProviderStatus(providerId, false);
      await testUtils.delay(20);

      expect(providerUpdateHandler).toHaveBeenCalledTimes(1);
      expect(providerUpdateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'status_update',
            providerId,
            active: false,
          }),
        })
      );
    });

    it('should emit events when matching providers', async () => {
      const serviceRequestHandler = vi.fn();
      eventOrchestrator.on('service.request', serviceRequestHandler);

      await apiBroker.matchProviders('user123', {
        type: 'employment',
        minAccessibilityScore: 80,
      });

      await testUtils.delay(20);

      expect(serviceRequestHandler).toHaveBeenCalledTimes(1);
      expect(serviceRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'service.request',
          userId: 'user123',
          payload: expect.objectContaining({
            action: 'match',
          }),
        })
      );
    });
  });

  describe('Service Communication Flow', () => {
    it('should handle user authentication flow across services', async () => {
      const events: PlatformEvent[] = [];
      
      eventOrchestrator.onAll((event) => {
        events.push(event);
      });

      // Simulate user authentication
      await eventOrchestrator.emit('user.auth', 'extension', {
        action: 'login',
        method: 'visual-auth',
      }, 'user123');

      // Simulate preference loading
      await eventOrchestrator.emit('user.preference.update', 'api', {
        captionsEnabled: true,
        signLanguage: 'ASL',
      }, 'user123');

      // Simulate service matching
      await eventOrchestrator.emit('service.request', 'web', {
        action: 'find-interpreters',
      }, 'user123');

      await testUtils.delay(20);

      expect(events.length).toBeGreaterThanOrEqual(3);
      expect(events[0].type).toBe('user.auth');
      expect(events[1].type).toBe('user.preference.update');
      expect(events[2].type).toBe('service.request');
    });

    it('should handle content transformation workflow', async () => {
      const contentEvents: PlatformEvent[] = [];
      
      eventOrchestrator.on('content.transform', (event) => {
        contentEvents.push(event);
      });

      // Simulate multiple content transformations
      await eventOrchestrator.emit('content.transform', 'extension', {
        element: 'video',
        action: 'add-captions',
        url: 'https://example.com/video1',
      }, 'user123');

      await eventOrchestrator.emit('content.transform', 'extension', {
        element: 'audio',
        action: 'visual-alert',
        url: 'https://example.com/audio1',
      }, 'user123');

      await testUtils.delay(20);

      expect(contentEvents.length).toBe(2);
      expect(contentEvents[0].payload.element).toBe('video');
      expect(contentEvents[1].payload.element).toBe('audio');
    });
  });

  describe('Service Health and Synchronization', () => {
    it('should verify all services are accessible', () => {
      expect(eventOrchestrator).toBeDefined();
      expect(apiBroker).toBeDefined();
      expect(typeof eventOrchestrator.emit).toBe('function');
      expect(typeof apiBroker.matchProviders).toBe('function');
    });

    it('should handle concurrent operations across services', async () => {
      const results: string[] = [];

      eventOrchestrator.on('user.auth', async () => {
        results.push('auth-handled');
      });

      eventOrchestrator.on('service.request', async () => {
        results.push('service-handled');
      });

      // Concurrent operations
      await Promise.all([
        events.userAuth('user1', 'web', { action: 'login' }),
        events.serviceRequest('user1', 'api', { service: 'interpreter' }),
        apiBroker.matchProviders('user1', { type: 'employment' }),
      ]);

      await testUtils.delay(50);

      expect(results).toContain('auth-handled');
      expect(results).toContain('service-handled');
    });

    it('should maintain event ordering across services', async () => {
      const executionOrder: string[] = [];

      eventOrchestrator.on('user.auth', async () => {
        executionOrder.push('1-auth');
      });

      eventOrchestrator.on('user.preference.update', async () => {
        executionOrder.push('2-preference');
      });

      eventOrchestrator.on('service.request', async () => {
        executionOrder.push('3-service');
      });

      await events.userAuth('user123', 'web', { action: 'login' });
      await events.preferenceUpdate('user123', 'web', { theme: 'dark' });
      await events.serviceRequest('user123', 'api', { service: 'vr' });

      await testUtils.delay(50);

      expect(executionOrder).toEqual(['1-auth', '2-preference', '3-service']);
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle service errors without affecting other services', async () => {
      const successfulHandler = vi.fn();
      
      eventOrchestrator.on('user.auth', async () => {
        throw new Error('Service error');
      });

      eventOrchestrator.on('user.auth', successfulHandler);

      await events.userAuth('user123', 'web', { action: 'login' });
      await testUtils.delay(20);

      expect(successfulHandler).toHaveBeenCalledTimes(1);
    });

    it('should gracefully handle invalid provider operations', async () => {
      const provider = apiBroker.getProvider('non-existent-id');
      expect(provider).toBeNull();

      const updated = await apiBroker.updateProviderStatus('non-existent-id', true);
      expect(updated).toBe(false);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple concurrent events efficiently', async () => {
      const startTime = Date.now();
      const eventCount = 100;
      const handler = vi.fn();

      eventOrchestrator.on('user.auth', handler);

      const promises = Array.from({ length: eventCount }, (_, i) =>
        events.userAuth(`user${i}`, 'web', { action: 'login' })
      );

      await Promise.all(promises);
      await testUtils.delay(100);

      const duration = Date.now() - startTime;

      expect(handler).toHaveBeenCalledTimes(eventCount);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    it('should handle large provider datasets efficiently', async () => {
      const startTime = Date.now();
      
      // Register multiple providers
      const registrations = Array.from({ length: 20 }, (_, i) =>
        apiBroker.registerProvider({
          name: `Performance Test Provider ${i}`,
          type: 'employment',
          description: 'Test provider',
          apiEndpoint: `/api/test-${i}`,
          capabilities: [],
          accessibilityScore: 80 + (i % 20),
          active: true,
        })
      );

      await Promise.all(registrations);

      const matches = await apiBroker.matchProviders('user123', {
        type: 'employment',
        minAccessibilityScore: 85,
      });

      const duration = Date.now() - startTime;

      expect(matches.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
