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
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({ onConfirm }) => {
    return (
        <ShadcnDialog>
            <DialogTrigger className="flex w-full">
                <Button
                    className="flex w-full md:ml-auto md:mr-0 md:w-auto lg:col-span-2"
                    variant="secondary"
                    type="button"
                    size={'lg'}
                >
                    Delete
                </Button>
            </DialogTrigger>

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
