import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/dist/**',
        '**/.next/**',
        'coverage/**',
      ],
      include: [
        'services/**/*.ts',
        'lib/**/*.ts',
        'components/**/*.tsx',
        'app/**/*.tsx',
      ],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
      'services/**/*.test.ts',
      'lib/**/*.test.ts',
    ],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/services': path.resolve(__dirname, './services'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/components': path.resolve(__dirname, './components'),
      '@/types': path.resolve(__dirname, './types'),
    },
  },
});
