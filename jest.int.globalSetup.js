import { startDatabaseContainer, runSqlStatements } from './src/db/dbSetup.js'

export default async () => {
    console.log('Global setup for integration tests')
    await startDatabaseContainer()
    runSqlStatements()
}
