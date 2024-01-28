import { Button } from '../lib/shadcn/Button'
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Dialog as ShadcnDialog,
} from '../lib/shadcn/Dialog'

export const Dialog: React.FC = (props) => {
    return (
        <ShadcnDialog>
            <DialogTrigger>
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
                </DialogHeader>
            </DialogContent>
        </ShadcnDialog>
    )
}
