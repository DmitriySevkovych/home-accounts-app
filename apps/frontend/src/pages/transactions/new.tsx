import { TransactionForm } from 'domain-model'
import React from 'react'

import useTransactionForm from '../../components/hooks/useTransactionForm'
import useTransactionFormSubmitHandler from '../../components/hooks/useTransactionFormSubmitHandler'
import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/pages/TransactionFormPage'

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

    const { onSubmit } = useTransactionFormSubmitHandler('create')

    return (
        <TransactionFormPage
            heading="Create Transaction"
            form={form}
            constants={constants}
            onSubmit={onSubmit}
            submitLabel="Create"
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
