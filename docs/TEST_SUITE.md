# PinkSync Test Suite Documentation

## Overview

The PinkSync test suite is a comprehensive testing framework designed to ensure the reliability, accessibility, and performance of the PinkSync platform. It includes unit tests, integration tests, smoke tests, browser compatibility tests, and AI service validation.

## Test Structure

```
tests/
├── unit/                      # Unit tests for individual services
│   ├── event-orchestrator.test.ts
│   ├── api-broker.test.ts
│   └── ai-validation.test.ts
├── integration/               # Integration tests for service communication
│   └── microservices.test.ts
├── smoke/                     # Smoke tests for critical functionality
│   └── critical-paths.test.ts
├── e2e/                       # End-to-end browser tests
│   └── browser-compatibility.test.ts
├── helpers/                   # Test helper utilities
└── setup.ts                   # Global test setup
```

## Running Tests

### Quick Start

```bash
# Install dependencies
npm ci --legacy-peer-deps

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:smoke          # Smoke tests only
npm run test:e2e            # Browser compatibility tests

# Watch mode for development
npm run test:watch

# Interactive UI
npm run test:ui
```

### Browser Compatibility Tests

```bash
# Install Playwright browsers
npm run playwright:install

# Run all browser tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual services and functions in isolation

**Location**: `tests/unit/`

**Example**:
```typescript
import { describe, it, expect } from 'vitest';
import { apiBroker } from '@/services/api-broker/index.ts';

describe('API Broker', () => {
  it('should register a new service provider', async () => {
    const providerId = await apiBroker.registerProvider({...});
    expect(providerId).toBeTruthy();
  });
});
```

**Coverage**:
- Event Orchestrator service
- API Broker service
- AI validation (speed and accuracy)
- Individual microservice logic

### 2. Integration Tests

**Purpose**: Test interaction between multiple services

**Location**: `tests/integration/`

**Example**:
```typescript
describe('Microservices Integration', () => {
  it('should handle user authentication flow', async () => {
    // Test event orchestrator + API broker integration
    await events.userAuth('user123', 'web', {...});
    await apiBroker.matchProviders('user123', {...});
    // Verify integration works correctly
  });
});
```

**Coverage**:
- Event Orchestrator + API Broker communication
- Service synchronization
- Concurrent operations
- Error handling across services

### 3. Smoke Tests

**Purpose**: Quick health checks for critical functionality

**Location**: `tests/smoke/`

**When to Run**:
- Before deployment
- After major changes
- In CI/CD pipeline

**Example**:
```typescript
describe('Smoke Tests - Critical Functionality', () => {
  it('should have event orchestrator available', () => {
    expect(eventOrchestrator).toBeDefined();
  });
});
```

**Coverage**:
- Service availability
- Core functionality
- Data integrity
- Basic API operations

### 4. Browser Compatibility Tests

**Purpose**: Ensure accessibility features work across browsers

**Location**: `tests/e2e/`

**Browsers Tested**:
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)
- Mobile browsers (iOS Safari, Android Chrome)
- Tablets (iPad)

**Example**:
```typescript
test('should pass accessibility checks (WCAG AAA)', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

**Coverage**:
- WCAG AAA compliance
- ARIA labels for deaf accessibility
- Keyboard navigation
- Visual elements
- Responsive design
- Performance metrics

### 5. AI Service Validation

**Purpose**: Validate AI service speed and correctness

**Location**: `tests/unit/ai-validation.test.ts`

**Example**:
```typescript
describe('AI Service Validation', () => {
  it('should process requests quickly', async () => {
    const startTime = Date.now();
    await aiService.process(input);
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(200);
  });
});
```

**Coverage**:
- Speed benchmarks
- Correctness validation
- ASL recognition accuracy
- Transcription quality
- Caption generation
- Visual alert generation

## Configuration Files

### vitest.config.ts

Main configuration for Vitest test runner:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
});
```

### playwright.config.ts

Configuration for browser tests:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
```

## Writing Tests

### Best Practices

1. **Descriptive Test Names**
   ```typescript
   // Good
   it('should register a new service provider')
   
   // Bad
   it('test 1')
   ```

2. **Arrange-Act-Assert Pattern**
   ```typescript
   it('should match providers by criteria', async () => {
     // Arrange
     const criteria = { type: 'employment', minScore: 80 };
     
     // Act
     const matches = await apiBroker.matchProviders('user123', criteria);
     
     // Assert
     expect(matches.length).toBeGreaterThan(0);
   });
   ```

3. **Clean Up After Tests**
   ```typescript
   afterEach(() => {
     eventOrchestrator.clear();
   });
   ```

4. **Use Test Utilities**
   ```typescript
   const userId = testUtils.generateMockUserId();
   await testUtils.delay(50);
   ```

### Testing Accessibility Features

When testing deaf-specific features:

1. **Visual Elements**: Ensure all visual indicators are present
2. **ARIA Labels**: Check for proper ARIA attributes
3. **Sign Language**: Validate ASL recognition and glossing
4. **Captions**: Test caption generation quality
5. **Visual Alerts**: Verify visual notification systems

Example:
```typescript
test('should have proper ARIA labels for deaf accessibility', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on:
- Push to main, develop, or feature branches
- Pull requests
- Manual workflow dispatch

### Workflow Jobs

1. **unit-tests**: Run all unit tests
2. **integration-tests**: Run integration tests
3. **smoke-tests**: Run critical path smoke tests
4. **test-coverage**: Generate coverage reports
5. **browser-tests**: Run browser compatibility tests
6. **ai-validation**: Validate AI services
7. **test-report**: Generate comprehensive report

### Viewing Test Results

Test results are available in:
- GitHub Actions workflow summary
- Uploaded artifacts (coverage reports, test results)
- Pull request checks

## Coverage Goals

Minimum coverage targets:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

View coverage:
```bash
npm run test:coverage
open coverage/index.html
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in test configuration
   - Check for async operations without proper awaits

2. **Browser tests failing**
   - Run `npm run playwright:install`
   - Check if dev server is running

3. **Import errors**
   - Verify path aliases in vitest.config.ts
   - Check tsconfig.json configuration

4. **Flaky tests**
   - Add proper delays: `await testUtils.delay(50)`
   - Use `waitFor` utilities
   - Clear state between tests

### Debug Mode

```bash
# Vitest debug
npx vitest --inspect-brk

# Playwright debug
npx playwright test --debug
```

## Performance Benchmarks

Expected test execution times:

- **Unit tests**: < 5 seconds
- **Integration tests**: < 10 seconds
- **Smoke tests**: < 3 seconds
- **Browser tests** (per browser): < 2 minutes
- **Full suite**: < 5 minutes

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain coverage targets
4. Add accessibility tests for UI changes
5. Document new test utilities

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

## Support

For test-related questions:
- Create an issue in the repository
- Check existing test examples
- Review this documentation

---

**Last Updated**: December 2025
**Maintained By**: PinkSync Development Team
