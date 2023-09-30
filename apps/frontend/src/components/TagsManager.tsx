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

        if (!tagOptions.includes(newTag)) {
            setTagOptions([...tagOptions, newTag])
        }
        resetInput()
    }

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <div className="gap-2 md:grid md:grid-cols-2">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    className="md:w-full"
                                    variant="secondary"
                                    type="button"
                                    size={'lg'}
                                >
                                    Add tag
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <div className="flex gap-2 ">
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
                                                className="text-muted-foreground hover:text-primary aria-selected:bg-transparent aria-selected:font-bold"
                                                key={tagOption}
                                                onSelect={(
                                                    currentValue: string
                                                ) => {
                                                    // ATTENTION:
                                                    // Cannot use currentValue here, because CommandItem transforms values to lowercase and trims them.
                                                    // This behaviour comes from the underlying 'cmdk' lib.
                                                    addTag(field, tagOption)
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
                    <div className="flex flex-wrap gap-2 pt-3">
                        {field.value?.map((tag: string) => (
                            <Badge
                                variant="outline"
                                key={tag}
                                className="flex h-10 w-auto items-center justify-between bg-background-overlay py-0.5 pl-4 pr-0 text-sm font-normal text-muted-foreground"
                            >
                                {tag}

                                <Button
                                    className="text-parent h-auto w-10 bg-transparent text-sm font-normal no-underline transition-colors hover:bg-transparent hover:text-primary"
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
