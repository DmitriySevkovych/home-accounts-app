import { TransactionForm } from 'domain-model'
import { create } from 'zustand'

type TransactionCorrection = {
    transactionToCorrect: TransactionForm | null
    setTransactionToCorrect: (_transaction: TransactionForm) => void
    clearTransactionToCorrect: () => void
}

export const useTransactionCorrectionStore = create<TransactionCorrection>(
    (set) => ({
        transactionToCorrect: null,
        setTransactionToCorrect: (transaction) =>
            set(() => ({ transactionToCorrect: transaction })),
        clearTransactionToCorrect: () => set({ transactionToCorrect: null }),
    })
)
