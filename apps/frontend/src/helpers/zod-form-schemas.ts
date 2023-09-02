import { z } from 'zod'

// TODO add validation texts
export const NewTransactionFormSchema = z.object({
    type: z.enum(['expense', 'income']),
    category: z.string(),
    origin: z.string(),
    description: z.string(),
    date: z.date(),
    // date: z.string().datetime(),
    amount: z.coerce.number(),
    currency: z.string().length(3),
    exchangeRate: z.coerce.number(),
    paymentMethod: z.string(),
    sourceBankAccount: z.optional(z.string()),
    targetBankAccount: z.optional(z.string()),
    taxCategory: z.optional(z.string()),
    comment: z.optional(z.string()),
    context: z.enum(['home', 'work', 'investments']),
    tags: z.string().array(),
})

export type NewTransactionForm = z.infer<typeof NewTransactionFormSchema>
