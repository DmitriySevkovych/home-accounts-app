import supertest from 'supertest'
import { type Express } from 'express'

import { createServer } from '../server'
import { RepositoryLocator } from '../db/repositoryLocator'
import type {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'

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
                const categories: string[] = res.body.map(
                    (item: TransactionCategory) => item.category
                )
                expect(categories).toEqual(
                    expect.arrayContaining(['FOOD', 'PRIVATE_SALE'])
                )
            })
    })

    it('taxCategories returns expected tax categories', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/taxCategories`)
            .expect(200)
            .then((res) => {
                const categories: string[] = res.body.map(
                    (item: TaxCategory) => item.category
                )
                expect(categories).toEqual(
                    expect.arrayContaining([
                        'EINKOMMENSTEUER',
                        'WERBUNGSKOSTEN',
                    ])
                )
            })
    })

    it('paymentMethods returns expected payment methods', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/paymentMethods`)
            .expect(200)
            .then((res) => {
                const methods: string[] = res.body.map(
                    (item: PaymentMethod) => item.method
                )
                expect(methods).toEqual(
                    expect.arrayContaining(['TRANSFER', 'CASH'])
                )
            })
    })

    it('bankAccounts returns bank accounts with expected fields', async () => {
        await supertest(server)
            .get(`${routerBaseUrl}/bankAccounts`)
            .expect(200)
            .then((res) => {
                res.body.forEach((item: BankAccount) => {
                    expect(item.account).toBeDefined()
                    expect(item.bank).toBeDefined()
                    expect(item.annualFee).toBeDefined()
                    expect(item.category).toBeDefined()
                })
            })
    })
})
