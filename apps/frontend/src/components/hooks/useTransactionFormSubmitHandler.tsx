import { TransactionForm } from 'domain-model'
import { useRouter } from 'next/router'
import React from 'react'
import { type SubmitHandler } from 'react-hook-form'

import { ResponseError, safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import { useToast } from '../../lib/shadcn/use-toast'

const _sendCreateTransaction = async (formData: FormData) => {
    await safeFetch(API.client.transactions.create, {
        method: 'POST',
        body: formData,
    })
    return {
        message: 'A new transaction has been created!',
    }
}

const _sendUpdateTransaction = async (formData: FormData) => {
    await safeFetch(API.client.transactions.update, {
        method: 'PUT',
        body: formData,
    })
    return {
        message: 'Transaction has been updated!',
    }
}

const _notify = (toast: CallableFunction, message: string, payload: object) => {
    toast({
        title: message,
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
}

const useTransactionFormSubmitHandler = (action: 'create' | 'update') => {
    const { toast } = useToast()

    const router = useRouter()

    const onSubmit: SubmitHandler<TransactionForm> = async (
        transactionFormData
    ) => {
        try {
            const formData = new FormData()

            const payload = {
                ...transactionFormData,
                agent: 'home-app-frontend', // TODO agent should be the logged-in user, once there is a login
            }
            formData.append('transaction', JSON.stringify(payload))

            if (transactionFormData.receipt) {
                formData.append('receipt', transactionFormData.receipt)
            }

            if (action === 'create') {
                const { message } = await _sendCreateTransaction(formData)
                _notify(toast, message, payload)
            } else if (action === 'update') {
                const { message } = await _sendUpdateTransaction(formData)
                _notify(toast, message, payload)
            } else {
                throw new Error(`Illegal action ${action}`)
            }

            if (transactionFormData.type === 'zerosum') {
                // TODO
                router.push(PAGES.transactions.index)
            } else {
                router.push(
                    PAGES.transactions.success(transactionFormData.type)
                )
            }
        } catch (error) {
            let description = `An exception occurred. Please check the error log.`
            if (error instanceof ResponseError) {
                const { response } = error
                description = `Received ${response.status} ${response.statusText}.`
            }
            toast({
                variant: 'destructive',
                title: `Something when wrong!`,
                description,
            })
            console.log(error)
        }
    }

    return { onSubmit }
}

export default useTransactionFormSubmitHandler
