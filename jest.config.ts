export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage/tormes-backend',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'node',
  displayName: 'tormes-backend',
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)'],
  preset: './jest.preset.js',
};
