import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, Stack, TextField } from '@mui/material';
import colors from '../../colors/colors';

const DIALOG_PASSWORD = "DIALOG_PASSWORD";


export default function CommonDialog({ open, options }: { options: any, open: boolean }) {
    const { dialog, handleCloseDialog, handleConfirmDialog } = options;
    const [dataPass, setDataPass] = useState({ old_password: '', new_password: '', confirm_password: '' });

    const handlePasswords = (pass: { key: string, value: string }) => {
        setDataPass({ ...dataPass, [pass.key]: pass.value });
    };

    const isDataPassValid = () => {
        return (
            dataPass?.old_password?.length > 0 && dataPass?.new_password?.length > 0 && dataPass?.confirm_password?.length > 0
            && dataPass?.new_password === dataPass?.confirm_password
        )
    };

    return (
        <>
            {(() => {
                if (dialog === DIALOG_PASSWORD) {
                    return (
                        <Dialog open={open} onClose={handleCloseDialog}>
                            <DialogTitle>
                                Changement de mot de passe
                            </DialogTitle>
                            <DialogContent>
                                <Stack mt={1} gap={2}>
                                    <h5 style={{ marginTop: 0, color: colors.teal }}>
                                        Cette action va vous déconnecter de tous les appareils actifs.
                                    </h5>
                                    <FormControl fullWidth>
                                        <TextField label={"Mot de passe actuel"} type="password" variant="outlined"
                                            value={dataPass.old_password} onChange={(event) => handlePasswords({ key: "old_password", value: event?.target.value })}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextField label={"Nouveau mot de passe"} type="password" variant="outlined"
                                            value={dataPass.new_password} onChange={(event) => handlePasswords({ key: "new_password", value: event?.target.value })}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextField label={"Confirmer nouveau mot de passe"} type="password" variant="outlined"
                                            value={dataPass.confirm_password} onChange={(event) => handlePasswords({ key: "confirm_password", value: event?.target.value })}
                                        />
                                    </FormControl>
                                </Stack>
                            </DialogContent>
                            <DialogContent>
                                <Stack width={"100%"} direction={"row"} justifyContent={"end"} gap={1.2}>
                                    <Button onClick={() => { handleCloseDialog(); setDataPass({ old_password: '', new_password: '', confirm_password: '' }) }} className={`secondary-button radius-0`}>
                                        Annuler
                                    </Button>
                                    <Button disabled={!isDataPassValid()} variant='contained' className={`${!isDataPassValid() ? 'secondary-button' : 'primary-button'} radius-0`}
                                        onClick={() => { handleConfirmDialog(dataPass); setDataPass({ old_password: '', new_password: '', confirm_password: '' }) }}>
                                        Confirmer
                                    </Button>
                                </Stack>
                            </DialogContent>
                        </Dialog>
                    )
                }
            })()}
        </>
    );
}