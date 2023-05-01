/*
    For details on separating unit and integration tests in Jest, cf:
    - https://medium.com/coding-stones/separating-unit-and-integration-tests-in-jest-f6dd301f399c
*/
/** @type {import('jest').Config} */
const customJestConfig = {
    runner: 'groups',
    // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'node',
    rootDir: 'src',
    preset: 'ts-jest',
}

export default customJestConfig
