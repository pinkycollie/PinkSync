/**
 * Event Orchestrator Service Tests
 * Tests for the central event handling system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { eventOrchestrator, events } from '@/services/event-orchestrator/index.ts';
import type { PlatformEvent } from '@/types/index.ts';

describe('Event Orchestrator', () => {
  beforeEach(() => {
    eventOrchestrator.clear();
  });

  afterEach(() => {
    eventOrchestrator.clear();
  });

  describe('Event Subscription and Emission', () => {
    it('should subscribe to specific event types', async () => {
      const handler = vi.fn();
      const unsubscribe = eventOrchestrator.on('user.auth', handler);

      await events.userAuth('user123', 'web', { action: 'login' });
      await testUtils.delay(10);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'user.auth',
          source: 'web',
          userId: 'user123',
        })
      );

      unsubscribe();
    });

    it('should handle multiple event handlers', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventOrchestrator.on('user.auth', handler1);
      eventOrchestrator.on('user.auth', handler2);

      await events.userAuth('user123', 'web', { action: 'login' });
      await testUtils.delay(10);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe handlers correctly', async () => {
      const handler = vi.fn();
      const unsubscribe = eventOrchestrator.on('user.auth', handler);

      await events.userAuth('user123', 'web', { action: 'login' });
      await testUtils.delay(10);
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      await events.userAuth('user123', 'web', { action: 'logout' });
      await testUtils.delay(10);
      expect(handler).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should handle global event handlers', async () => {
      const globalHandler = vi.fn();
      const unsubscribe = eventOrchestrator.onAll(globalHandler);

      await events.userAuth('user123', 'web', { action: 'login' });
      await events.preferenceUpdate('user123', 'extension', { theme: 'dark' });
      await testUtils.delay(10);

      expect(globalHandler).toHaveBeenCalledTimes(2);
      unsubscribe();
    });
  });

  describe('Event Queue Processing', () => {
    it('should process events in order', async () => {
      const results: string[] = [];
      
      eventOrchestrator.on('user.auth', async (event: PlatformEvent) => {
        results.push('auth');
      });
      
      eventOrchestrator.on('user.preference.update', async (event: PlatformEvent) => {
        results.push('preference');
      });

      await events.userAuth('user123', 'web', { action: 'login' });
      await events.preferenceUpdate('user123', 'web', { theme: 'dark' });
      await testUtils.delay(20);

      expect(results).toEqual(['auth', 'preference']);
    });

    it('should handle errors in event handlers gracefully', async () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const successHandler = vi.fn();

      eventOrchestrator.on('user.auth', errorHandler);
      eventOrchestrator.on('user.auth', successHandler);

      await events.userAuth('user123', 'web', { action: 'login' });
      await testUtils.delay(10);

      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(successHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Middleware', () => {
    it('should execute middleware before handlers', async () => {
      const executionOrder: string[] = [];
      
      eventOrchestrator.use(async (event: PlatformEvent) => {
        executionOrder.push('middleware');
        return true;
      });

      eventOrchestrator.on('user.auth', async () => {
        executionOrder.push('handler');
      });

      await events.userAuth('user123', 'web', { action: 'login' });
      await testUtils.delay(10);

      expect(executionOrder).toEqual(['middleware', 'handler']);
    });

    it('should stop event propagation when middleware returns false', async () => {
      const handler = vi.fn();

      eventOrchestrator.use(async () => false);
      eventOrchestrator.on('user.auth', handler);

      await events.userAuth('user123', 'web', { action: 'login' });
      await testUtils.delay(10);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Event Statistics', () => {
    it('should track handler and queue statistics', () => {
      eventOrchestrator.on('user.auth', vi.fn());
      eventOrchestrator.on('user.auth', vi.fn());
      eventOrchestrator.on('user.preference.update', vi.fn());
      eventOrchestrator.onAll(vi.fn());

      const stats = eventOrchestrator.getStats();

      expect(stats.handlerCount).toBe(3);
      expect(stats.globalHandlerCount).toBe(1);
    });
  });

  describe('Common Event Helpers', () => {
    it('should emit user authentication events', async () => {
      const handler = vi.fn();
      eventOrchestrator.on('user.auth', handler);

      await events.userAuth('user123', 'extension', { action: 'login', method: 'visual-auth' });
      await testUtils.delay(10);

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'user.auth',
          source: 'extension',
          userId: 'user123',
        })
      );
    });

    it('should emit preference update events', async () => {
      const handler = vi.fn();
      eventOrchestrator.on('user.preference.update', handler);

      await events.preferenceUpdate('user123', 'web', { captionsEnabled: true });
      await testUtils.delay(10);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should emit content transform events', async () => {
      const handler = vi.fn();
      eventOrchestrator.on('content.transform', handler);

      await events.contentTransform('user123', 'extension', { element: 'video', action: 'add-captions' });
      await testUtils.delay(10);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should emit service request events', async () => {
      const handler = vi.fn();
      eventOrchestrator.on('service.request', handler);

      await events.serviceRequest('user123', 'api', { service: 'interpreter', action: 'book' });
      await testUtils.delay(10);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
