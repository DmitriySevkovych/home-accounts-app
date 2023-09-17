import { TransactionDate } from 'domain-model'
import { z } from 'zod'

// TODO add validation texts
export const NewTransactionFormSchema = z
    .object({
        type: z.enum(['expense', 'income']),
        context: z.enum(['home', 'work', 'investments']),
        category: z.string(),
        origin: z.string(),
        description: z.string(),
        date: z.coerce
            .date()
            .transform((val) => TransactionDate.fromJsDate(val)),
        amount: z.coerce
            .number()
            .refine((val) => val !== 0, { message: 'Amount cannot be 0' }),
        currency: z
            .string()
            .length(3)
            .transform((val) => val.toUpperCase()),
        exchangeRate: z.coerce.number(),
        paymentMethod: z.string(),
        sourceBankAccount: z.optional(z.string()),
        targetBankAccount: z.optional(z.string()),
        taxCategory: z.optional(z.string()),
        comment: z.optional(z.string()),
        tags: z.string().array(),
    })
    .transform((form) => {
        // Transform amount
        if (form.amount > 0 && form.type === 'expense') {
            form.amount = -1 * form.amount
        } else if (form.amount < 0 && form.type === 'income') {
            form.amount = -1 * form.amount
        }
        return form
    })
    .superRefine((form, ctx) => {
        // Bank accounts checks
        if (form.type === 'expense' && !form.sourceBankAccount) {
            ctx.addIssue({
                path: ['sourceBankAccount'],
                code: z.ZodIssueCode.custom,
                message:
                    "Transaction type 'expense' must have a source bank account set.",
            })
        } else if (form.type === 'income' && !form.targetBankAccount) {
            ctx.addIssue({
                path: ['targetBankAccount'],
                code: z.ZodIssueCode.custom,
                message:
                    "Transaction type 'income' must have a source bank account set.",
            })
        }

        // Currency and exchange rate check
        if (form.currency === 'EUR' && form.exchangeRate !== 1) {
            ctx.addIssue({
                path: ['exchangeRate'],
                code: z.ZodIssueCode.custom,
                message: 'The currency EUR should always have exchange rate 1.',
            })
        }
    })

export type NewTransactionForm = z.infer<typeof NewTransactionFormSchema>
