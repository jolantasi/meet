import '@testing-library/jest-dom';
import 'whatwg-fetch';

// ------------------------------------------------------------
// 🔇 Suppress noisy or irrelevant console output during tests
// ------------------------------------------------------------

// Messages to ignore (React act warnings, expected errors, etc.)
const MESSAGES_TO_IGNORE = [
  'When testing, code that causes React state updates should be wrapped into act(...):',
  'The above error occurred',
];

// Keep the original console.error
const originalError = console.error.bind(console.error);

// Only silence specific unwanted warnings
console.error = (...args) => {
  const ignoreMessage = MESSAGES_TO_IGNORE.find((msg) =>
    args.toString().includes(msg)
  );
  if (!ignoreMessage) originalError(...args);
};

// Mute repetitive logs and warnings from app components
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// ------------------------------------------------------------
// 🧩 Mock ResizeObserver for Recharts and responsive components
// ------------------------------------------------------------
if (typeof window !== 'undefined') {
  const { ResizeObserver } = window;

  beforeEach(() => {
    // @ts-ignore
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.restoreAllMocks();
  });
}

// Increase timeout for async tests
jest.setTimeout(30000);
