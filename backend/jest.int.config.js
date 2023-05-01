/*
    For details on separating unit and integration tests in Jest, cf:
    - https://medium.com/coding-stones/separating-unit-and-integration-tests-in-jest-f6dd301f399c
*/

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
    runner: 'groups',
    // Exit the integration test suite as soon as any one test fails
    bail: true,
    // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'node',
    preset: 'ts-jest',
    globalSetup: '<rootDir>/jest.int.globalSetup.js',
    globalTeardown: '<rootDir>/jest.int.globalTeardown.js',
}

export default customJestConfig
