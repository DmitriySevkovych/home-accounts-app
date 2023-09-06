import React, { useState } from 'react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'

import { NewTransactionForm } from '../helpers/zod-form-schemas'
import { Badge } from '../lib/shadcn/Badge'
import { Button } from '../lib/shadcn/Button'
import { FormField, FormItem, FormLabel } from '../lib/shadcn/Form'
import { Input } from '../lib/shadcn/Input'

type TagsProps = {
    id: keyof NewTransactionForm
    form: UseFormReturn<any, any, undefined>
    label: string
}

const Tags = (props: TagsProps) => {
    const [newTag, setNewTag] = useState<string>('')

    const { form, label, id } = props

    const resetInput = () => setNewTag('')

    const addTag = (
        field: ControllerRenderProps<any, keyof NewTransactionForm>
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
                        <Input
                            onChange={(e) => setNewTag(e.target.value)}
                            value={newTag}
                            placeholder="Next tag..."
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => addTag(field)}
                        >
                            +
                        </Button>
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

export default Tags
