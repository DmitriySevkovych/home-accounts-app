const prettierConfig = require('../../.prettierrc.js')

module.exports = {
    ...prettierConfig,
    plugins: [...prettierConfig.plugins, 'prettier-plugin-tailwindcss'],
}
