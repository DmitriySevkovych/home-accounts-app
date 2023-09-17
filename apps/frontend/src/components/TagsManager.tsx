import React, { useRef, useState } from 'react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'

import { NewTransactionForm } from '../helpers/zod-form-schemas'
import { Badge } from '../lib/shadcn/Badge'
import { Button } from '../lib/shadcn/Button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '../lib/shadcn/Command'
import { FormField, FormItem, FormLabel } from '../lib/shadcn/Form'
import { Input } from '../lib/shadcn/Input'
import { Popover, PopoverContent, PopoverTrigger } from '../lib/shadcn/Popover'

type TagsManagerProps = {
    id: keyof NewTransactionForm
    form: UseFormReturn<any, any, undefined>
    label: string
    initialTags: string[]
}

const TagsManager = (props: TagsManagerProps) => {
    const { form, label, id, initialTags } = props
    const commandInputRef = useRef<HTMLInputElement>(null)

    const [open, setOpen] = useState(false)
    const [tagOptions, setTagOptions] = useState<string[]>(initialTags)

    const resetInput = () => {
        if (commandInputRef.current) {
            commandInputRef.current.value = ''
        }
    }

    const addTag = (
        field: ControllerRenderProps<any, keyof NewTransactionForm>,
        newTag: string
    ) => {
        if (!newTag) return

        if (field.value.includes(newTag)) {
            resetInput()
            return
        }

        if (field.value) {
            field.onChange([...field.value, newTag])
        } else {
            field.onChange([newTag])
        }

        setTagOptions([...tagOptions, newTag])
        resetInput()
    }

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <div className="w-full flex gap-2">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <div className="flex flex-col gap-2 h-10 w-full rounded-md bg-background-overlay px-3 py-2 text-sm border-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-darkest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50">
                                    Add tags
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <div className="flex gap-2">
                                        <CommandInput
                                            ref={commandInputRef}
                                            placeholder="Search tag..."
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                if (!commandInputRef.current) {
                                                    return
                                                }
                                                const currentValue =
                                                    commandInputRef.current
                                                        .value
                                                addTag(field, currentValue)
                                            }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <CommandEmpty>
                                        Press &apos;+&apos; to add new tag.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {tagOptions.map((tagOption) => (
                                            <CommandItem
                                                key={tagOption}
                                                onSelect={(currentValue) => {
                                                    addTag(field, currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                {tagOption}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {field.value?.map((tag: string) => (
                            <Badge
                                variant="secondary"
                                key={tag}
                                className="w-auto flex justify-between text-white pl-4 pr-0 bg-secondary"
                            >
                                {tag}

                                <Button
                                    className="text-parent no-underline rounded-r-full"
                                    variant="link"
                                    size={'icon'}
                                    onClick={() => {
                                        field.onChange(
                                            field.value.filter(
                                                (t: string) => t !== tag
                                            )
                                        )
                                    }}
                                >
                                    X
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </FormItem>
            )}
        />
    )
}

export default TagsManager
