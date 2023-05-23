import supertest from 'supertest'
import { type Express } from 'express'

import { createServer } from '../server'
import { RepositoryLocator } from '../db/repositoryLocator'

/*
    @group integration
 */
describe('Utils router tests', () => {
    const apiBaseUrl = process.env['API_BASE_URL']
    const routerBaseUrl = `${apiBaseUrl}/utils`

    let server: Express
    beforeAll(async () => {
        server = await createServer()
    })

    afterAll(RepositoryLocator.closeRepository)

    it('transactionCategories returns expected income and expense categories', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/transactionCategories`)
            .expect(200)
            .then((res) => {
                const categories = res.body.map((item: any) => item.category)
                expect(categories).toEqual(
                    expect.arrayContaining(['FOOD', 'PRIVATE_SALE'])
                )
            })
    })
})
