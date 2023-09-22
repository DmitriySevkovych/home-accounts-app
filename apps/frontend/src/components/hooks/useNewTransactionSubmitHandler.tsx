import { createTransaction } from 'domain-model'
import { useRouter } from 'next/router'
import { type SubmitHandler } from 'react-hook-form'

import { BACKEND_BASE_URL } from '../../helpers/constants'
import { PAGES } from '../../helpers/pages'
import { NewTransactionForm } from '../../helpers/zod-form-schemas'
import { useToast } from '../../lib/shadcn/use-toast'

const useNewTransactionSubmitHandler = () => {
    const { toast } = useToast()

    const router = useRouter()

    const onSubmit: SubmitHandler<NewTransactionForm> = async (data) => {
        const {
            type,
            category,
            origin,
            description,
            amount,
            tags,
            date,
            comment,
            currency,
            exchangeRate,
            context,
            paymentMethod,
            sourceBankAccount,
            targetBankAccount,
            taxCategory,
        } = data
        const builder = createTransaction()
            .about(category, origin, description)
            .withType(type)
            .withAmount(amount)
            .withCurrency(currency, exchangeRate)
            .withDate(date)
            .withContext(context)
            .withAgent('test-agent') // TODO agent should be the logged in user, once there is a login
            .addTags(tags)

        if (comment) builder.withComment(comment)
        if (taxCategory) builder.withTaxCategory(taxCategory)
        if (type === 'expense' && sourceBankAccount) {
            builder.withPaymentFrom(paymentMethod, sourceBankAccount)
        } else if (type === 'income' && targetBankAccount) {
            builder.withPaymentTo(paymentMethod, targetBankAccount)
        }

        const transaction = builder.validate().build()

        try {
            const response = await fetch(`${BACKEND_BASE_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            })
            if (response.status === 201) {
                toast({
                    title: 'A new transaction has been created! You submitted the following values:',
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">
                                {JSON.stringify(transaction, null, 2)}
                            </code>
                        </pre>
                    ),
                    duration: 3000,
                })
                // form.reset()
                router.push(
                    `${PAGES.transactions.success}?transactionType=${type}`
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

    return { onSubmit }
}

export default useNewTransactionSubmitHandler
