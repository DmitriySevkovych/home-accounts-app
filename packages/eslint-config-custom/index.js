module.exports = {
    extends: ['eslint:recommended', 'turbo', 'prettier'],
    env: {
        node: true,
        es6: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
    overrides: [
        {
            files: ['**/__tests__/**/*', '**/*.test.ts'],
            env: {
                jest: true,
            },
        },
    ],
}
