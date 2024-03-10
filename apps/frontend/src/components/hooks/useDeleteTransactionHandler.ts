import { useRouter } from 'next/router'

import { ResponseError, safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import { useToast } from '../../lib/shadcn/use-toast'

const useDeleteTransactionHandler = () => {
    const { toast } = useToast()

    const router = useRouter()

    const deleteTransaction: (transactionId: number) => void = async (
        transactionId: number
    ) => {
        try {
            await safeFetch(API.client.transactions.delete(transactionId), {
                method: 'DELETE',
            })
            toast({
                title: 'Transaction deleted!',
                description: `Transaction with id=${transactionId} has been deleted`,
            })
            router.push(PAGES.transactions.index)
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

    return { deleteTransaction }
}

export default useDeleteTransactionHandler
