import { startDatabaseContainer, runSqlStatements } from './src/db/dbSetup.js'

const exitCode = await startDatabaseContainer()
runSqlStatements()
process.exit(exitCode)
