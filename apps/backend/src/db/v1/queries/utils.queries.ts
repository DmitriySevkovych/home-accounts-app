import {
    BankAccount,
    BlueprintKey,
    PaymentMethod,
    TaxCategory,
    TransactionBlueprint,
    TransactionCategory,
    createTransaction,
    createTransactionBlueprint,
    dateFromString,
    formatDate,
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
        `SELECT
            account, bank, annual_fee, type, owner, iban, purpose, contact, comment, opening_date, closing_date
        FROM utils.bank_accounts`
    )
    const bankAccounts: BankAccount[] = queryResult.rows.map((row) => ({
        account: row.account,
        bank: row.bank,
        annualFee: row.annual_fee,
        category: row.type,
        owner: row.owner,
        iban: row.iban,
        purpose: row.purpose,
        contact: row.contact,
        comment: row.comment,
        openingDate: row.opening_date
            ? dateFromString(row.opening_date)
            : undefined,
        closingDate: row.closing_date
            ? dateFromString(row.closing_date)
            : undefined,
    }))
    return bankAccounts
}

export const getActiveBlueprints = async (
    connectionPool: Pool
): Promise<TransactionBlueprint[]> => {
    const query = {
        name: `select-from-utils.blueprints`,
        text: `
            SELECT 
                b.key, b.frequency, b.start_date, b.due_day, b.expiration_date, b.remind_date, b.cancelation_period, b.last_update,
                btype.schema, btype.table,
                bd.type as category, bd.origin, bd.description, bd.additional_data,
                bt.amount, bt.source_bank_account, bt.target_bank_account, bt.currency, bt.tax_category, bt.payment_method, bt.comment
            FROM utils.blueprints b
            JOIN utils.blueprint_types btype on b.type = btype.type
            JOIN utils.blueprint_details bd on b.key = bd.blueprint_key
            JOIN utils.blueprint_transactions bt on b.key = bt.blueprint_key
            WHERE b.expiration_date is null OR b.expiration_date > b.last_update;`,
    }
    const queryResult = await connectionPool.query(query)

    // TODO remove connectionPool argument once the issue with the tags is corrected
    const blueprintsFromRows = queryResult.rows.map((row) =>
        _toTransactionBlueprint(row, connectionPool)
    )

    // TODO remove Promise.all once the issue with the tags is corrected -> mapping will be synchronous
    return await Promise.all(blueprintsFromRows)
}

export const markBlueprintAsProcessed = async (
    connectionPool: Pool,
    blueprintKey: BlueprintKey,
    dateProcessed: Date
): Promise<void> => {
    const query = {
        name: `update-utils.blueprints-set-last_update`,
        text: `UPDATE utils.blueprints SET last_update = $1 WHERE key = $2;`,
        values: [formatDate(dateProcessed), blueprintKey],
    }
    await connectionPool.query(query)
}

const _getBlueprintTags = async (
    key: BlueprintKey,
    connectionPool: Pool
): Promise<string[]> => {
    const query = {
        name: 'select-tag-from-utils.blueprint_tags',
        text: `SELECT tag FROM utils.blueprint_tags where blueprint_key = $1`,
        values: [key],
    }
    const queryResult = await connectionPool.query(query)
    return queryResult.rows.map((row) => row.tag)
}

const _toTransactionBlueprint = async (
    row: any,
    connectionPool: Pool
): Promise<TransactionBlueprint> => {
    const {
        key,
        frequency,
        start_date: startDate,
        due_day: dueDay,
        expiration_date: expirationDate,
        remind_date: remindDate,
        cancelation_period: cancelationPeriod,
        last_update: lastUpdate,
        schema,
        category,
        origin,
        description,
        amount,
        currency,
        source_bank_account: sourceBankAccount,
        target_bank_account: targetBankAccount,
        payment_method: paymentMethod,
        tax_category: taxCategory,
        comment,
    } = row

    const transactionBuilder = createTransaction()
        .about(category, origin, description)
        .withContext(schema)
        .withAmount(parseFloat(amount))
        .withType(amount > 0 ? 'income' : 'expense')
        .withCurrency(currency, 1)
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withComment(comment)
        .withTaxCategory(taxCategory)
        .withAgent(process.env.PROCESS_BLUEPRINTS_AGENT!)

    if (row.additional_data) {
        if (schema === 'work') {
            if (amount > 0) {
                const { invoice_key } = row.additional_data
                transactionBuilder.withInvoice(invoice_key)
            } else {
                const { vat, country } = row.additional_data
                transactionBuilder.withVAT(vat, country)
            }
        } else if (schema === 'investments') {
            const { investment } = row.additional_data
            transactionBuilder.withInvestment(investment)
        }
    }

    const tags = await _getBlueprintTags(key, connectionPool)
    transactionBuilder.addTags(tags)

    const transaction = transactionBuilder.validateForBlueprint().build()

    const blueprint = createTransactionBlueprint(key)
        .withTransaction(transaction)
        .due(frequency, dueDay)
        .from(startDate)
        .until(expirationDate)
        .lastUpdatedOn(lastUpdate)
        .withCancelationPeriod(cancelationPeriod)
        .withCancelationReminder(remindDate)
        .validate()
        .build()

    return blueprint
}
