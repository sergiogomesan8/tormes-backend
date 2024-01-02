export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage/tormes-backend',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'node',
  displayName: 'tormes-backend',
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)'],
  preset: './jest.preset.js',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.nx/',
    '/docker-data/',
    '/coverage/',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.nx/',
    '/docker-data/',
    '/coverage/',
  ],
};
