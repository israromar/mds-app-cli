module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/Components/**/*.{jsx, tsx}',
    '<rootDir>/src/App.{jsx, tsx}',
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/tests/__mocks__/empty-module.js',
  },
  preset: '@react-native/jest-preset',
  resolver: 'react-native-worklets/jest/resolver',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.test.ts?(x)', '**/*.test.js?(x)'],
  testPathIgnorePatterns: [String.raw`\.agent/`, '/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native-.*|@react-native|@react-native-community|@react-navigation|@invertase|ky|@gluestack-ui|@gluestack-style|@legendapp|@expo|expo))',
  ],
};
