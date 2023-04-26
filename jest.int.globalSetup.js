const { startDatabaseContainer, runSqlStatements } = require('./src/db/dbSetup')

module.exports = async () => {
    console.log('Global setup for integration tests')
    await startDatabaseContainer()
    runSqlStatements()
}
