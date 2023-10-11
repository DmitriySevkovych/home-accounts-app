import { DateTime } from 'luxon'

import { TransactionValidationError } from './errors.model'

/* Resources:
    - https://moment.github.io/luxon/index.html
    - https://moment.github.io/luxon/demo/global.html
 */
export type SerializedTransactionDate = {
    datetime: string
}

export class HomeAppDate {
    private datetime: DateTime

    private constructor(datetime: DateTime) {
        this.datetime = datetime
    }

    toString = (): string => {
        return this.datetime.toFormat(HomeAppDate.format)
    }

    toWords = (): string => {
        return this.datetime.toFormat('dd LLL yyyy')
    }

    /** Static helper methods */

    // https://moment.github.io/luxon/index.html#/formatting
    static format = 'yyyy-MM-dd'

    static today = (): HomeAppDate => {
        return new HomeAppDate(DateTime.now())
    }

    static fromISO = (isoDateString: string): HomeAppDate => {
        return new HomeAppDate(DateTime.fromISO(isoDateString))
    }

    static fromJsDate(date: Date) {
        return HomeAppDate.fromISO(date.toISOString())
    }

    static fromString = (
        dateString: string,
        format: string = HomeAppDate.format
    ): HomeAppDate => {
        return new HomeAppDate(DateTime.fromFormat(dateString, format))
    }

    static deserialize = (date: SerializedTransactionDate): HomeAppDate => {
        if (!(date instanceof Object && date.datetime)) {
            throw new TransactionValidationError(
                'The Trasaction date could not be deserialized: Transaction.date.datetime is missing.'
            )
        }
        return new HomeAppDate(DateTime.fromISO(date.datetime))
    }

    static fromDatabase = (dateString: string): HomeAppDate => {
        return HomeAppDate.fromISO(dateString)
    }

    static formatDateColumn = (column: string): string => {
        return `TO_CHAR(${column}::date, 'yyyy-mm-dd')`
    }
}
