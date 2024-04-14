import { formatDateToWords, handleUnwantedTimezoneShift } from 'domain-model'
import { CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'

import { cn } from '../helpers/utils'
import { Button } from '../lib/shadcn/Button'
import { Calendar as ShadcnCalendar } from '../lib/shadcn/Calendar'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../lib/shadcn/Form'
import { Popover, PopoverContent, PopoverTrigger } from '../lib/shadcn/Popover'

type CalendarProps<T> = {
    form: UseFormReturn<any, any>
    label: string
    id: keyof T
}

export function Calendar<T>(props: CalendarProps<T>) {
    const { form, label, id } = props

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleSelect = (
        field: ControllerRenderProps<any, string>,
        selectedDate: Date
    ) => {
        field.onChange(handleUnwantedTimezoneShift(selectedDate))
        setIsOpen(false)
    }

    return (
        <FormField
            control={form.control}
            name={id as string}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    className={cn(
                                        'w-full rounded-md bg-background-overlay pl-3 text-left font-medium text-primary hover:bg-background-overlay',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        formatDateToWords(field.value)
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 text-primary opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <ShadcnCalendar
                                mode="single"
                                selected={field.value}
                                onSelect={(selectedDate) =>
                                    handleSelect(field, selectedDate!)
                                }
                                required
                                ISOWeek
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
