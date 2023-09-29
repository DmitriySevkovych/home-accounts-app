const prettierConfig = require('prettier-config-custom')

module.exports = {
    ...prettierConfig,
    plugins: [...prettierConfig.plugins, 'prettier-plugin-tailwindcss'],
}
