import { RepositoryLocator } from '../repositoryLocator'
import { PostgresRepository } from './postgresRepository'

/*
    @group integration
    @group with-real-database
 */
describe('Database setup and connection tests', () => {
    beforeAll(async () => {
        const repository = new PostgresRepository()
        await repository.initialize()
        RepositoryLocator.setRepository(repository)
    })
    afterAll(async () => {
        await RepositoryLocator.closeRepository()
    })

    it('should locate a repository with an initialized database connection', async () => {
        // Arrange
        // Act
        const repository = await RepositoryLocator.getRepository()
        // Assert
        expect(repository.ping()).toBe(true)
    })
})
