import { Minus, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'

import { Button } from '../lib/shadcn/Button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../lib/shadcn/Form'
import { ScrollArea } from '../lib/shadcn/ScrollArea'
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select as ShadcnSelect,
} from '../lib/shadcn/Select'

type SelectProps<T> = {
    form: UseFormReturn<any, any>
    label: string
    id: keyof T
    options: string[]
}

export default function Select<T>(props: SelectProps<T>) {
    const { form, label, id, options } = props

    return (
        <FormField
            control={form.control}
            name={id as string}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <ShadcnSelect
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <ScrollableSelectContent options={options} />
                    </ShadcnSelect>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export function SelectMany<T>(props: SelectProps<T>) {
    const { form, label, id, options } = props

    const _addSelectComponent = (field: ControllerRenderProps<any, string>) => {
        if (field.value) {
            field.onChange([...field.value, null])
        } else {
            field.onChange([null])
        }
    }

    const _removeSelectComponent = (
        field: ControllerRenderProps<any, string>,
        index: number
    ) => {
        field.value.splice(index, 1)
        field.onChange(field.value)
    }

    const _updateSelection = (
        field: ControllerRenderProps<any, string>,
        index: number,
        selection: string
    ) => {
        field.value[index] = selection
        field.onChange(field.value)
    }

    const _getSelectValue = (
        field: ControllerRenderProps<any, string>,
        index: number
    ): string => {
        return field.value[index]
    }

    return (
        <>
            <FormField
                control={form.control}
                name={id as string}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        {field.value?.map((_: any, index: number) => {
                            return (
                                <div key={index} className="flex gap-2">
                                    <ShadcnSelect
                                        onValueChange={(selection) =>
                                            _updateSelection(
                                                field,
                                                index,
                                                selection
                                            )
                                        }
                                        value={_getSelectValue(field, index)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <ScrollableSelectContent
                                            options={options}
                                        />
                                    </ShadcnSelect>
                                    <Button
                                        type="button"
                                        className="min-w-[40px] p-0"
                                        variant="secondary"
                                        onClick={() =>
                                            _removeSelectComponent(field, index)
                                        }
                                    >
                                        <Minus size={18} />
                                    </Button>
                                </div>
                            )
                        })}

                        <div className="flex justify-start">
                            <Button
                                type="button"
                                className="min-w-[40px] p-0"
                                onClick={() => _addSelectComponent(field)}
                            >
                                <Plus size={18} />
                            </Button>
                        </div>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

const ScrollableSelectContent: React.FC<{ options: string[] }> = ({
    options,
}) => {
    // If there are more than 6 selection options, add a scroll area.
    // Otherwise the content is neat as is, and the fixed scroll area height is annoying rather than helpful.
    if (options.length > 6) {
        return (
            <SelectContent>
                <ScrollArea className="h-[190px]">
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </ScrollArea>
            </SelectContent>
        )
    }

    return (
        <SelectContent>
            {options.map((option) => (
                <SelectItem key={option} value={option}>
                    {option}
                </SelectItem>
            ))}
        </SelectContent>
    )
}
