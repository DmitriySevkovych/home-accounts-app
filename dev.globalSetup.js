/*
    A NODE.js script for running setup tasks, not a module
 */

const { startDatabaseContainer, runSqlStatements } = require('./db/dbSetup.js')

startDatabaseContainer().then((exitCode) => {
    runSqlStatements()
    process.exit(exitCode)
})

module.exports = {}
