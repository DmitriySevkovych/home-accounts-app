import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionForm, TransactionFormSchema } from 'domain-model'
import { useForm } from 'react-hook-form'

const useTransactionForm = (formDefaultValues: Partial<TransactionForm>) => {
    const form = useForm<TransactionForm>({
        resolver: zodResolver(TransactionFormSchema),
        defaultValues: formDefaultValues,
    })

    return {
        form,
    }
}

export default useTransactionForm
