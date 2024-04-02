import { useCommandState } from 'cmdk'
import { TransactionForm } from 'domain-model'
import React, { useRef, useState } from 'react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'

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
import { ScrollArea } from '../lib/shadcn/ScrollArea'
import { IconButton } from './Buttons'

type TagsManagerProps = {
    id: keyof TransactionForm
    form: UseFormReturn<any, any>
    label: string
    initialTags: string[]
}

type TagsCommandGroupProps = {
    options: string[]
    field: ControllerRenderProps<any, keyof TransactionForm>
    addTag: (
        option: string,
        field: ControllerRenderProps<any, keyof TransactionForm>
    ) => void
}

type TagProps = {
    tag: string
    removeTagHandler: () => void
}

const TagsManager: React.FC<TagsManagerProps> = (props) => {
    const { form, label, id, initialTags } = props

    const [currentTag, setCurrentTag] = useState<string>('')
    const [tagOptions, setTagOptions] = useState<string[]>(initialTags)

    const reset = () => {
        setCurrentTag('')
    }

    const addTag = (
        newTag: string,
        field: ControllerRenderProps<any, keyof TransactionForm>
    ) => {
        if (!newTag) return

        if (field.value.includes(newTag)) {
            reset()
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
        reset()
    }

    const removeTag = (
        tag: string,
        field: ControllerRenderProps<any, keyof TransactionForm>
    ) => {
        field.onChange(field.value.filter((t: string) => t !== tag))
    }

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>

                    <div className="flex justify-between gap-3">
                        <Command>
                            <CommandInput
                                onValueChange={setCurrentTag}
                                value={currentTag}
                                placeholder="Enter tag..."
                            />
                            <TagsCommandGroup
                                options={tagOptions}
                                field={field}
                                addTag={addTag}
                            />
                        </Command>

                        <IconButton
                            action="add"
                            clickHandler={() => {
                                if (!currentTag) {
                                    return
                                }
                                addTag(currentTag, field)
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3">
                        {field.value?.map((tag: string) => (
                            <Tag
                                key={tag}
                                tag={tag}
                                removeTagHandler={() => removeTag(tag, field)}
                            />
                        ))}
                    </div>
                </FormItem>
            )}
        />
    )
}

const TagsCommandGroup: React.FC<TagsCommandGroupProps> = ({
    options,
    field,
    addTag,
}) => {
    const searchedTag = useCommandState((state) => state.search)

    if (!searchedTag) return null

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
                                    addTag(option, field)
                                }}
                            >
                                {option}
                            </CommandItem>
                        ))}
                    </ScrollArea>
                </CommandGroup>
                <CommandEmpty>
                    Tag &apos;{searchedTag}&apos; does not exist yet.
                </CommandEmpty>
            </div>
        </div>
    )
}

const Tag: React.FC<TagProps> = ({ tag, removeTagHandler }) => {
    return (
        <Badge variant="outline">
            {tag}

            <Button
                className="text-parent h-auto w-10 bg-transparent text-sm font-bold no-underline transition-colors hover:bg-transparent hover:text-primary"
                size={'icon'}
                onClick={removeTagHandler}
            >
                X
            </Button>
        </Badge>
    )
}

export default TagsManager
