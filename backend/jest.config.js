export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  // setupFilesAfterEnv: ['./jest.setup.ts'], // Optional: for global setup
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
