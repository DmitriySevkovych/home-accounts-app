import supertest from 'supertest'
import { TransactionDate, dummyTransaction } from 'domain-model'
import { type Express } from 'express'

import { createServer } from '../server'
import { StubbedRepository } from '../db/stubs/stubbedRepository'

/*
    @group integration
    @group no-real-database
 */
describe('Transactions router tests', () => {
    const apiBaseUrl = process.env['API_BASE_URL']
    const routerBaseUrl = `${apiBaseUrl}/transactions`

    let server: Express
    beforeAll(async () => {
        server = await createServer()
    })

    it('POST should create a transaction and return with status 201 Created', async () => {
        await supertest(server)
            .post(routerBaseUrl)
            .send(dummyTransaction('FOOD', -3.45, TransactionDate.today()))
            .expect(201)
            .then((res) => {
                expect(res.body.message).toBe(
                    `Created new entry with id: ${StubbedRepository.CREATED_TRANSACTION_ID}`
                )
            })
    })

    it('POST with invalid data should return with status 400 Bad Request', async () => {
        await supertest(server)
            .post(routerBaseUrl)
            .send({ falseKey: 'Test' })
            .expect(400)
            .then((res) => {
                expect(res.body.message).toBe(
                    'Data sent in the request body is not a valid transaction'
                )
            })
    })
})
