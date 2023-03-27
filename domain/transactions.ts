export type TransactionType = 'income' | 'expense'

export type TransactionBlueprint = {
    amount: number
}

export class Transaction implements TransactionBlueprint {
    constructor(public amount: number) {}

    type = (): TransactionType => {
        return this.amount > 0 ? 'income' : 'expense'
    }
}
