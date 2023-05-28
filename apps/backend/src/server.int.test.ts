import supertest from 'supertest'
import { type Express } from 'express'

import { createServer } from './server'

/*
    @group integration
    @group no-real-database
 */
describe('Express server tests', () => {
    let server: Express
    beforeAll(async () => {
        server = await createServer()
    })

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
