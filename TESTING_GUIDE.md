# PinkSync Test Suite - Quick Reference

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific suites
npm run test:unit           # Unit tests
npm run test:integration    # Integration tests
npm run test:smoke          # Smoke tests
npm run test:e2e            # Browser tests

# Watch mode
npm run test:watch

# Interactive UI
npm run test:ui
```

## 📁 Test Structure

```
tests/
├── unit/              # Service-level tests (49 tests)
│   ├── event-orchestrator.test.ts
│   ├── api-broker.test.ts
│   └── ai-validation.test.ts
├── integration/       # Service communication tests (12 tests)
│   └── microservices.test.ts
├── smoke/             # Critical path tests (17 tests)
│   └── critical-paths.test.ts
├── e2e/               # Browser compatibility tests
│   └── browser-compatibility.test.ts
└── helpers/           # Test utilities
    └── test-utils.ts
```

## ✅ Test Coverage

Current test suite includes:

- **78 Total Tests**
- **Unit Tests**: 49 tests
- **Integration Tests**: 12 tests
- **Smoke Tests**: 17 tests
- **E2E Tests**: Browser compatibility suite

### What's Tested

#### Core Services
- ✅ Event Orchestrator (13 tests)
- ✅ API Broker (21 tests)
- ✅ AI Service Validation (15 tests)
- ✅ Microservices Integration (12 tests)

#### Functionality
- ✅ Event subscription and emission
- ✅ Provider registration and matching
- ✅ Service-to-service communication
- ✅ Error handling and resilience
- ✅ Performance benchmarks
- ✅ AI speed and correctness validation

#### Browser Compatibility
- ✅ WCAG AAA accessibility
- ✅ Cross-browser support (Chrome, Firefox, Safari)
- ✅ Mobile responsiveness
- ✅ Keyboard navigation
- ✅ Visual accessibility features

## 🎯 Test Commands

### Development
```bash
npm run test:watch      # Watch mode for development
npm run test:ui         # Interactive UI with Vitest
```

### CI/CD
```bash
npm run test:all        # All tests including E2E
npm run test:coverage   # Generate coverage report
```

### Browser Testing
```bash
npm run playwright:install  # Install browsers
npm run test:e2e           # Run browser tests
npm run test:e2e:ui        # Run with Playwright UI
npm run test:browser       # Browser compatibility only
```

### Documentation
```bash
npm run docs:generate   # Generate API docs with TypeDoc
npm run docs:serve      # Serve docs locally
```

## 📊 Coverage Goals

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

View coverage report:
```bash
npm run test:coverage
open coverage/index.html
```

## 🧪 Test Categories

### 1. Unit Tests (`tests/unit/`)
Fast, isolated tests for individual services and functions.

**Run**: `npm run test:unit`

### 2. Integration Tests (`tests/integration/`)
Tests for service-to-service communication and data flow.

**Run**: `npm run test:integration`

### 3. Smoke Tests (`tests/smoke/`)
Quick health checks for critical functionality.

**Run**: `npm run test:smoke`

### 4. E2E Tests (`tests/e2e/`)
Browser-based tests for UI and accessibility.

**Run**: `npm run test:e2e`

## 🎨 Accessibility Testing

All tests prioritize deaf accessibility:

- ✅ WCAG AAA compliance
- ✅ ARIA labels validation
- ✅ Visual alert systems
- ✅ Sign language features
- ✅ Caption generation
- ✅ Keyboard navigation

## 🤖 AI Service Validation

AI services are tested for:

- **Speed**: Response time < 200ms
- **Accuracy**: Confidence > 90%
- **ASL Recognition**: Cultural context preservation
- **Transcription**: High-quality captions
- **Visual Alerts**: Proper generation

## 🌐 Browser Support

Tested across:

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Edge
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)
- ✅ iPad

## 📚 Documentation

- [Test Suite Documentation](./docs/TEST_SUITE.md) - Comprehensive guide
- [Contributing Guide](./docs/CONTRIBUTING_TESTING.md) - How to contribute
- [API Documentation](./docs/api/) - Auto-generated (run `npm run docs:generate`)

## 🔧 Configuration Files

- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `typedoc.json` - Documentation generation
- `tests/setup.ts` - Global test setup

## 💡 Common Tasks

### Add a new test
```typescript
// tests/unit/my-feature.test.ts
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

### Debug a test
```bash
# Vitest debug
npx vitest --inspect-brk

# Playwright debug
npx playwright test --debug
```

### Update snapshots
```bash
npx vitest -u
```

## 🚨 CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

Workflows:
- `.github/workflows/test-automation.yml` - Main test workflow
- `.github/workflows/ci-cd.yml` - Full CI/CD pipeline

## 🎯 Best Practices

1. ✅ Write descriptive test names
2. ✅ Use arrange-act-assert pattern
3. ✅ Clean up after tests
4. ✅ Test edge cases
5. ✅ Mock external dependencies
6. ✅ Maintain coverage targets
7. ✅ Include accessibility tests
8. ✅ Validate AI performance

## 🐛 Troubleshooting

### Tests timeout
- Increase timeout in config
- Add proper `await` statements
- Use `testUtils.delay()` for timing

### Import errors
- Check path aliases in `vitest.config.ts`
- Verify `tsconfig.json` paths

### Browser tests fail
- Run `npm run playwright:install`
- Check if dev server is running

### Flaky tests
- Add proper delays
- Use `waitFor` utilities
- Clear state between tests

## 📈 Performance Benchmarks

Expected execution times:

- Unit tests: < 5s
- Integration tests: < 10s
- Smoke tests: < 3s
- Full suite: < 5min

## 🤝 Contributing

See [CONTRIBUTING_TESTING.md](./docs/CONTRIBUTING_TESTING.md) for detailed guidelines.

## 📞 Support

- GitHub Issues
- GitHub Discussions
- Documentation

---

**Happy Testing! 🧪**

All tests prioritize deaf accessibility and ensure reliable, high-quality software for the deaf community.
