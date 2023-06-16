import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

const logger = getLogger('db')

export const getTransactionCategories = async (
    connectionPool: Pool
): Promise<TransactionCategory[]> => {
    const query = {
        text: 'SELECT type, description FROM utils.expense_types UNION SELECT type, description FROM utils.income_types',
    }
    const queryResult = await connectionPool.query(query)
    const transactionCategories: TransactionCategory[] = queryResult.rows.map(
        (row) => ({
            category: row.type,
            description: row.description,
        })
    )
    return transactionCategories
}

export const getTaxCategories = async (
    connectionPool: Pool
): Promise<TaxCategory[]> => {
    const queryResult = await connectionPool.query(
        'SELECT category, description FROM utils.tax_categories'
    )
    const taxCategories: TaxCategory[] = queryResult.rows.map((row) => ({
        category: row.category,
        description: row.description,
    }))
    return taxCategories
}

export const getPaymentMethods = async (
    connectionPool: Pool
): Promise<PaymentMethod[]> => {
    const queryResult = await connectionPool.query(
        'SELECT name, description FROM utils.payment_methods'
    )
    const paymentMethods: PaymentMethod[] = queryResult.rows.map((row) => ({
        method: row.name,
        description: row.description,
    }))
    return paymentMethods
}

export const getBankAccounts = async (
    connectionPool: Pool
): Promise<BankAccount[]> => {
    const queryResult = await connectionPool.query(
        'SELECT * FROM utils.bank_accounts'
    )
    const bankAccounts: BankAccount[] = queryResult.rows.map((row) => ({
        account: row.account,
        bank: row.bank,
        annualFee: row.annual_fee,
        category: row.type,
        owner: row.owner,
        iban: row.iban,
        purpose: row.purpose,
        openingDate: row.opening_date,
        closingDate: row.closing_date,
        contact: row.contact,
        comment: row.comment,
    }))
    return bankAccounts
}

export const tagExists = async (
    dbConnection: Pool | PoolClient,
    tag: string
): Promise<boolean> => {
    const query = {
        text: 'SELECT * FROM utils.tags WHERE tag=$1',
        values: [tag],
    }
    const queryResult = await dbConnection.query(query)
    return queryResult.rowCount === 1
}

export const insertTag = async (
    dbConnection: Pool | PoolClient,
    tag: string
): Promise<void> => {
    const query = {
        text: 'INSERT INTO utils.tags(tag) VALUES ($1)',
        values: [tag],
    }
    await dbConnection.query(query)
    logger.trace(`Inserted a new tag '${tag}' in utils.tags`)
}
