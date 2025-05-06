import { getLogger } from 'logger'
import React from 'react'

import useTransactionForm from '../../components/hooks/useTransactionForm'
import useTransactionFormSubmitHandler from '../../components/hooks/useTransactionFormSubmitHandler'
import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/pages/TransactionFormPage'
import { useTransactionCorrectionStore } from '../../stores/correction.store'

// Type of arguments for export function (from getServerSideProps)
type TransactionCorrectionPageProps = {
    constants: TransactionFormConstants
}

const TransactionCorrectionPage = ({
    constants,
}: TransactionCorrectionPageProps) => {
    const correctionStore = useTransactionCorrectionStore()

    const { form } = useTransactionForm({
        ...correctionStore.transactionToCorrect,
    })

    const { onSubmit } = useTransactionFormSubmitHandler('createCorrection')

    return (
        <TransactionFormPage
            heading="Create Correction"
            form={form}
            constants={constants}
            onSubmit={onSubmit}
            submitLabel="Create Correction"
        />
    )
}

export const getServerSideProps = async () => {
    const logger = getLogger()
    try {
        return {
            props: {
                constants: await fetchTransactionConstants(),
            },
        }
    } catch (err) {
        logger.error(err)
    }
}

export default TransactionCorrectionPage
