/*
    For details on separating unit and integration tests in Jest, cf:
    - https://medium.com/coding-stones/separating-unit-and-integration-tests-in-jest-f6dd301f399c
*/
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
    runner: 'groups',
    // Exit the integration test suite as soon as any one test fails
    bail: true,
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    globalSetup: '<rootDir>/jest.int.globalSetup.js',
    globalTeardown: '<rootDir>/jest.int.globalTeardown.js',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
