
// Import Jest types
import '@testing-library/jest-dom';

// Define global Jest type for TypeScript
declare global {
  const jest: typeof import('@jest/globals')['jest'];
  const describe: typeof import('@jest/globals')['describe'];
  const expect: typeof import('@jest/globals')['expect'];
  const test: typeof import('@jest/globals')['test'];
  const beforeEach: typeof import('@jest/globals')['beforeEach'];
  const afterEach: typeof import('@jest/globals')['afterEach'];
}

// Mock global objects needed for tests
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn()
  }
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Add any other global mocks needed for tests here
