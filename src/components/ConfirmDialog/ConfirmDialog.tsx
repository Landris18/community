import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack } from '@mui/material';
import "./ConfirmDialog.scss"


export default function ConfirmationDialog({ open, options }: { options: any, open: boolean }) {
    const { title, message, confirmText, btnClass, handleCloseDialog, handleConfirmDialog } = options;
    return (
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogContent>
                <Stack width={"100%"} direction={"row"} justifyContent={"end"} gap={1.2}>
                    <Button onClick={handleCloseDialog} className='secondary-button'>
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmDialog} variant='contained' className={btnClass}>
                        {confirmText}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}