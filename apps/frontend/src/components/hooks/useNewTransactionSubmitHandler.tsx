import { NextRouter, useRouter } from 'next/router'
import { type SubmitHandler } from 'react-hook-form'

import { CLIENT_BACKEND_BASE_URL } from '../../helpers/constants'
import { PAGES } from '../../helpers/pages'
import { NewTransactionForm } from '../../helpers/zod-form-schemas'
import { useToast } from '../../lib/shadcn/use-toast'

const sendTransaction = async (
    transaction: NewTransactionForm,
    router: NextRouter,
    toast: CallableFunction
) => {
    try {
        const body = {
            ...transaction,
            agent: 'test-agent', // TODO agent should be the logged-in user, once there is a login
        }

        const response = await fetch(
            `${CLIENT_BACKEND_BASE_URL}/transactions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        )
        if (response.status === 201) {
            toast({
                title: 'A new transaction has been created! You submitted the following values:',
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">
                            {JSON.stringify(body, null, 2)}
                        </code>
                    </pre>
                ),
                duration: 3000,
            })
            router.push(
                `${PAGES.transactions.success}?transactionType=${transaction.type}`
            )
        } else {
            toast({
                title: `Something when wrong! Received ${response.status} ${response.statusText}`,
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const useNewTransactionSubmitHandler = () => {
    const { toast } = useToast()

    const router = useRouter()

    const onSubmit: SubmitHandler<NewTransactionForm> = async (data) => {
        sendTransaction(data, router, toast)
    }

    return { onSubmit }
}

export default useNewTransactionSubmitHandler
