/**
 * API Broker Service Tests
 * Tests for the unified API gateway and provider matching system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiBroker } from '@/services/api-broker/index.ts';
import type { ServiceProvider, ProviderType } from '@/types/index.ts';

describe('API Broker', () => {
  describe('Provider Registration', () => {
    it('should register a new service provider', async () => {
      const provider = {
        name: 'Test Provider',
        type: 'employment' as ProviderType,
        description: 'A test provider for employment services',
        apiEndpoint: '/api/test-provider',
        capabilities: [
          {
            name: 'job-search',
            description: 'Job search capability',
            endpoint: '/jobs',
          },
        ],
        accessibilityScore: 85,
        active: true,
      };

      const providerId = await apiBroker.registerProvider(provider);

      expect(providerId).toBeTruthy();
      expect(providerId).toMatch(/^provider_/);

      const registered = apiBroker.getProvider(providerId);
      expect(registered).toBeTruthy();
      expect(registered?.name).toBe('Test Provider');
      expect(registered?.type).toBe('employment');
    });

    it('should generate unique provider IDs', async () => {
      const provider1 = await apiBroker.registerProvider({
        name: 'Provider 1',
        type: 'employment',
        description: 'First provider',
        apiEndpoint: '/api/p1',
        capabilities: [],
        accessibilityScore: 80,
        active: true,
      });

      const provider2 = await apiBroker.registerProvider({
        name: 'Provider 2',
        type: 'education',
        description: 'Second provider',
        apiEndpoint: '/api/p2',
        capabilities: [],
        accessibilityScore: 90,
        active: true,
      });

      expect(provider1).not.toBe(provider2);
    });
  });

  describe('Provider Retrieval', () => {
    it('should get all providers', async () => {
      const providers = apiBroker.getAllProviders();
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0); // Should have seed data
    });

    it('should get providers by type', async () => {
      const employmentProviders = apiBroker.getProvidersByType('employment');
      
      expect(Array.isArray(employmentProviders)).toBe(true);
      employmentProviders.forEach(provider => {
        expect(provider.type).toBe('employment');
      });
    });

    it('should return null for non-existent provider', () => {
      const provider = apiBroker.getProvider('non-existent-id');
      expect(provider).toBeNull();
    });
  });

  describe('Provider Search', () => {
    it('should search providers by keyword', () => {
      const results = apiBroker.searchProviders('education');
      
      expect(Array.isArray(results)).toBe(true);
      results.forEach(provider => {
        const searchableText = `${provider.name} ${provider.description}`.toLowerCase();
        expect(searchableText).toContain('education');
      });
    });

    it('should search providers by type', () => {
      const results = apiBroker.searchProviders('job', 'employment');
      
      expect(Array.isArray(results)).toBe(true);
      results.forEach(provider => {
        expect(provider.type).toBe('employment');
      });
    });

    it('should sort results by accessibility score', () => {
      const results = apiBroker.searchProviders('service');
      
      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].accessibilityScore).toBeGreaterThanOrEqual(
            results[i + 1].accessibilityScore
          );
        }
      }
    });
  });

  describe('Provider Matching', () => {
    it('should match providers by type', async () => {
      const matches = await apiBroker.matchProviders('user123', {
        type: 'employment',
      });

      expect(Array.isArray(matches)).toBe(true);
      matches.forEach(provider => {
        expect(provider.type).toBe('employment');
      });
    });

    it('should match providers by minimum accessibility score', async () => {
      const matches = await apiBroker.matchProviders('user123', {
        minAccessibilityScore: 85,
      });

      matches.forEach(provider => {
        expect(provider.accessibilityScore).toBeGreaterThanOrEqual(85);
      });
    });

    it('should match providers by keywords', async () => {
      const matches = await apiBroker.matchProviders('user123', {
        keywords: ['interpreter', 'sign language'],
      });

      expect(Array.isArray(matches)).toBe(true);
    });

    it('should combine multiple matching criteria', async () => {
      const matches = await apiBroker.matchProviders('user123', {
        type: 'healthcare',
        minAccessibilityScore: 75,
        keywords: ['interpreter'],
      });

      matches.forEach(provider => {
        expect(provider.type).toBe('healthcare');
        expect(provider.accessibilityScore).toBeGreaterThanOrEqual(75);
      });
    });
  });

  describe('Provider API Calls', () => {
    it('should call provider API with valid capability', async () => {
      const providers = apiBroker.getAllProviders();
      const provider = providers[0];
      
      if (provider && provider.capabilities.length > 0) {
        const capability = provider.capabilities[0];
        const result = await apiBroker.callProviderApi(
          provider.id,
          capability.name,
          { param1: 'value1' }
        );

        expect(result).toBeTruthy();
        expect(result.success).toBe(true);
        expect(result.provider).toBe(provider.name);
      }
    });

    it('should throw error for non-existent provider', async () => {
      await expect(
        apiBroker.callProviderApi('non-existent', 'capability', {})
      ).rejects.toThrow('Provider non-existent not found');
    });

    it('should throw error for non-existent capability', async () => {
      const providers = apiBroker.getAllProviders();
      const provider = providers[0];
      
      if (provider) {
        await expect(
          apiBroker.callProviderApi(provider.id, 'non-existent-capability', {})
        ).rejects.toThrow();
      }
    });
  });

  describe('Provider Status Management', () => {
    it('should update provider status', async () => {
      const providerId = await apiBroker.registerProvider({
        name: 'Status Test Provider',
        type: 'employment',
        description: 'Provider for status testing',
        apiEndpoint: '/api/status-test',
        capabilities: [],
        accessibilityScore: 80,
        active: true,
      });

      const updated = await apiBroker.updateProviderStatus(providerId, false);
      expect(updated).toBe(true);

      const provider = apiBroker.getProvider(providerId);
      expect(provider?.active).toBe(false);
    });

    it('should return false for non-existent provider status update', async () => {
      const result = await apiBroker.updateProviderStatus('non-existent', true);
      expect(result).toBe(false);
    });
  });

  describe('Accessibility Score Management', () => {
    it('should update provider accessibility score', async () => {
      const providerId = await apiBroker.registerProvider({
        name: 'Score Test Provider',
        type: 'education',
        description: 'Provider for score testing',
        apiEndpoint: '/api/score-test',
        capabilities: [],
        accessibilityScore: 80,
        active: true,
      });

      await apiBroker.updateAccessibilityScore(providerId, 95);
      
      const provider = apiBroker.getProvider(providerId);
      expect(provider?.accessibilityScore).toBe(95);
    });

    it('should clamp accessibility score to valid range', async () => {
      const providerId = await apiBroker.registerProvider({
        name: 'Clamp Test Provider',
        type: 'healthcare',
        description: 'Provider for clamp testing',
        apiEndpoint: '/api/clamp-test',
        capabilities: [],
        accessibilityScore: 80,
        active: true,
      });

      await apiBroker.updateAccessibilityScore(providerId, 150);
      let provider = apiBroker.getProvider(providerId);
      expect(provider?.accessibilityScore).toBe(100);

      await apiBroker.updateAccessibilityScore(providerId, -10);
      provider = apiBroker.getProvider(providerId);
      expect(provider?.accessibilityScore).toBe(0);
    });
  });

  describe('Statistics and Metrics', () => {
    it('should provide broker statistics', () => {
      const stats = apiBroker.getStats();

      expect(stats).toBeTruthy();
      expect(stats.totalProviders).toBeGreaterThan(0);
      expect(stats.activeProviders).toBeDefined();
      expect(stats.averageAccessibilityScore).toBeGreaterThan(0);
      expect(stats.providersByType).toBeTruthy();
    });

    it('should provide individual provider statistics', async () => {
      const providers = apiBroker.getAllProviders();
      const provider = providers[0];

      if (provider) {
        const stats = apiBroker.getProviderStats(provider.id);

        expect(stats).toBeTruthy();
        expect(stats?.name).toBe(provider.name);
        expect(stats?.capabilityCount).toBe(provider.capabilities.length);
      }
    });
  });
});
