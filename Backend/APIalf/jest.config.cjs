module.exports = {
  testEnvironment: 'node',
 maxWorkers: 1,  
  detectOpenHandles: true,
  forceExit: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleFileExtensions: ['js', 'json'],
};
