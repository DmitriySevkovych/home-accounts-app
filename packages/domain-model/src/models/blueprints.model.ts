import { PartialBy } from '../helpers/handy-types'
import { BlueprintValidationError } from './errors.model'
import { Transaction, TransactionContext } from './transactions.model'
import { PaymentFrequency } from './utilities.model'

export type BlueprintKey = Uppercase<string>

export type BlueprintTargetTable = `${TransactionContext}.${
    | 'expenses'
    | 'income'}`

type BlueprintDueDay =
    | number
    | 'LAST DAY'
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'

export class TransactionBlueprint {
    /* Attributes */
    // data from utils.blueprints table (db v1)
    key: BlueprintKey
    frequency!: PaymentFrequency
    dueDay!: BlueprintDueDay
    startDate!: Date
    expirationDate?: Date
    remindDate?: Date
    cancelationPeriod?: string
    lastUpdate!: Date
    // data from utils.blueprint_details table (db v1)
    transaction!: PartialBy<Transaction, 'date'>

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
    constructor(key: BlueprintKey) {
        this.key = key
    }
}

class TransactionBlueprintBuilder {
    private blueprint: TransactionBlueprint

    constructor(key: BlueprintKey) {
        this.blueprint = new TransactionBlueprint(key)
    }

    due = (
        frequency: PaymentFrequency,
        dueDay: BlueprintDueDay
    ): TransactionBlueprintBuilder => {
        this.blueprint.frequency = frequency
        this.blueprint.dueDay = dueDay
        return this
    }

    from = (startDate: Date): TransactionBlueprintBuilder => {
        this.blueprint.startDate = startDate
        return this
    }

    until = (expirationDate: Date): TransactionBlueprintBuilder => {
        this.blueprint.expirationDate = expirationDate
        return this
    }

    lastUpdatedOn = (lastUpdate: Date): TransactionBlueprintBuilder => {
        this.blueprint.lastUpdate = lastUpdate
        return this
    }

    withTransaction = (
        transaction: Transaction
    ): TransactionBlueprintBuilder => {
        this.blueprint.transaction = transaction
        return this
    }
    withCancelationPeriod = (
        cancelationPeriod: string
    ): TransactionBlueprintBuilder => {
        this.blueprint.cancelationPeriod = cancelationPeriod
        return this
    }

    withCancelationReminder = (
        remindDate: Date
    ): TransactionBlueprintBuilder => {
        this.blueprint.remindDate = remindDate
        return this
    }

    build = (): TransactionBlueprint => {
        return this.blueprint
    }

    validate = (): TransactionBlueprintBuilder => {
        const { key, transaction, frequency, dueDay, startDate, lastUpdate } =
            this.blueprint

        this._throwIfFalsy('key', key)
        this._throwIfFalsy('transaction', transaction)
        this._throwIfFalsy('frequency', frequency)
        this._throwIfFalsy('dueDay', dueDay)
        this._throwIfFalsy('startDate', startDate)
        this._throwIfFalsy('lastUpdate', lastUpdate)

        this._throwIfInvalidDueDay()
        return this
    }

    private _throwIfFalsy = (property: string, value: any): void => {
        // throw an error, if input is undefined, null, '', 0 and so on
        if (!value) {
            throw new BlueprintValidationError(
                `The transaction blueprint attribute '${property}' is falsy. Can not build a valid TransactionBlueprint object.`
            )
        }
    }

    private _throwIfInvalidDueDay = (): void => {
        const { dueDay } = this.blueprint

        if (Number.isInteger(dueDay)) {
            if ((dueDay as number) < 1 || (dueDay as number) > 31) {
                throw new BlueprintValidationError(
                    `The transaction blueprint has an invalid due day '${dueDay}'.`
                )
            }
        }

        if (
            ![
                'LAST DAY',
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
            ].includes(dueDay as string)
        ) {
            throw new BlueprintValidationError(
                `The transaction blueprint has an invalid due day '${dueDay}'.`
            )
        }
    }
}

export const createTransactionBlueprint = (
    key: BlueprintKey
): TransactionBlueprintBuilder => {
    return new TransactionBlueprintBuilder(key)
}
