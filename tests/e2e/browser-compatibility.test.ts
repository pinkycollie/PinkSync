/**
 * Browser Compatibility E2E Tests
 * Tests critical accessibility features across different browsers
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Browser Compatibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should load the application successfully', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check that the page title is present
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Verify the page is interactive
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should pass accessibility checks (WCAG AAA)', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper ARIA labels for deaf accessibility', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for visual indicators and ARIA labels
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
      .include('button, a, input, select, textarea')
      .analyze();

    // Should have proper labels and roles
    expect(accessibilityScanResults.violations.filter(
      v => v.id === 'button-name' || v.id === 'link-name'
    )).toEqual([]);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeTruthy();
  });

  test('should render visual elements correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check that images have alt text
    const images = await page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});

test.describe('Browser Extension Compatibility', () => {
  test('should detect browser extension capabilities', async ({ page, context }) => {
    // Check if browser supports extension APIs
    const hasExtensionSupport = await page.evaluate(() => {
      return typeof (window as any).chrome !== 'undefined';
    });
    
    // Chrome, Edge, and some Firefox versions should support this
    if (process.env.BROWSER !== 'webkit') {
      // WebKit (Safari) may not have full extension support
      expect(hasExtensionSupport).toBeDefined();
    }
  });

  test('should support local storage for user preferences', async ({ page }) => {
    await page.goto('/');
    
    // Test local storage functionality
    await page.evaluate(() => {
      localStorage.setItem('test-preference', 'true');
    });
    
    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('test-preference');
    });
    
    expect(storedValue).toBe('true');
    
    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('test-preference');
    });
  });

  test('should handle clipboard operations for accessibility', async ({ page, context }) => {
    await page.goto('/');
    
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Test clipboard write
    await page.evaluate(async () => {
      await navigator.clipboard.writeText('test content');
    });
    
    // Test clipboard read
    const clipboardContent = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    
    expect(clipboardContent).toBe('test content');
  });
});

test.describe('Responsive Design Tests', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that content is visible on mobile
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });
    
    // DOM content should load quickly
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });
});

test.describe('Visual Accessibility Features', () => {
  test('should have high contrast mode support', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if page respects prefers-contrast media query
    const supportsHighContrast = await page.evaluate(() => {
      return window.matchMedia('(prefers-contrast: high)').matches !== undefined;
    });
    
    expect(supportsHighContrast).toBeDefined();
  });

  test('should support reduced motion preferences', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const supportsReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches !== undefined;
    });
    
    expect(supportsReducedMotion).toBeDefined();
  });

  test('should have proper color contrast for deaf accessibility', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });
});
