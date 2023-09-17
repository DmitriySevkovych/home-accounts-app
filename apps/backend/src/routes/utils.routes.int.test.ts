import type {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'
import { type Express } from 'express'
import supertest from 'supertest'

import { createServer } from '../server'

/*
    @group integration
    @group no-real-database
 */
describe('Utils router tests', () => {
    const apiBaseUrl = process.env['API_BASE_URL']
    const routerBaseUrl = `${apiBaseUrl}/utils`

    let server: Express
    beforeAll(async () => {
        server = await createServer()
    })

    it('transactionCategories returns transaction categories with expected fields', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/transactionCategories`)
            .expect(200)
            .then((res) => {
                expect(res.body).toBeInstanceOf(Array)
                res.body.forEach((item: TransactionCategory) => {
                    expect(item.category).toBeDefined()
                })
            })
    })

    it('taxCategories returns tax categories with expected fields', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/taxCategories`)
            .expect(200)
            .then((res) => {
                expect(res.body).toBeInstanceOf(Array)
                res.body.forEach((item: TaxCategory) => {
                    expect(item.category).toBeDefined()
                })
            })
    })

    it('paymentMethods returns payment methods with expected fields', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/paymentMethods`)
            .expect(200)
            .then((res) => {
                expect(res.body).toBeInstanceOf(Array)
                res.body.forEach((item: PaymentMethod) => {
                    expect(item.method).toBeDefined()
                })
            })
    })

    it('bankAccounts returns bank accounts with expected fields', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/bankAccounts`)
            .expect(200)
            .then((res) => {
                expect(res.body).toBeInstanceOf(Array)
                res.body.forEach((item: BankAccount) => {
                    expect(item.account).toBeDefined()
                    expect(item.bank).toBeDefined()
                    expect(item.annualFee).toBeDefined()
                    expect(item.category).toBeDefined()
                })
            })
    })

    it('facade for fetching all transaction-relevant constant returns all expected fields', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/constants/transactions`)
            .expect(200)
            .then((res) => {
                ;[
                    'transactionCategories',
                    'taxCategories',
                    'paymentMethods',
                    'bankAccounts',
                ].forEach((key) => expect(res.body).toHaveProperty(key))
            })
    })
})
