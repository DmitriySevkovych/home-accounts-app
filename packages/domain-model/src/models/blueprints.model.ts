import { Transaction, TransactionContext } from './transactions.model'
import { PaymentFrequency } from './utilities.model'

export type BlueprintKey = Uppercase<string>

export type BlueprintTargetTable = `${TransactionContext}.${
    | 'expenses'
    | 'income'}`

export class TransactionBlueprint {
    /* Attributes */
    // data from utils.blueprints table (db v1)
    key: BlueprintKey
    frequency!: PaymentFrequency
    startDate!: Date
    dueDay!:
        | number
        | 'LAST DAY'
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
    expirationDate?: Date
    remindDate?: Date
    cancelationPeriod?: string
    lastUpdate!: Date
    // data from utils.blueprint_details table (db v1)
    transaction: Transaction

    /* Data derived from attributes */
    isActive = (): boolean => {
        const today = new Date()
        const hasStarted = this.startDate <= today
        const hasNotYetExpired =
            !this.expirationDate || this.expirationDate >= today
        return hasStarted && hasNotYetExpired
    }

    targetTable = (): BlueprintTargetTable => {
        const schema = this.transaction.context
        // TODO technical debt: 'expense' vs 'expenses'...
        const table =
            this.transaction.type !== 'expense'
                ? this.transaction.type
                : 'expenses'
        return `${schema}.${table}`
    }

    /* Constructors */
    constructor(key: BlueprintKey, transaction: Transaction) {
        this.key = key
        this.transaction = transaction
    }
}
