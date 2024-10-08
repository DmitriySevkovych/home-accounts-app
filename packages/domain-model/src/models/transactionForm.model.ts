import { z } from 'zod'

import { FileWithPath } from '../helpers/handy-types'

// TODO add validation texts
export const TransactionFormSchema = z
    .object({
        id: z.optional(z.coerce.number().int()),
        type: z.enum(['expense', 'income', 'zerosum']),
        context: z.enum(['home', 'work', 'investments']),
        category: z.string(),
        origin: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        amount: z.coerce
            .number()
            .refine((val) => val !== 0, { message: 'Amount cannot be 0' }),
        currency: z.string().toUpperCase().length(3),
        exchangeRate: z.coerce.number().positive(),
        paymentMethod: z.string(),
        sourceBankAccount: z.optional(z.string()),
        targetBankAccount: z.optional(z.string()),
        taxCategory: z.optional(z.string()),
        comment: z.optional(z.string()),
        tags: z.string().array(),
        investment: z.optional(z.string()),
        invoiceKey: z.optional(z.string()),
        country: z.optional(z.string().toUpperCase().length(2)),
        vat: z.optional(z.coerce.number().nonnegative().max(1)),
        receipt: z.optional(z.custom<FileWithPath>()),
        receiptId: z.optional(z.coerce.number()),
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
        } else if (form.type === 'zerosum') {
            if (!form.sourceBankAccount) {
                ctx.addIssue({
                    path: ['sourceBankAccount'],
                    code: z.ZodIssueCode.custom,
                    message:
                        "Transaction type 'zerosum' must have a source bank account set.",
                })
            }
            if (!form.targetBankAccount) {
                ctx.addIssue({
                    path: ['targetBankAccount'],
                    code: z.ZodIssueCode.custom,
                    message:
                        "Transaction type 'zerosum' must have a target bank account set.",
                })
            }
        }

        // Currency and exchange rate check
        if (form.currency === 'EUR' && form.exchangeRate !== 1) {
            ctx.addIssue({
                path: ['exchangeRate'],
                code: z.ZodIssueCode.custom,
                message: 'The currency EUR should always have exchange rate 1.',
            })
        }

        // Investment check
        if (form.context === 'investments' && !form.investment) {
            ctx.addIssue({
                path: ['investment'],
                code: z.ZodIssueCode.custom,
                message:
                    "Transaction context 'investments' requires an investment to be set.",
            })
        }

        // Work fields checks
        if (
            form.context === 'work' &&
            form.type === 'income' &&
            form.category === 'SALARY' &&
            !form.invoiceKey
        ) {
            ctx.addIssue({
                path: ['invoiceKey'],
                code: z.ZodIssueCode.custom,
                message:
                    "Transaction context 'work' of type 'income' requires an invoice key to be set.",
            })
        }

        if (
            form.context === 'work' &&
            form.type === 'expense' &&
            !form.country
        ) {
            ctx.addIssue({
                path: ['country'],
                code: z.ZodIssueCode.custom,
                message:
                    "Transaction context 'work' of type 'expense' requires an 2-character country code to be set.",
            })
        }

        if (
            form.context === 'work' &&
            form.type === 'expense' &&
            form.vat !== 0 &&
            !form.vat
        ) {
            ctx.addIssue({
                path: ['vat'],
                code: z.ZodIssueCode.custom,
                message:
                    "Transaction context 'work' of type 'expense' requires a VAT to be set.",
            })
        }
    })

export type TransactionForm = z.infer<typeof TransactionFormSchema>
