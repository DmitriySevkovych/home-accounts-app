import { removeDatabaseContainer } from './src/db/dbTeardown.js'

export default async () => {
    console.log('Global teardown for integration tests')
    await removeDatabaseContainer()
}
