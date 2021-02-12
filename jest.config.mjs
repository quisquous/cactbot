export default {
  'testEnvironment': 'node',
  'roots': [
    '<rootDir>/',
  ],
  'modulePathIgnorePatterns': [
    '<rootDir>/dist/',
    '<rootDir>/ui/test/',
    '/node_modules/',
  ],
  'testMatch': [
    '**/__tests__/**/*.[jt]s',
    '**/*.(spec|test).[jt]s',
  ],
  'transform': {
    '^.+\\.ts$': 'ts-jest',
  },
};
