import {
    HomeAppDate,
    TransactionValidationError,
    deserializeTransaction,
    dummyTransaction,
} from 'domain-model'
import { type Express } from 'express'
import supertest from 'supertest'

import { StubbedRepository } from '../db/stubs/stubbedRepository'
import { createServer } from '../server'

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
            .send(dummyTransaction('FOOD', -3.45, HomeAppDate.today()))
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
                    'Data sent in the request body is not a valid transaction.'
                )
            })
    })

    it('GET should return an array of Transaction objects', async () => {
        await supertest(server)
            .get(routerBaseUrl)
            .query({ limit: 5 })
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(5)

                res.body.forEach((element: object) => {
                    expect(() => deserializeTransaction(element)).not.toThrow(
                        TransactionValidationError
                    )
                })
            })
    })

    it('GET with a valid id should return a Transaction object', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/1`)
            .expect(200)
            .then((res) => {
                const transaction = deserializeTransaction(res.body)
                expect(transaction.id).toBe(1)
                expect(transaction.category).toBe('FOOD') // set in the stubbedRepository
                expect(transaction.amount).toBe(-33.33) // set in the stubbedRepository
            })
    })

    it('GET with malformed id should return with status 400 Bad Request', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/abc`)
            .expect(400)
            .then((res) => {
                expect(res.body.message).toBe(
                    'The request contains a malformed id in path (id=NaN).'
                )
            })
    })

    it('GET with unknown id should return with status 404 Not Found', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/404`)
            .expect(404)
            .then((res) => {
                expect(res.body.message).toBe(
                    'The database does not hold a transaction with id=404.'
                )
            })
    })
})
