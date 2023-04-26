const { removeDatabaseContainer } = require('./src/db/dbTeardown')

module.exports = async () => {
    console.log('Global teardown for integration tests')
    await removeDatabaseContainer()
}
