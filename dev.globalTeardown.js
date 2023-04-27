import { removeDatabaseContainer } from './src/db/dbTeardown.js'

const exitCode = await removeDatabaseContainer()
process.exit(exitCode)
