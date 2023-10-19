import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type FileWithPath = File & { path?: string }

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
