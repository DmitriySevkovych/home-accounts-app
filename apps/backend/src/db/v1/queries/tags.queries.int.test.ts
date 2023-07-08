import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import * as tagsQueries from './tags.queries'

describe('', () => {
    let connectionPool: Pool
    beforeAll(() => {
        const repository = new PostgresRepository()
        connectionPool = repository.connectionPool
    })
    afterAll(async () => {
        await connectionPool.end()
    })

    it('should return false if a tag does not yet exist in the database', async () => {
        // Arrange
        // Act
        const tagExists = await tagsQueries.tagExists(
            connectionPool,
            'unknownTag'
        )
        // Assert
        expect(tagExists).toBe(false)
    })

    it('should create a new tag in the database and return true when checking that it exists', async () => {
        // Arrange
        const tag = 'VacationSomewhere'

        // Act & Assert
        let tagExists = await tagsQueries.tagExists(connectionPool, tag)
        expect(tagExists).toBe(false)

        await tagsQueries.insertTag(connectionPool, tag)

        tagExists = await tagsQueries.tagExists(connectionPool, tag)
        expect(tagExists).toBe(true)
    })

    it('should throw an error when trying to create the same tag twice', async () => {
        // Arrange
        const tag = 'UniqueTag'
        await tagsQueries.insertTag(connectionPool, tag)
        // Act
        const secondInsertion = async () => {
            await tagsQueries.insertTag(connectionPool, tag)
        }
        // Assert
        await expect(secondInsertion).rejects.toThrowError()
    })
})
