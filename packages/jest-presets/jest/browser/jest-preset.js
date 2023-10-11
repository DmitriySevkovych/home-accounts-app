const basePreset = require('../base/jest-preset')

module.exports = {
    ...basePreset,
    testEnvironment: "jsdom",
}
