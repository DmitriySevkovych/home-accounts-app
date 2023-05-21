import supertest from 'supertest'
import { type Express } from 'express'

import { createServer } from '../server'

/*
    @group integration
 */
describe('Utils router tests', () => {
    let server: Express
    beforeEach(async () => {
        server = await createServer()
    })

    it('transactionCategories returns expected income and expense categories', async () => {
        await supertest(server)
            .get('/api/v1/utils/transactionCategories')
            .expect(200)
            .then((res) => {
                const categories = res.body.map((item: any) => item.category)
                expect(categories).toEqual(
                    expect.arrayContaining(['FOOD', 'PRIVATE_SALE'])
                )
            })
    })
})
