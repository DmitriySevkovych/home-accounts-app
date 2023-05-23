import supertest from 'supertest'
import { type Express } from 'express'

import { createServer } from './server'
import { RepositoryLocator } from './db/repositoryLocator'

/*
    @group integration
 */
describe('Express server tests', () => {
    let server: Express
    beforeAll(async () => {
        server = await createServer()
    })

    afterAll(RepositoryLocator.closeRepository)

    it('health check returns 200', async () => {
        await supertest(server)
            .get('/healthz')
            .expect(200)
            .then((res) => {
                expect(res.body.ok).toBe(true)
            })
    })

    it('transactions endpoint says hello', async () => {
        await supertest(server)
            .get('/transactions/Lidl')
            .expect(200)
            .then((res) => {
                expect(res.body.origin).toBe('Lidl')
            })
    })
})
