import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    TransactionForm,
    TransactionFormSchema,
} from '../../helpers/zod-form-schemas'

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
