module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // 👇 Allow Recharts and similar modern packages to be transformed
  transformIgnorePatterns: ['/node_modules/(?!recharts)/'],

  // 👇 Mock CSS and static file imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // 👇 Run test setup (RTL utilities, etc.)
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // 👇 Mock import.meta.env for Vite projects
  setupFiles: ['<rootDir>/jest.setup.js'],
};
