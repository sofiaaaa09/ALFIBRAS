module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleFileExtensions: ['js', 'json'],
};
