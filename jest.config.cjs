module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm|module-that-needs-to-be-transformed)/)'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
}; 