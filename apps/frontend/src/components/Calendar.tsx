import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TransactionDate } from 'domain-model'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../lib/shadcn/Form'
import { Popover, PopoverContent, PopoverTrigger } from '../lib/shadcn/Popover'
import { Button } from '../lib/shadcn/Button'
import { cn } from '../helpers/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../lib/shadcn/Calendar'

type DateInputProps = {
    form: UseFormReturn<FormData>
    label: string
    id: string
}

export const DateInput = (props: DateInputProps) => {
    const { form, label, id } = props
    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, 'PPP')
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date('1900-01-01')
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
