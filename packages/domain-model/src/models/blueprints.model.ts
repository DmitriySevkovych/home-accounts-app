import { PartialBy } from '../helpers/handy-types'
import {
    DAYS,
    DateCheck,
    getMonthDifference,
    getNextDay,
    getNextWorkday,
    getNumberOfDaysInMonth,
} from './dates.model'
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

    /* Constructors */
    constructor(key: BlueprintKey) {
        this.key = key
    }

    /* Public methods */
    getDatesWhenTransactionIsDue = (): Date[] => {
        const dates = []
        let checkDate = getNextDay(this.lastUpdate)
        const { today, check } = DateCheck
        while (today().isNotBefore(checkDate, 'day-wise')) {
            if (
                this.expirationDate &&
                check(checkDate).isAfter(this.expirationDate, 'day-wise')
            )
                break

            if (this._isDueOn(checkDate)) {
                dates.push(getNextWorkday(checkDate))
            }
            checkDate = getNextDay(checkDate)
        }
        return dates
    }

    /* Private helper methods */
    private _isDueOn = (checkDate: Date): boolean => {
        const { frequency, dueDay, startDate } = this

        if (DateCheck.check(checkDate).isBefore(startDate, 'day-wise')) {
            return false
        }

        switch (frequency) {
            case 'ONE-TIME': {
                return DateCheck.check(startDate).isSameDayAs(checkDate)
            }
            case 'WEEKLY': {
                const weekday = DAYS.find((day) => day.name === dueDay)
                return checkDate.getUTCDay() === weekday?.number
            }
            case 'MONTHLY': {
                return this._checkDay(checkDate)
            }
            case 'QUARTERLY':
                return (
                    this._checkDay(checkDate) && this._checkMonth(checkDate, 3)
                )
            case 'SEMI-ANNUALLY':
                return (
                    this._checkDay(checkDate) && this._checkMonth(checkDate, 6)
                )
            case 'ANNUALLY':
                return (
                    this._checkDay(checkDate) && this._checkMonth(checkDate, 12)
                )
            default:
                throw new Error()
        }
    }

    private _checkDay = (date: Date): boolean => {
        const { dueDay } = this
        const daysInMonth = getNumberOfDaysInMonth(
            date.getUTCFullYear(),
            date.getUTCMonth()
        )

        if (dueDay === 'LAST DAY') {
            return date.getUTCDate() === daysInMonth
        }
        if (Number.isInteger(parseInt(dueDay as any))) {
            return (
                date.getUTCDate() ===
                Math.min(parseInt(dueDay as any), daysInMonth)
            )
        }
        // Should never reach here
        throw new Error()
    }

    private _checkMonth = (date: Date, step: number): boolean => {
        const { startDate } = this
        return getMonthDifference(startDate, date, 'floor') % step === 0
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
        if (Number.parseInt(dueDay as string)) {
            this.blueprint.dueDay = Number.parseInt(dueDay as string)
        }
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
                    `The transaction blueprint has an invalid due day ${dueDay}.`
                )
            }
        } else if (
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
