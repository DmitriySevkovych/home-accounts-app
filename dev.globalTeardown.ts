import { removeDatabaseContainer } from './backend/db/dbTeardown.js'

const exitCode = await removeDatabaseContainer()
process.exit(exitCode !== null ? exitCode : 1)
