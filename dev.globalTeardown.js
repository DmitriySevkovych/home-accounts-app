/*
    A NODE.js script for running setup tasks, not a module
 */

const { removeDatabaseContainer } = require('./src/db/dbTeardown.js')

removeDatabaseContainer().then((exitCode) => {
    process.exit(exitCode)
})
