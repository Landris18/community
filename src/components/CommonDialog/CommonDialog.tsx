import "dayjs/locale/fr";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField, alpha, styled } from '@mui/material';
import MembresContext from '../../contexts/membres/MembresContext';
import DettesContext from "../../contexts/dettes/DettesContext";
import { MONTHS, getYearsBetween } from '../../utility/utility';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import colors from '../../colors/colors';


const DIALOG_PASSWORD = "DIALOG_PASSWORD";
const DIALOG_ADD_COTISATION = "DIALOG_ADD_COTISATION";
const DIALOG_ADD_DEPENSE = "DIALOG_ADD_DEPENSE";
const MODE_PAIEMENT = ["Mvola", "Orange", "En liquide", "Autres"];

const CustomSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: `${colors.blue} !important`,
        '&:hover': {
            backgroundColor: alpha(colors.blue, theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: `${colors.blue} !important`,
    },
}));


export default function CommonDialog({ open, options }: { open: boolean, options: any }) {
    const { membres } = useContext(MembresContext);
    const { dettes } = useContext(DettesContext);

    const { dialog, handleCloseDialog, handleConfirmDialog } = options;
    const [dataPass, setDataPass] = useState({ old_password: '', new_password: '', confirm_password: '' });
    const [dataCotisations, setDataCotisations] = useState(
        { membre_id: '', mode_paiement: '', montant: 5000, mois: [], date_paiement: new Date(), annee: new Date().getFullYear(), nb_retards: 0 }
    );
    const [dataDepense, setDataDepense] = useState({ montant: 0, raison: "", date_creation: new Date(), dette_id: "" });
    const [lstYears] = useState(getYearsBetween());
    const [isRemboursement, setIsRemboursement] = useState<boolean>(false);
    const [hasRetard, setHasRetard] = useState<boolean>(false);
    const [addCotisationsDisabled, setAddCotisationsDisabled] = useState(false);
    const [addDepenseDisabled, setAddDepenseDisabled] = useState(false);


    useEffect(() => {
        setAddCotisationsDisabled(false);
        setAddDepenseDisabled(false);
    }, [dataCotisations]);


    const handlePasswords = (pass: { key: string, value: string }) => {
        setDataPass({ ...dataPass, [pass.key]: pass.value });
    };

    const handleCotisations = async (data: { key: string, value: any }) => {
        setDataCotisations({ ...dataCotisations, [data.key]: data.value });
    };

    const handleDepense = async (data: { key: string, value: any }) => {
        setDataDepense({ ...dataDepense, [data.key]: data.value });
    };

    const isDataPassValid = () => {
        return (
            dataPass?.old_password?.length > 0 && dataPass?.new_password?.length > 0 && dataPass?.confirm_password?.length > 0
            && dataPass?.new_password === dataPass?.confirm_password
        );
    };

    const isDataCotisationsValid = () => {
        return (
            dataCotisations["membre_id"] !== "" && dataCotisations["mode_paiement"] !== "" && dataCotisations["montant"] >= 0
            && dataCotisations["mois"].length > 0
        );
    };

    const isDataDepenseValid = () => {
        if (isRemboursement) { if (!dataDepense["dette_id"]) return false; }
        return (
            dataDepense["raison"] !== "" && dataDepense["montant"] > 0
        );
    };

    const handleIsRemboursement = async (event: any) => {
        setIsRemboursement(event.target.checked);
    };

    const handleHasRetard = async (event: any) => {
        setHasRetard(event.target.checked);
    };

    const resetAllData = () => {
        setDataPass({ old_password: '', new_password: '', confirm_password: '' });
        setDataCotisations({ membre_id: '', mode_paiement: '', montant: 5000, mois: [], date_paiement: new Date(), annee: new Date().getFullYear(), nb_retards: 0 });
        setHasRetard(false);
        setDataDepense({ montant: 0, raison: "", date_creation: new Date(), dette_id: "" });
        setIsRemboursement(false);
    };

    console.log(dataCotisations);
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
                                    <Button onClick={() => { handleCloseDialog(); resetAllData() }} className={`secondary-button radius-0`}>
                                        Annuler
                                    </Button>
                                    <Button disabled={!isDataPassValid()} variant='contained' className={`${!isDataPassValid() ? 'secondary-button' : 'primary-button'} radius-0`}
                                        onClick={() => { handleConfirmDialog(dataPass); resetAllData() }}>
                                        Confirmer
                                    </Button>
                                </Stack>
                            </DialogContent>
                        </Dialog>
                    )
                }
                if (dialog === DIALOG_ADD_COTISATION) {
                    return (
                        <Dialog open={open} onClose={handleCloseDialog}>
                            <DialogTitle>
                                Nouvelles cotisations
                            </DialogTitle>
                            <DialogContent>
                                <Stack mt={1} gap={2} width={"100%"}>
                                    <FormControl sx={{ width: "35%", ml: 0.6 }}>
                                        <FormControlLabel
                                            control={<CustomSwitch size="small" checked={hasRetard} onChange={handleHasRetard} />}
                                            label={"Retard de paiement"}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Membre</InputLabel>
                                        <Select
                                            value={dataCotisations["membre_id"]}
                                            label="Membre"
                                            onChange={(event) => handleCotisations({ key: "membre_id", value: event?.target.value })}
                                        >
                                            {
                                                membres.map((mb: any) => (
                                                    <MenuItem key={mb?.id} value={mb?.id}>{mb?.username}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    {
                                        hasRetard && (
                                            <FormControl fullWidth>
                                                <TextField label={"Nombre de mois de retard"} variant="outlined" type='number'
                                                    value={dataCotisations["nb_retards"]} onChange={(event) => handleCotisations({ key: "nb_retards", value: parseInt(event?.target.value) })}
                                                />
                                            </FormControl>
                                        )
                                    }
                                    <Stack direction={"row"} gap={1.5} alignItems={"center"}>
                                        <FormControl sx={{ width: 300 }}>
                                            <TextField label={"Montant"} variant="outlined" type='number'
                                                value={dataCotisations["montant"]} onChange={(event) => handleCotisations({ key: "montant", value: parseInt(event?.target.value) })}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ width: 300 }}>
                                            <InputLabel>Mode de paiement</InputLabel>
                                            <Select
                                                value={dataCotisations["mode_paiement"]}
                                                label="Mode de paiement"
                                                onChange={(event) => handleCotisations({ key: "mode_paiement", value: event?.target.value })}
                                            >
                                                {
                                                    MODE_PAIEMENT.map((md: any) => (
                                                        <MenuItem key={md} value={md}>{md}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <Stack direction={"row"} gap={1.5} alignItems={"center"}>
                                        <FormControl sx={{ width: 300 }}>
                                            <InputLabel>Mois</InputLabel>
                                            <Select
                                                multiple
                                                value={dataCotisations["mois"]}
                                                label="Mois"
                                                onChange={(event) => handleCotisations({ key: "mois", value: event?.target.value })}
                                            >
                                                {
                                                    MONTHS?.map((month: string) => (
                                                        <MenuItem key={month} value={month}>{month}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl sx={{ width: 300 }}>
                                            <InputLabel>Annee</InputLabel>
                                            <Select
                                                value={dataCotisations["annee"]}
                                                label="Annee"
                                                onChange={(event) => handleCotisations({ key: "annee", value: event?.target.value })}
                                            >
                                                {
                                                    lstYears.map((an: number) => (
                                                        <MenuItem key={an} value={an}>{an}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <LocalizationProvider adapterLocale="fr" dateAdapter={AdapterDayjs}>
                                        <FormControl fullWidth>
                                            <DatePicker
                                                label="Date de paiement"
                                                value={dayjs(dataCotisations["date_paiement"])}
                                                minDate={dayjs('2024-02-01')}
                                                maxDate={dayjs(new Date())}
                                                onChange={(value: any) => handleCotisations({ key: "date_paiement", value: dayjs(value).format("YYYY-MM-DD") })}
                                            />
                                        </FormControl>
                                    </LocalizationProvider>
                                </Stack>
                            </DialogContent>
                            <DialogContent>
                                <Stack width={"100%"} direction={"row"} justifyContent={"end"} gap={1.2}>
                                    <Button onClick={() => { handleCloseDialog(); resetAllData() }} className={`secondary-button radius-0`}>
                                        Annuler
                                    </Button>
                                    <Button disabled={!isDataCotisationsValid() || addCotisationsDisabled} variant='contained' className={`${!isDataCotisationsValid() || addCotisationsDisabled ? 'secondary-button' : 'primary-button'} radius-0`}
                                        onClick={() => { handleConfirmDialog(dataCotisations); setAddCotisationsDisabled(true) }}>
                                        Confirmer
                                    </Button>
                                </Stack>
                            </DialogContent>
                        </Dialog>
                    )
                }
                if (dialog === DIALOG_ADD_DEPENSE) {
                    return (
                        <Dialog open={open} onClose={handleCloseDialog}>
                            <DialogTitle>
                                Nouvelle dépense
                            </DialogTitle>
                            <DialogContent>
                                <Stack mt={1} gap={2} width={"100%"}>
                                    <FormControl sx={{ width: "70%", ml: 0.6 }}>
                                        <FormControlLabel
                                            control={<CustomSwitch size="small" checked={isRemboursement} onChange={handleIsRemboursement} />}
                                            label={"Remboursement dette"}
                                        />
                                    </FormControl>
                                    {
                                        isRemboursement && (
                                            <FormControl fullWidth>
                                                <InputLabel>Dette</InputLabel>
                                                <Select
                                                    value={dataDepense["dette_id"]}
                                                    label="Dette"
                                                    onChange={(event) => handleDepense({ key: "dette_id", value: event?.target.value })}
                                                >
                                                    {
                                                        dettes.map((dt: any) => (
                                                            <MenuItem key={dt?.id} value={dt?.id}>{dt?.raison} de {dt?.debiteur}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        )
                                    }
                                    <Stack direction={"row"} gap={1.5} alignItems={"center"}>
                                        <FormControl sx={{ width: 300 }}>
                                            <TextField label={"Montant"} variant="outlined" type='number'
                                                value={dataDepense["montant"]} onChange={(event) => handleDepense({ key: "montant", value: event?.target.value ? parseInt(event?.target.value) : "" })}
                                            />
                                        </FormControl>
                                    </Stack>
                                    <Stack direction={"row"} gap={1.5} alignItems={"center"}>
                                        <FormControl sx={{ width: 300 }}>
                                            <TextField label={"Raison"} variant="outlined" type='text'
                                                value={dataDepense["raison"]} onChange={(event) => handleDepense({ key: "raison", value: event?.target.value })}
                                            />
                                        </FormControl>
                                    </Stack>
                                    <LocalizationProvider adapterLocale="fr" dateAdapter={AdapterDayjs}>
                                        <FormControl fullWidth>
                                            <DatePicker
                                                label="Date"
                                                value={dayjs(dataDepense["date_creation"])}
                                                minDate={dayjs('2024-02-01')}
                                                maxDate={dayjs(new Date())}
                                                onChange={(value: any) => handleDepense({ key: "date_creation", value: dayjs(value).format("YYYY-MM-DD") })}
                                            />
                                        </FormControl>
                                    </LocalizationProvider>
                                </Stack>
                            </DialogContent>
                            <DialogContent>
                                <Stack width={"100%"} direction={"row"} justifyContent={"end"} gap={1.2}>
                                    <Button onClick={() => { handleCloseDialog(); resetAllData() }} className={`secondary-button radius-0`}>
                                        Annuler
                                    </Button>
                                    <Button disabled={!isDataDepenseValid() || addDepenseDisabled} variant='contained' className={`${!isDataDepenseValid() || addCotisationsDisabled ? 'secondary-button' : 'primary-button'} radius-0`}
                                        onClick={() => { handleConfirmDialog(dataDepense); setAddDepenseDisabled(true) }}>
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