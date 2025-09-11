import { TransactionForm } from 'domain-model'
import React, { Suspense } from 'react'
import useSWR from 'swr'

import { Loader } from '../../components/Typography'
import useTransactionForm from '../../components/hooks/useTransactionForm'
import useTransactionFormSubmitHandler from '../../components/hooks/useTransactionFormSubmitHandler'
import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/pages/TransactionFormPage'

const NewTransactionPage = () => {
    const {
        data: constants,
        // error,
        isLoading,
    } = useSWR<TransactionFormConstants>(
        'fetchTransactionConstants',
        fetchTransactionConstants
    )

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

    if (isLoading) return <Loader />

    console.log({ constants })
    return (
        <Suspense fallback={<Loader />}>
            <TransactionFormPage
                heading="Create Transaction"
                form={form}
                constants={constants!}
                onSubmit={onSubmit}
                submitLabel="Create"
                allowZerosumTransactions
            />
        </Suspense>
    )
}

export default NewTransactionPage
