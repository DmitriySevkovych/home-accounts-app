import { deserializeTransaction } from 'domain-model'
import React from 'react'

import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/TransactionFormPage'
import useTransactionForm from '../../components/hooks/useTransactionForm'
import { API } from '../../helpers/routes'
import { TransactionForm } from '../../helpers/zod-form-schemas'

type EditPageProps = {
    transaction: TransactionForm
    constants: TransactionFormConstants
}

const EditTransactionPage = ({ transaction, constants }: EditPageProps) => {
    const { form } = useTransactionForm(deserializeTransaction(transaction))

    // const { onSubmit } = useNewTransactionSubmitHandler()

    return (
        <TransactionFormPage
            heading="Edit Transaction"
            form={form}
            constants={constants}
            onSubmit={() => {
                alert('PUT missing')
            }}
        />
    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.query
    try {
        const response = await fetch(API.server.transactions.getById(id))
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
