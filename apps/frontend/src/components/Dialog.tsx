import { Button } from '../lib/shadcn/Button'
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Dialog as ShadcnDialog,
} from '../lib/shadcn/Dialog'

type DeleteDialogProps = {
    onConfirm: any
    children: React.ReactNode
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
    onConfirm,
    children,
}) => {
    return (
        <ShadcnDialog>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your transaction.
                    </DialogDescription>
                    <Button variant="primary" onClick={onConfirm}>
                        Yes, delete
                    </Button>
                </DialogHeader>
            </DialogContent>
        </ShadcnDialog>
    )
}
