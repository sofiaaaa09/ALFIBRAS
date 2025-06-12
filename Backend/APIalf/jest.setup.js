module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  testTimeout: 10000,
  detectOpenHandles: true,
  clearMocks: true
};