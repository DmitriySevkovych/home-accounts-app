import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'
import type { Pool } from 'pg'

export const getTransactionCategories = async (
    connectionPool: Pool
): Promise<TransactionCategory[]> => {
    const query = {
        text: `
        SELECT
            u.type, u.description, string_agg(u.allowed_type::text, ','::text) as allowed_types
        FROM (
            SELECT type, description, split_part(split_part(tableoid::regclass::text,'.',2),'_',1) AS allowed_type FROM utils.expense_types 
            UNION 
            SELECT type, description, split_part(split_part(tableoid::regclass::text,'.',2),'_',1) AS allowed_type FROM utils.income_types
        ) u
        GROUP BY u.type, u.description;`,
    }
    const queryResult = await connectionPool.query(query)
    const transactionCategories: TransactionCategory[] = queryResult.rows.map(
        (row) => ({
            category: row.type,
            description: row.description,
            allowedTypes: row.allowed_types.split(','),
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
