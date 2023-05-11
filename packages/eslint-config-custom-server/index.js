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
    overrides: [
        {
            files: ['**/__tests__/**/*'],
            env: {
                jest: true,
            },
        },
    ],
}
