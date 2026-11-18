import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@domain/(.*)\\.js$': '<rootDir>/src/domain/$1',
    '^@application/(.*)\\.js$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)\\.js$': '<rootDir>/src/infrastructure/$1',
    '^@main/(.*)\\.js$': '<rootDir>/src/main/$1',
    '^@tests/(.*)\\.js$': '<rootDir>/tests/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  testMatch: ['<rootDir>/tests/**/*.spec.ts', '<rootDir>/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/domain/**/*.ts',
    'src/application/use-cases/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/domain/repositories/**/*.ts',
    '!src/domain/providers/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
