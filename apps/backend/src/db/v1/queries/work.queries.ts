import { ProjectInvoice, Transaction, dateFromString } from 'domain-model'
import type { Pool, PoolClient } from 'pg'

export const getProjectInvoices = async (
    connectionPool: Pool
): Promise<ProjectInvoice[]> => {
    const queryResult = await connectionPool.query(`
        SELECT 
            key, date, due_date, project, net_amount, vat, discount, status, comment
        FROM work.project_invoices`)
    return queryResult.rows.map((row) => ({
        key: row.key,
        issuanceDate: dateFromString(row.date),
        dueDate: dateFromString(row.due_date),
        project: row.project,
        netAmount: row.net_amount,
        vat: row.vat,
        discount: row.discount,
        status: row.status,
        comment: row.comment,
    }))
}

export const getInvoiceKeyForTransactionId = async (
    transactionId: number,
    connectionPool: Pool
): Promise<string | null> => {
    const query = {
        name: 'select-from-work.project_invoice_transactions-where-id',
        text: `SELECT invoice FROM work.project_invoice_transactions WHERE transaction_id = $1`,
        values: [transactionId],
    }
    const queryResult = await connectionPool.query(query)
    if (queryResult.rowCount === 1) {
        return queryResult.rows[0].invoice
    } else if (queryResult.rowCount === 0) {
        return null
    } else {
        throw new Error('Edge case not implemented yet')
    }
}

export const getVATForTransactionId = async (
    transactionId: number,
    connectionPool: Pool
): Promise<Required<Pick<Transaction, 'vat' | 'country'>>> => {
    const query = {
        name: 'select-from-work.transaction_vat-where-id',
        text: `SELECT vat, country FROM work.transaction_vat WHERE transaction_id = $1`,
        values: [transactionId],
    }
    const queryResult = await connectionPool.query(query)
    return {
        vat: parseFloat(queryResult.rows[0].vat),
        country: queryResult.rows[0].country,
    }
}

export const associateTransactionWithProjectInvoice = async (
    transactionId: number,
    invoiceKey: string,
    client: PoolClient
): Promise<void> => {
    const query = {
        name: 'insert-into-work.project_invoice_transactions',
        text: `
            INSERT INTO work.project_invoice_transactions (invoice, transaction_id) 
            VALUES ($1, $2)
            ON CONFLICT (transaction_id) DO UPDATE
            SET invoice = $1`,
        values: [invoiceKey, transactionId],
    }
    await client.query(query)
}

export type TransactionVATDAO = Required<
    Pick<Transaction, 'id' | 'vat' | 'country'>
>

export const insertTransactionVAT = async (
    vatDAO: TransactionVATDAO,
    client: PoolClient
): Promise<void> => {
    const { id, vat, country } = vatDAO
    const query = {
        name: 'insert-into-work.transaction_vat',
        text: `
            INSERT INTO work.transaction_vat (transaction_id, vat, country) 
            VALUES ($1, $2, $3)
            ON CONFLICT (transaction_id) DO UPDATE
            SET vat = $2, country = $3`,
        values: [id, vat, country],
    }
    await client.query(query)
}
