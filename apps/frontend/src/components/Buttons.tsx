import { ArrowLeft, Minus, Plus } from 'lucide-react'
import React from 'react'

import { Button } from '../lib/shadcn/Button'

type IconButtonProps = {
    action: 'back' | 'delete' | 'add'
    clickHandler?: () => void
}

const ICONSIZE = 18

export const IconButton = ({ action, clickHandler }: IconButtonProps) => {
    let icon
    if (action === 'back') {
        icon = <ArrowLeft size={ICONSIZE} />
    } else if (action === 'delete') {
        icon = <Minus size={ICONSIZE} />
    } else if (action === 'add') {
        icon = <Plus size={ICONSIZE} />
    }

    return (
        <Button
            className="min-w-[40px] p-0"
            variant="secondary"
            type="button"
            onClick={clickHandler}
        >
            {icon}
        </Button>
    )
}
