# Contributing to PinkSync - Testing Guide

## Welcome Contributors!

Thank you for contributing to PinkSync, an accessibility orchestration platform for deaf users. This guide will help you understand our testing practices and how to contribute effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Testing Philosophy](#testing-philosophy)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Browser Testing](#browser-testing)
6. [AI Component Testing](#ai-component-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Code Review Process](#code-review-process)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/pinkycollie/PinkSync.git
cd PinkSync

# Install dependencies
npm ci --legacy-peer-deps

# Install Playwright browsers
npm run playwright:install

# Run tests to verify setup
npm test
```

## Testing Philosophy

### Core Principles

1. **Deaf-First**: All features prioritize visual accessibility
2. **Comprehensive**: Test all critical paths
3. **Fast Feedback**: Tests should run quickly
4. **Maintainable**: Tests should be easy to read and update
5. **Reliable**: Tests should not be flaky

### Test Pyramid

```
       /\
      /E2E\         <- Few, slow, comprehensive
     /------\
    /  Integ \      <- Some, medium speed
   /----------\
  / Unit Tests \    <- Many, fast, focused
 /--------------\
```

- **70%** Unit tests
- **20%** Integration tests
- **10%** E2E tests

## Test Structure

### Directory Organization

```
tests/
├── unit/              # Fast, isolated tests
├── integration/       # Service interaction tests
├── smoke/             # Critical path validation
├── e2e/               # Browser-based tests
├── helpers/           # Shared test utilities
└── setup.ts           # Global test configuration
```

### Naming Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Test suites: Descriptive `describe()` blocks
- Test cases: Start with `should` or `must`

Example:
```typescript
describe('API Broker', () => {
  describe('Provider Registration', () => {
    it('should register a new service provider', async () => {
      // Test implementation
    });
  });
});
```

## Writing Tests

### Unit Tests

**When to write:**
- Testing individual functions
- Testing service methods
- Testing utility functions

**Example:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { eventOrchestrator } from '@/services/event-orchestrator/index.ts';

describe('Event Orchestrator', () => {
  beforeEach(() => {
    eventOrchestrator.clear();
  });

  it('should emit and handle events', async () => {
    const handler = vi.fn();
    eventOrchestrator.on('user.auth', handler);
    
    await eventOrchestrator.emit('user.auth', 'web', { action: 'login' });
    await testUtils.delay(10);
    
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

**When to write:**
- Testing service-to-service communication
- Testing event flows
- Testing data persistence

**Example:**
```typescript
describe('Microservices Integration', () => {
  it('should emit events when providers are registered', async () => {
    const handler = vi.fn();
    eventOrchestrator.on('provider.update', handler);
    
    await apiBroker.registerProvider({...});
    await testUtils.delay(20);
    
    expect(handler).toHaveBeenCalled();
  });
});
```

### Smoke Tests

**When to write:**
- Testing critical user flows
- Testing service availability
- Testing deployment readiness

**Example:**
```typescript
describe('Smoke Tests - Critical Functionality', () => {
  it('should complete user authentication flow', async () => {
    const flow = {
      authReceived: false,
      preferenceLoaded: false,
    };
    
    // Test critical path
    eventOrchestrator.on('user.auth', () => {
      flow.authReceived = true;
    });
    
    await eventOrchestrator.emit('user.auth', 'extension', {...});
    await testUtils.delay(30);
    
    expect(flow.authReceived).toBe(true);
  });
});
```

## Browser Testing

### Writing Browser Tests

Use Playwright for cross-browser testing:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should load the application successfully', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const title = await page.title();
  expect(title).toBeTruthy();
});
```

### Accessibility Testing

Always include accessibility checks:

```typescript
test('should pass WCAG AAA accessibility checks', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

### Browser Compatibility

Test across multiple browsers:

```bash
# Run all browsers
npm run test:e2e

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## AI Component Testing

### Speed Validation

Test AI services for performance:

```typescript
describe('AI Service Speed', () => {
  it('should process requests within time limit', async () => {
    const startTime = Date.now();
    
    const result = await aiService.process(input);
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(200); // 200ms threshold
    expect(result).toBeTruthy();
  });
});
```

### Correctness Validation

Test AI outputs for accuracy:

```typescript
describe('AI Service Correctness', () => {
  it('should validate ASL recognition accuracy', async () => {
    const result = await aslRecognizer.recognize(signData);
    
    expect(result.signs).toBeInstanceOf(Array);
    expect(result.signs.length).toBeGreaterThan(0);
    
    result.signs.forEach(sign => {
      expect(sign.confidence).toBeGreaterThan(0.9);
    });
  });
});
```

### AI Model Metrics

Track performance metrics:

```typescript
describe('AI Performance Metrics', () => {
  it('should maintain high accuracy', () => {
    const predictions = [...];
    
    const accuracy = predictions.filter(
      p => p.expected === p.predicted
    ).length / predictions.length;
    
    expect(accuracy).toBeGreaterThan(0.95); // 95% accuracy
  });
});
```

## Accessibility Testing

### Deaf-Specific Features

Always test deaf accessibility features:

1. **Visual Indicators**
   ```typescript
   test('should have visual alerts for audio events', async ({ page }) => {
     // Test implementation
   });
   ```

2. **ARIA Labels**
   ```typescript
   test('should have proper ARIA labels', async ({ page }) => {
     const results = await new AxeBuilder({ page })
       .include('button, a, input')
       .analyze();
     expect(results.violations).toEqual([]);
   });
   ```

3. **Keyboard Navigation**
   ```typescript
   test('should support keyboard navigation', async ({ page }) => {
     await page.keyboard.press('Tab');
     const focused = await page.locator(':focus');
     await expect(focused).toBeTruthy();
   });
   ```

4. **Sign Language Features**
   ```typescript
   it('should validate ASL glossing', async () => {
     const result = await aslGlosser.gloss(['hello', 'world']);
     expect(result.gloss).toBe('HELLO WORLD');
     expect(result.culturalContext).toBe('American Sign Language');
   });
   ```

### WCAG Compliance

Ensure WCAG AAA compliance:

```typescript
test('should meet WCAG AAA standards', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

## Code Review Process

### Before Submitting

1. **Run all tests**
   ```bash
   npm run test:all
   ```

2. **Check coverage**
   ```bash
   npm run test:coverage
   ```
   - Ensure minimum 70% coverage
   - Add tests for new code

3. **Run linter**
   ```bash
   npm run lint
   ```

4. **Test accessibility**
   ```bash
   npm run test:browser
   ```

### Pull Request Checklist

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Coverage meets minimum (70%)
- [ ] Accessibility tests included for UI changes
- [ ] Browser compatibility tested
- [ ] Documentation updated
- [ ] No console errors or warnings

### Review Guidelines

**For Reviewers:**
1. Check test coverage
2. Verify accessibility compliance
3. Test deaf-specific features
4. Review AI service validation
5. Ensure browser compatibility

**For Contributors:**
1. Respond to feedback promptly
2. Update tests based on feedback
3. Maintain test quality
4. Document complex test logic

## Best Practices

### Do's ✅

- Write descriptive test names
- Use arrange-act-assert pattern
- Clean up after tests
- Test edge cases
- Mock external dependencies
- Use test utilities
- Test accessibility features
- Validate AI performance

### Don'ts ❌

- Don't skip tests
- Don't test implementation details
- Don't use `any` types in tests
- Don't ignore flaky tests
- Don't forget to clean up
- Don't hardcode timeouts
- Don't skip accessibility checks
- Don't ignore browser compatibility

## Common Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeTruthy();
});
```

### Testing Events

```typescript
it('should emit events correctly', async () => {
  const handler = vi.fn();
  eventOrchestrator.on('event.type', handler);
  
  await eventOrchestrator.emit('event.type', 'source', {});
  await testUtils.delay(10);
  
  expect(handler).toHaveBeenCalled();
});
```

### Testing Errors

```typescript
it('should handle errors gracefully', async () => {
  await expect(
    service.invalidOperation()
  ).rejects.toThrow('Error message');
});
```

## Resources

### Documentation
- [Test Suite Documentation](./TEST_SUITE.md)
- [Vitest Guide](https://vitest.dev/guide/)
- [Playwright Guide](https://playwright.dev/docs/intro)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Wave Browser Extension](https://wave.webaim.org/extension/)

### Community
- GitHub Discussions
- Issue Tracker
- Pull Request Reviews

## Getting Help

If you need help:

1. Check existing tests for examples
2. Review documentation
3. Ask in GitHub Discussions
4. Create an issue with questions

## Thank You!

Your contributions help make PinkSync better for the deaf community. Every test you write improves accessibility and reliability.

---

**Happy Testing! 🧪**

For questions or support, please open an issue or reach out to the maintainers.
