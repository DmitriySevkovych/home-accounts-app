import { ArrowLeft, Eraser, Minus, Plus } from 'lucide-react'
import React from 'react'

import { Button } from '../lib/shadcn/Button'

type IconButtonProps = {
    action: 'back' | 'delete' | 'add' | 'clear'
    variant?:
        | 'default'
        | 'primary'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
        | 'destructive'
        | null
        | undefined
    clickHandler?: () => void
}

const ICONSIZE = 18

export const IconButton = ({
    action,
    variant,
    clickHandler,
}: IconButtonProps) => {
    let icon
    if (action === 'back') {
        icon = <ArrowLeft size={ICONSIZE} />
    } else if (action === 'delete') {
        icon = <Minus size={ICONSIZE} />
    } else if (action === 'add') {
        icon = <Plus size={ICONSIZE} />
    } else if (action === 'clear') {
        icon = <Eraser size={ICONSIZE} />
    }

    return (
        <Button
            className="min-w-[40px] rounded-md p-0"
            variant={variant || 'secondary'}
            type="button"
            onClick={clickHandler}
        >
            {icon}
        </Button>
    )
}
