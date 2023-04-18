import { RepositoryLocator } from './repositoryLocator'

/*
    @group integration
 */
describe('Database setup and connection tests', () => {
    it('should locate a repository with an initialized database connection', async () => {
        // Arrange
        // Act
        const repository = await RepositoryLocator.getRepository()
        // Assert
        expect(repository.ping()).toBe(true)
    })
})
