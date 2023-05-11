import supertest from 'supertest'
import { createServer } from '../server'

/*
    @group integration
 */
describe('server', () => {
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
