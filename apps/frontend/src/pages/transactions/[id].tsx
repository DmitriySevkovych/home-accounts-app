import React from 'react'

import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/TransactionFormPage'
import useTransactionForm from '../../components/hooks/useTransactionForm'
import useUpdateTransactionSubmitHandler from '../../components/hooks/useUpdateTransactionSubmitHandler'
import { serversideSafeFetch } from '../../helpers/requests'
import { API } from '../../helpers/routes'
import { TransactionForm } from '../../helpers/zod-form-schemas'

type EditPageProps = {
    transaction: TransactionForm
    constants: TransactionFormConstants
}

const EditTransactionPage = ({ transaction, constants }: EditPageProps) => {
    //TODO: this is a hack. Not sure how to deserialize the transaction from string AND pass it to the hook so that TypeScript doesn't cry
    transaction.date = new Date(transaction.date)

    const { form } = useTransactionForm(transaction)

    const { onSubmit } = useUpdateTransactionSubmitHandler()

    return (
        <TransactionFormPage
            heading="Edit Transaction"
            form={form}
            constants={constants}
            onSubmit={onSubmit}
            submitLabel="Update"
        />
    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.query
    try {
        const response = await serversideSafeFetch(
            API.server.transactions.getById(id)
        )
        const transaction = await response.json()

        return {
            props: {
                transaction,
                constants: await fetchTransactionConstants(),
            },
        }
    } catch (err) {
        console.log(err)
    }
}

export default EditTransactionPage
