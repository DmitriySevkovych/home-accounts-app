import { NextRouter, useRouter } from 'next/router'
import { type SubmitHandler } from 'react-hook-form'

import { ResponseError } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import { TransactionForm } from '../../helpers/zod-form-schemas'
import { useToast } from '../../lib/shadcn/use-toast'
import { useSafeFetch } from './useSafeFetch'

const _sendTransaction = async (
    transaction: TransactionForm,
    safeFetch: (
        endpoint: string,
        options?: RequestInit | undefined
    ) => Promise<Response>,
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

        await safeFetch(API.client.transactions.update, {
            method: 'PUT',
            body: formData,
        })
        toast({
            title: 'Transaction has been updated!',
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
        router.push(PAGES.transactions.success(transaction.type))
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

const useUpdateTransactionSubmitHandler = () => {
    const { toast } = useToast()

    const router = useRouter()
    const safeFetch = useSafeFetch()

    const onSubmit: SubmitHandler<TransactionForm> = async (data) => {
        _sendTransaction(data, safeFetch, router, toast)
    }

    return { onSubmit }
}

export default useUpdateTransactionSubmitHandler
