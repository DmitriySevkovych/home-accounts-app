import React from 'react'

import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/TransactionFormPage'
import useNewTransactionSubmitHandler from '../../components/hooks/useNewTransactionSubmitHandler'
import useTransactionForm from '../../components/hooks/useTransactionForm'
import { TransactionForm } from '../../helpers/zod-form-schemas'

// Type of arguments for export function (from getServerSideProps)
type NewTransactionPageProps = {
    constants: TransactionFormConstants
}

const NewTransactionPage = ({ constants }: NewTransactionPageProps) => {
    const formDefaultValues: Partial<TransactionForm> = {
        type: 'expense',
        context: 'home',
        category: 'FOOD',
        date: new Date(),
        currency: 'EUR',
        exchangeRate: 1,
        paymentMethod: 'EC',
        tags: [],
    }

    const { form } = useTransactionForm(formDefaultValues)

    const { onSubmit } = useNewTransactionSubmitHandler()

    return (
        <TransactionFormPage
            heading="Create Transaction"
            form={form}
            constants={constants}
            onSubmit={onSubmit}
        />
    )
}

export const getServerSideProps = async () => {
    try {
        return {
            props: {
                constants: await fetchTransactionConstants(),
            },
        }
    } catch (err) {
        console.log(err)
    }
}

export default NewTransactionPage
