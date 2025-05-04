import { TransactionForm } from 'domain-model'
import { getLogger } from 'logger'
import React from 'react'

import { DeleteDialog } from '../../components/Dialog'
import useDeleteTransactionHandler from '../../components/hooks/useDeleteTransactionHandler'
import useTransactionForm from '../../components/hooks/useTransactionForm'
import useTransactionFormSubmitHandler from '../../components/hooks/useTransactionFormSubmitHandler'
import TransactionFormPage, {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/pages/TransactionFormPage'
import { safeFetch } from '../../helpers/requests'
import { API } from '../../helpers/routes'
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

    const { onSubmit } = useTransactionFormSubmitHandler('update')

    const { deleteTransaction } = useDeleteTransactionHandler()

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
            <div className="relative mx-auto max-w-4xl bg-background px-3 py-8 text-darkest">
                <h2 className="mb-6 flex-grow text-xl font-bold leading-none text-primary lg:text-2xl">
                    Danger Zone ☢️
                </h2>

                <div className="flex flex-col gap-4 md:flex-row md:justify-end">
                    <Button
                        className="flex w-full md:w-auto lg:col-span-2"
                        variant="secondary"
                        type="button"
                        size={'lg'}
                    >
                        Correct
                    </Button>

                    <DeleteDialog
                        onConfirm={() => deleteTransaction(transaction.id!)}
                    >
                        <Button
                            className="flex w-full md:w-auto lg:col-span-2"
                            variant="secondary"
                            type="button"
                            size={'lg'}
                        >
                            Delete
                        </Button>
                    </DeleteDialog>
                </div>
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
                constants: await fetchTransactionConstants(),
            },
        }
    } catch (err) {
        logger.error(err)
    }
}

export default EditTransactionPage
