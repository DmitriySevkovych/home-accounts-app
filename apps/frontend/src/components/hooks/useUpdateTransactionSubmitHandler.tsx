import { type SubmitHandler } from 'react-hook-form'

import { TransactionForm } from '../../helpers/zod-form-schemas'
import { useToast } from '../../lib/shadcn/use-toast'

const useUpdateTransactionSubmitHandler = () => {
    const { toast } = useToast()

    const onSubmit: SubmitHandler<TransactionForm> = async (data) => {
        toast({
            variant: 'destructive',
            title: 'Work in progress',
            description: `A PUT request will happen here one day.`,
        })
    }

    return { onSubmit }
}

export default useUpdateTransactionSubmitHandler
