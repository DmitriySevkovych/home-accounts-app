const { startDatabaseContainer, runSqlStatements } = require('./db/dbSetup')

module.exports = async () => {
    console.log('Global setup for integration tests')
    await startDatabaseContainer()
    runSqlStatements()
}
