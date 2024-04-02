import { z } from 'zod'

export const SearchParametersFormSchema = z
    .object({
        categories: z.optional(z.string().array()),
        origin: z.optional(z.string()),
        description: z.optional(z.string()),
        dateFrom: z.optional(z.coerce.date()),
        dateUntil: z.optional(z.coerce.date()),
        tags: z.optional(z.string().array()),
        // TODO for future feature iterations
        // taxCategory: z.optional(z.optional(z.string())),
        // bankAccount: z.optional(z.optional(z.string())),
        // paymentMethod: z.optional(z.string()),
        // currency: z.optional(z.string().toUpperCase().length(3)),
        // investment: z.optional(z.string()),
        // invoiceKey: z.optional(z.string()),
    })
    .superRefine((form, ctx) => {
        const { dateFrom, dateUntil } = form
        // Dates check
        if (dateFrom && dateUntil && dateFrom > dateUntil) {
            ctx.addIssue({
                path: ['dateUntil'],
                code: z.ZodIssueCode.custom,
                message: 'Second date must be after first date',
            })
        }
    })

export type SearchParameters = z.infer<typeof SearchParametersFormSchema>
