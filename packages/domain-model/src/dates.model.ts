import { DateTime } from 'luxon'
import { TransactionValidationError } from './errors.model'

/* Resources:
    - https://moment.github.io/luxon/index.html
    - https://moment.github.io/luxon/demo/global.html
 */
export type SerializedTransactionDate = {
    datetime: string
}

export class TransactionDate {
    // https://moment.github.io/luxon/index.html#/formatting
    static format = 'yyyy-MM-dd'

    static today = (): TransactionDate => {
        return new TransactionDate(DateTime.now())
    }

    static fromString = (
        dateString: string,
        format: string = TransactionDate.format
    ): TransactionDate => {
        return new TransactionDate(DateTime.fromFormat(dateString, format))
    }

    static deserialize = (date: SerializedTransactionDate): TransactionDate => {
        if (!(date instanceof Object && date.datetime)) {
            throw new TransactionValidationError(
                'The Trasaction date could not be deserialized: Transaction.date.datetime is missing.'
            )
        }
        return new TransactionDate(DateTime.fromISO(date.datetime))
    }

    static fromDatabase = (dateString: string): TransactionDate => {
        return new TransactionDate(DateTime.fromISO(dateString))
    }

    static formatDateColumn = (column: string): string => {
        return `TO_CHAR(${column}::date, 'yyyy-mm-dd')`
    }

    private datetime: DateTime

    private constructor(datetime: DateTime) {
        this.datetime = datetime
    }

    toString = (): string => {
        return this.datetime.toFormat(TransactionDate.format)
    }
}
