import {
    Transaction,
    TransactionValidationError,
    deserializeTransaction,
    dummyTransaction,
} from 'domain-model'
import { type Express } from 'express'
import supertest from 'supertest'

import { StubbedRepository } from '../db/stubs/stubbedRepository'
import { createServer } from '../server'

type PostTransactionMultiformRequestBody = {
    transaction: string
    file?: Express.Multer.File
}

const asMultiform = (
    transaction: Transaction | object,
    transactionReceipt?: Express.Multer.File
) => {
    const requestBody: PostTransactionMultiformRequestBody = {
        transaction: JSON.stringify(transaction),
    }
    if (transactionReceipt) requestBody.file = transactionReceipt

    return requestBody
}

/*
    @group integration
    @group no-real-database
 */
describe('Transactions router tests', () => {
    const apiBaseUrl = process.env.API_BASE_URL
    const routerBaseUrl = `${apiBaseUrl}/transactions`

    let server: Express
    beforeAll(async () => {
        server = await createServer()
    })

    it('POST should create a transaction and return with status 201 Created', async () => {
        await supertest(server)
            .post(routerBaseUrl)
            .send(asMultiform(dummyTransaction('FOOD', -3.45, new Date())))
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
            .send(asMultiform({ falseKey: 'Test' }))
            .expect(400)
            .then((res) => {
                expect(res.body.message).toBe(
                    'Data sent in the request body is not a valid transaction.'
                )
            })
    })

    it.each`
        context
        ${'home'}
        ${'work'}
        ${'investments'}
    `(
        "GET with context='$context' should return an array of Transaction objects",
        async ({ context }) => {
            await supertest(server)
                .get(routerBaseUrl)
                .query({ limit: 5, context: context })
                .expect(200)
                .then((res) => {
                    expect(res.body.length).toBe(5)

                    res.body.forEach((element: object) => {
                        expect(() =>
                            deserializeTransaction(element)
                        ).not.toThrow(TransactionValidationError)
                    })
                })
        }
    )

    it.each`
        context
        ${'madeUpContext'}
        ${undefined}
    `(
        'GET with unknown or missing context should return a bad request',
        async ({ context }) => {
            await supertest(server)
                .get(routerBaseUrl)
                .query({ limit: 5, context: context })
                .expect(400)
                .then((res) => {
                    expect(res.body.message).toBe(
                        `The request contains an unknown context as query parameter (context=${context}).`
                    )
                })
        }
    )

    it('GET with a valid id should return a Transaction object', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/1`)
            .expect(200)
            .then((res) => {
                const transaction = deserializeTransaction(res.body)
                expect(transaction.id).toBe(1)
                expect(transaction.category).toBe('FEE') // set in the stubbedRepository
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
                const { message, cause } = res.body
                expect(message).toBe('No record found in the database.')
                expect(cause).toBe(
                    'The database does not hold a transaction with id=404.'
                )
            })
    })

    it('GET /origins should return a transactionOrigins array of strings', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/origins`)
            .expect(200)
            .then((res) => {
                const { transactionOrigins } = res.body
                expect(Array.isArray(transactionOrigins)).toBe(true)
                expect(typeof transactionOrigins[0]).toBe('string')
            })
    })
})
