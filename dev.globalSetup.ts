import {
    startDatabaseContainer,
    runSqlStatements,
} from './backend/db/dbSetup.js'

const exitCode = await startDatabaseContainer()
runSqlStatements()
process.exit(exitCode !== null ? exitCode : 1)
