import { TransactionForm } from 'domain-model'
import { getLogger } from 'logger'
import React from 'react'
import useSWR from 'swr'

import { DeleteDialog } from '../../components/Dialog'
import { Loader } from '../../components/Typography'
import useDeleteTransactionHandler from '../../components/hooks/useDeleteTransactionHandler'
import useTransactionForm from '../../components/hooks/useTransactionForm'
import useTransactionFormSubmitHandler from '../../components/hooks/useTransactionFormSubmitHandler'
import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/pages/TransactionFormPage'
import { safeFetch } from '../../helpers/requests'
import { API } from '../../helpers/routes'
import { Separator } from '../../lib/shadcn/Separator'

type EditPageProps = {
    transaction: TransactionForm
}

const EditTransactionPage = ({ transaction }: EditPageProps) => {
    //TODO: this is a hack. Not sure how to deserialize the transaction from string AND pass it to the hook so that TypeScript doesn't cry
    transaction.date = new Date(transaction.date)

    const { form } = useTransactionForm(transaction)

    const { onSubmit } = useTransactionFormSubmitHandler('update')

    const { deleteTransaction } = useDeleteTransactionHandler()

    const {
        data: constants,
        // error,
        isLoading,
    } = useSWR<TransactionFormConstants>(
        'fetchTransactionConstants',
        fetchTransactionConstants
    )

    if (isLoading) return <Loader />

    return (
        <>
            <TransactionFormPage
                heading="Edit Transaction"
                form={form}
                constants={constants!}
                onSubmit={onSubmit}
                submitLabel="Update"
            />
            <Separator />
            <div className="relative mx-auto  max-w-4xl bg-background px-3 py-8 text-darkest">
                <h2 className="mb-6 flex-grow text-xl font-bold leading-none text-primary lg:text-2xl">
                    Danger Zone ☢️
                </h2>

                <DeleteDialog
                    onConfirm={() => deleteTransaction(transaction.id!)}
                />
            </div>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const logger = getLogger()
    const { id } = context.query
    try {
        const response = await safeFetch(API.server.transactions.getById(id))
        const transaction = await response.json()

        return {
            props: {
                transaction,
            },
        }
    } catch (err) {
        logger.error(err)
    }
}

export default EditTransactionPage
