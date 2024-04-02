import { TransactionForm } from 'domain-model'
import React, { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'

import { FileWithPath } from '../helpers/utils'
import { FormField, FormItem, FormLabel, FormMessage } from '../lib/shadcn/Form'

type DropzoneProps = {
    field: ControllerRenderProps<any, keyof TransactionForm>
}

const Dropzone = (props: DropzoneProps) => {
    const { field } = props

    const [file, setFile] = useState<FileWithPath | undefined>(undefined)

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            if (acceptedFiles) {
                setFile(acceptedFiles[0])
                field.onChange(acceptedFiles[0])
            }
        },
        [field]
    )

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'application/pdf': [],
        },
        maxFiles: 1,
    })

    const dropzoneStyle = useMemo(() => {
        const baseStyle =
            'dropzone h-[75px] text-center border border-darkest border-dashed rounded-md flex items-center justify-center transition ease-in-out transition-colors'
        if (isFocused) {
            return `${baseStyle} bg-background-overlay`
        } else if (isDragAccept) {
            return `${baseStyle} border-none bg-background-overlay`
        } else if (isDragReject) {
            return `${baseStyle} border-2 border-primary`
        } else if (file) {
            return `${baseStyle} border-none bg-background-overlay`
        } else {
            return `${baseStyle} border-secondary`
        }
    }, [isFocused, isDragAccept, isDragReject, file])

    return (
        <>
            <div
                {...getRootProps({
                    className: dropzoneStyle,
                })}
            >
                <input {...getInputProps()} />
                <p className="text-sm font-medium text-primary">
                    {file ? '📃 Dropped' : "Drop it like it's hot"}
                </p>
            </div>
            {file && (
                <aside>
                    <p className="text-sm font-medium text-primary">
                        Selected file: {file.name}
                    </p>
                </aside>
            )}
        </>
    )
}

type DropzoneFormFieldProps = {
    form: UseFormReturn<any, keyof TransactionForm>
    label: string
    id: keyof TransactionForm
}

export const DropzoneFormField = (props: DropzoneFormFieldProps) => {
    const { form, label, id } = props

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Dropzone field={field} />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
