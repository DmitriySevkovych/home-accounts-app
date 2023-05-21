import supertest from 'supertest'
import { createServer } from './server'
import { PostgresRepository } from './db/v1/postgresRepository'
import { RepositoryLocator } from './db/repositoryLocator'

/*
    @group integration
 */
describe('server', () => {
    beforeAll(async () => {
        const repository = new PostgresRepository()
        await repository.initialize()
        RepositoryLocator.setRepository(repository)
    })

    afterAll(RepositoryLocator.closeRepository)

    it('health check returns 200', async () => {
        await supertest(createServer())
            .get('/healthz')
            .expect(200)
            .then((res) => {
                expect(res.body.ok).toBe(true)
            })
    })

    it('transactions endpoint says hello', async () => {
        await supertest(createServer())
            .get('/transactions/Lidl')
            .expect(200)
            .then((res) => {
                expect(res.body.origin).toBe('Lidl')
            })
    })
})
