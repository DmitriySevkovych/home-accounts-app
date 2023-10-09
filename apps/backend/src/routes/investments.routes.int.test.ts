import { type Express } from 'express'
import supertest from 'supertest'

import { createServer } from '../server'

/*
    @group integration
    @group no-real-database
 */
describe('Utils router tests', () => {
    const routerBaseUrl = `${process.env['API_BASE_URL']}/investments`

    let server: Express
    beforeAll(async () => {
        server = await createServer()
    })

    it('should GET all known investments', async () => {
        await supertest(server)
            .get(routerBaseUrl)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty('investments')
                expect(res.body.investments).not.toBeFalsy()
            })
    })
})
