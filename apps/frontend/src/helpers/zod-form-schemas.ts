import { TransactionDate } from 'domain-model'
import { z } from 'zod'

// TODO add validation texts
export const NewTransactionFormSchema = z.object({
    type: z.enum(['expense', 'income']),
    category: z.string(),
    origin: z.string(),
    description: z.string(),
    date: z.coerce.date().transform((val) => TransactionDate.fromJsDate(val)),
    amount: z.coerce
        .number()
        .refine((val) => val !== 0, { message: 'Amount cannot be 0' }),
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

// TransactionFormSchema.transform(t => {
//     if (t.amount > 0 && t.type === "expense") {
//         t.amount = -1 * t.amount
//     } else if (t.amount < 0 && t.type === "income") {
//         t.amount = -1 * t.amount
//     }
//     return t
// })
NewTransactionFormSchema.superRefine((form, ctx) => {
    // Amount check
    // TODO

    // Bank accounts checks
    // TODO

    // Currency and exchange rate check
    if (form.currency === 'EUR' && form.exchangeRate !== 1) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'The currency EUR should always have exchange rate 1.',
        })
    }
})

export type NewTransactionForm = z.infer<typeof NewTransactionFormSchema>
