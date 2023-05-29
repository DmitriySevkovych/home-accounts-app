import { RepositoryLocator } from '../repositoryLocator'
import { PostgresRepository } from './postgresRepository'

/*
    @group integration
    @group with-real-database
 */
describe('Database setup and connection tests', () => {
    beforeAll(() => {
        RepositoryLocator.setRepository(new PostgresRepository())
    })
    afterAll(async () => {
        await RepositoryLocator.closeRepository()
    })

    it('should be able to ping the database', async () => {
        // Arrange
        const repository = RepositoryLocator.getRepository()
        // Act
        const ping = await repository.ping()
        // Assert
        expect(ping).toBe(true)
    })
})
