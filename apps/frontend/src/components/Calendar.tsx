import { HomeAppDate, Transaction } from 'domain-model'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

import { cn } from '../helpers/utils'
import { Button } from '../lib/shadcn/Button'
import { Calendar as ShadcnCalendar } from '../lib/shadcn/Calendar'
import { FormControl, FormField, FormItem, FormLabel } from '../lib/shadcn/Form'
import { Popover, PopoverContent, PopoverTrigger } from '../lib/shadcn/Popover'

type CalendarProps = {
    form: UseFormReturn<any, any, undefined>
    label: string
    id: keyof Transaction
}

export const Calendar = (props: CalendarProps) => {
    const { form, label, id } = props
    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    className={cn(
                                        'w-full bg-background-overlay pl-3 text-left font-normal text-darkest hover:bg-background-overlay',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        field.value.toWords()
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <ShadcnCalendar
                                mode="single"
                                selected={field.value.toJSDate()}
                                onSelect={(selectedDay) => {
                                    if (selectedDay)
                                        field.onChange(
                                            HomeAppDate.fromJsDate(selectedDay)
                                        )
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </FormItem>
            )}
        />
    )
}
