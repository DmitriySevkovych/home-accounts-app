import { useCommandState } from 'cmdk'
import React from 'react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'

import { NewTransactionForm } from '../helpers/zod-form-schemas'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '../lib/shadcn/Command'
import { FormField, FormItem, FormLabel } from '../lib/shadcn/Form'
import { ScrollArea } from '../lib/shadcn/ScrollArea'

type AutocompleteInputProps = {
    id: keyof NewTransactionForm
    form: UseFormReturn<any, any, undefined>
    label: string
    placeholder?: string
    autocompleteOptions: string[]
}

type CollapsibleCommandGroupProps = {
    options: string[]
    field: ControllerRenderProps<any, keyof NewTransactionForm>
    onSelect: (
        option: string,
        field: ControllerRenderProps<any, keyof NewTransactionForm>
    ) => void
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
    const { form, label, id, autocompleteOptions, placeholder } = props

    const onSelect = (
        selectedOption: string,
        field: ControllerRenderProps<any, keyof NewTransactionForm>
    ) => {
        field.onChange(selectedOption)
    }

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>

                    <Command>
                        <CommandInput
                            onValueChange={field.onChange}
                            value={field.value}
                            placeholder={placeholder}
                        />
                        <CollapsibleCommandGroup
                            options={autocompleteOptions}
                            field={field}
                            onSelect={onSelect}
                        />
                    </Command>
                </FormItem>
            )}
        />
    )
}

const CollapsibleCommandGroup: React.FC<CollapsibleCommandGroupProps> = ({
    options,
    field,
    onSelect,
}) => {
    const searchedOption = useCommandState((state) => state.search)

    if (!searchedOption) return null

    return (
        <div className="px-3">
            <div className="border-t border-primary">
                <CommandGroup>
                    <ScrollArea className="h-[190px]">
                        {options.map((option) => (
                            <CommandItem
                                className="text-primary hover:text-darkest aria-selected:bg-transparent aria-selected:font-bold"
                                key={option}
                                onSelect={(_currentValue: string) => {
                                    // ATTENTION:
                                    // Cannot use currentValue here, because CommandItem transforms values to lowercase and trims them.
                                    // This behaviour comes from the underlying 'cmdk' lib.
                                    onSelect(option, field)
                                }}
                            >
                                {option}
                            </CommandItem>
                        ))}
                    </ScrollArea>
                </CommandGroup>
                <CommandEmpty>
                    &apos;{searchedOption}&apos; does not exist yet.
                </CommandEmpty>
            </div>
        </div>
    )
}

export default AutocompleteInput
