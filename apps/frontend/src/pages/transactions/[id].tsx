import React from 'react'

import { Dialog } from '../../components/Dialog'
import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/TransactionFormPage'
import useTransactionForm from '../../components/hooks/useTransactionForm'
import useUpdateTransactionSubmitHandler from '../../components/hooks/useUpdateTransactionSubmitHandler'
import { safeFetch } from '../../helpers/requests'
import { API } from '../../helpers/routes'
import { TransactionForm } from '../../helpers/zod-form-schemas'
import { Button } from '../../lib/shadcn/Button'
import { Separator } from '../../lib/shadcn/Separator'

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
        <>
            <TransactionFormPage
                heading="Edit Transaction"
                form={form}
                constants={constants}
                onSubmit={onSubmit}
                submitLabel="Update"
            />
            <Separator />
            <div className="relative mx-auto  max-w-4xl bg-background px-3 py-8 text-darkest">
                <h2 className="mb-6 flex-grow text-xl font-bold leading-none text-primary lg:text-2xl">
                    Danger Zone ☢️
                </h2>

                <Dialog />
            </div>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.query
    try {
        const response = await safeFetch(API.server.transactions.getById(id))
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
