import { zodResolver } from '@hookform/resolvers/zod'
import { HomeAppDate } from 'domain-model'
import { useForm } from 'react-hook-form'

import {
    NewTransactionForm,
    NewTransactionFormSchema,
} from '../../helpers/zod-form-schemas'

const useNewTransactionForm = () => {
    const formDefaultValues: Partial<NewTransactionForm> = {
        type: 'expense',
        context: 'home',
        category: 'FOOD',
        date: HomeAppDate.today(),
        currency: 'EUR',
        exchangeRate: 1,
        paymentMethod: 'EC',
        tags: [],
    }

    const form = useForm<NewTransactionForm>({
        resolver: zodResolver(NewTransactionFormSchema),
        defaultValues: formDefaultValues,
    })

    return {
        form,
    }
}

export default useNewTransactionForm
