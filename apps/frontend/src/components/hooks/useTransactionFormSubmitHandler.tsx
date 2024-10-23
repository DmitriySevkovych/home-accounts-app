import { TransactionForm, TransactionFormSchema } from 'domain-model'
import { useRouter } from 'next/router'
import React from 'react'
import { type SubmitHandler } from 'react-hook-form'

import { ResponseError, safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import { useToast } from '../../lib/shadcn/use-toast'

type SubmitAction = 'create' | 'update'

const _getFormData = (transactionForm: TransactionForm): FormData => {
    const formData = new FormData()

    // Validation/Automation step. TODO: find a better place for it.
    if (
        Math.abs(transactionForm.amount) >= 100 &&
        !transactionForm.tags.includes('BigAmount')
    ) {
        transactionForm.tags.push('BigAmount')
    }

    const payload = {
        ...transactionForm,
        agent: 'home-app-frontend', // TODO agent should be the logged-in user, once there is a login
    }
    formData.append('transaction', JSON.stringify(payload))

    if (transactionForm.receipt) {
        formData.append('receipt', transactionForm.receipt)
    }
    return formData
}

const _notify = (
    toast: CallableFunction,
    message: string,
    formData: FormData
) => {
    if (!formData.has('transaction')) {
        throw new Error('Form data must have a transaction')
    }
    const payload = JSON.parse(formData.get('transaction') as string)
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

const _sendTransaction = async (
    action: SubmitAction,
    toast: CallableFunction,
    formData: FormData
) => {
    if (action === 'create') {
        const { message } = await _sendCreateTransaction(formData)
        _notify(toast, message, formData)
    } else if (action === 'update') {
        const { message } = await _sendUpdateTransaction(formData)
        _notify(toast, message, formData)
    } else {
        throw new Error(`Illegal action ${action}`)
    }
}

const _handleZerosumTransaction = async (
    action: SubmitAction,
    toast: CallableFunction,
    transactionForm: TransactionForm
) => {
    const ZEROSUM_TAG: string =
        process.env.NEXT_PUBLIC_ZEROSUM_TAG || 'ZeroSumTransaction'

    // Part one: expense transaction
    const expense = structuredClone(transactionForm)
    expense.type = 'expense'
    expense.amount = -1 * Math.abs(expense.amount)
    if (!expense.tags || !expense.tags.includes(ZEROSUM_TAG)) {
        expense.tags.push(ZEROSUM_TAG)
    }
    TransactionFormSchema.parse(expense)
    await _sendTransaction(action, toast, _getFormData(expense))

    // Part two: corresponding income transaction
    const income = structuredClone(transactionForm)
    income.type = 'income'
    income.amount = Math.abs(income.amount)
    if (!income.tags || !income.tags.includes(ZEROSUM_TAG)) {
        income.tags.push(ZEROSUM_TAG)
    }
    TransactionFormSchema.parse(income)
    await _sendTransaction(action, toast, _getFormData(income))

    // await Promise.all([promiseExpense, promiseIncome])
}

const useTransactionFormSubmitHandler = (action: SubmitAction) => {
    const { toast } = useToast()

    const router = useRouter()

    const onSubmit: SubmitHandler<TransactionForm> = async (
        transactionForm
    ) => {
        try {
            // Handle zerosum special case: will send two requests
            if (transactionForm.type === 'zerosum') {
                await _handleZerosumTransaction(action, toast, transactionForm)
                await router.push(PAGES.transactions.index)
                return
            }

            // Handle regular case
            const formData = _getFormData(transactionForm)
            await _sendTransaction(action, toast, formData)
            await router.push(PAGES.transactions.success(transactionForm.type))
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
