import { NextRouter, useRouter } from 'next/router'
import React from 'react'
import { type SubmitHandler } from 'react-hook-form'

import { CLIENT_BACKEND_BASE_URL } from '../../helpers/constants'
import { PAGES } from '../../helpers/pages'
import { NewTransactionForm } from '../../helpers/zod-form-schemas'
import { useToast } from '../../lib/shadcn/use-toast'

const _sendTransaction = async (
    transaction: NewTransactionForm,
    router: NextRouter,
    toast: CallableFunction
) => {
    try {
        const formData = new FormData()

        const payload = {
            ...transaction,
            agent: 'home-app-frontend', // TODO agent should be the logged-in user, once there is a login
        }
        formData.append('transaction', JSON.stringify(payload))

        if (transaction.receipt) {
            formData.append('receipt', transaction.receipt)
        }

        const response = await fetch(
            `${CLIENT_BACKEND_BASE_URL}/transactions`,
            {
                method: 'POST',
                body: formData,
            }
        )
        if (response.status === 201) {
            toast({
                title: 'A new transaction has been created!',
                description: (
                    <>
                        <p>You submitted the following values:</p>
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">
                                {JSON.stringify(payload, null, 2)}
                            </code>
                        </pre>
                    </>
                ),
            })
            router.push(
                `${PAGES.transactions.success}?transactionType=${transaction.type}`
            )
        } else {
            toast({
                variant: 'destructive',
                title: 'Something when wrong!',
                description: `Received ${response.status} ${response.statusText}.`,
            })
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: `Something when wrong!`,
            description: `An exception occurred. Please check the error log.`,
        })
        console.log(error)
    }
}

const useNewTransactionSubmitHandler = () => {
    const { toast } = useToast()

    const router = useRouter()

    const onSubmit: SubmitHandler<NewTransactionForm> = async (data) => {
        _sendTransaction(data, router, toast)
    }

    return { onSubmit }
}

export default useNewTransactionSubmitHandler
