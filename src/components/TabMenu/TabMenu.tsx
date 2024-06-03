import * as React from 'react';
import moment from "moment";
import {
    Stack, styled, Box, Tab, Tabs, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody,
    FormControlLabel, Switch, alpha, CircularProgress, Button
} from '@mui/material';
import colors from '../../colors/colors';
import { CiCircleInfo } from "react-icons/ci";
import { formatNumber } from "../../utility/utility";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineFilterAltOff } from "react-icons/md";
import UserContext from '../../contexts/user/UserContext';
import CommonDialog from '../CommonDialog/CommonDialog';
import Service from '../../services/services';
import { toast } from 'react-toastify';
import "./TabMenu.scss";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    data?: any;
    valueSwitch?: boolean;
    changeSwitch?: Function;
    isLoading?: boolean
}

const StyledTab = styled(Tab)({
    "&.Mui-selected": {
        color: colors.dark
    }
});

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

const columns = [
    ["Date de paiement", "Membre", "Montant en MGA", "Mois concerné", "Mode de paiement"],
    ["Date", "Provenance", "Montant en MGA", "Raison"],
    ["Date", "Montant en MGA", "Raison"],
    ["Date d'emprunt", "Montant en MGA", "Reste à payer en MGA", "Débiteur", "Raison", "Statut"]
];

const DIALOG_ADD_COTISATION = "DIALOG_ADD_COTISATION";


const TabPanel = (props: TabPanelProps) => {
    const { user } = React.useContext(UserContext);

    const { value, index, data, valueSwitch, changeSwitch, isLoading } = props;
    const cols = columns[index];

    const [openDialogCommon, setOpenDialogCommon] = React.useState(false);
    const [dialogCommonOptions, setDialogCommonOptions] = React.useState<any>({});


    const handleOpenDialogCommon = (dialog: string) => {
        setOpenDialogCommon(true);
        if (dialog === DIALOG_ADD_COTISATION) {
            const options = {
                dialog: dialog,
                handleCloseDialog: handleCloseDialogCommon,
                handleConfirmDialog: addCotisations
            };
            setDialogCommonOptions(options);
        }
    };

    const handleCloseDialogCommon = () => { setOpenDialogCommon(false) };

    const addCotisations = async (cotisationsData: {
        membre_id: number, mode_paiement: string, montant: number, mois: string[], date_paiement: string, annee: number
    }) => {
        const moisAnnee = cotisationsData["mois"].map((mois: string) => mois + " " + cotisationsData["annee"]);
        const updatedCotisationsData = {
            membre_id: cotisationsData["membre_id"], mode_paiement: cotisationsData["mode_paiement"],
            montant: cotisationsData["montant"], date_paiement: cotisationsData["date_paiement"], lst_mois_annee: moisAnnee
        };
        await Service.addCotisations(updatedCotisationsData).then((res: any) => {
            toast.success(`Cotisations enregistrées ${res["success"]["saved"]}, ignorées ${res["success"]["ignored"]}`);
            setOpenDialogCommon(false);
        }).catch((_error: any) => {
            toast.error(_error?.response?.data?.error ?? "Impossible d'ajouter ces cotisations");
            setOpenDialogCommon(false);
        });
    };

    const getColorPaiement = (mode: string) => {
        if (mode === "Non payée") return colors.red;
        if (mode === "Autres") return colors.teal;
        if (mode === "Mvola") return colors.yellow;
        if (mode === "Orange") return colors.orange;
        if (mode === "En liquide") return colors.green;
    };

    const getColorStatus = (isPaye: number) => {
        if (isPaye === 0) return colors.red;
        if (isPaye === 1) return colors.green;
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {(() => {
                if (index === 0) {
                    return (
                        <Stack mt={1.5}>
                            <Stack width={"100%"} justifyContent={user?.is_admin === 1 ? "space-between" : "end"} direction={"row"}>
                                {
                                    user?.is_admin === 1 && (
                                        <Button variant='contained' className={`add-button`} startIcon={<AiOutlinePlus color={"white"} size={17} />}
                                            onClick={() => { handleOpenDialogCommon(DIALOG_ADD_COTISATION) }}
                                        >
                                            Cotisation
                                        </Button>
                                    )
                                }
                                <FormControlLabel control={<CustomSwitch size="small" checked={valueSwitch} onChange={changeSwitch as any} />} label={"Payées"} />
                            </Stack>
                            <Stack bgcolor={"#1976d204"}>
                                <TableContainer sx={{ maxHeight: 500 }} >
                                    <Table sx={{ minWidth: 550 }} aria-label="simple table" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    cols.map((col: string, ic: number) => (<TableCell key={col} align={ic === 0 ? "left" : "right"}>
                                                        {col}
                                                    </TableCell>))
                                                }
                                            </TableRow>
                                        </TableHead>
                                        {
                                            isLoading ? (
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell colSpan={5}>
                                                            <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} py={5}>
                                                                <CircularProgress size={60} sx={{ color: `${colors.teal}` }} value={70} variant="indeterminate" />
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : !isLoading && data?.length === 0 ? (
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell colSpan={5}>
                                                            <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} py={5} gap={0.6}>
                                                                <CiCircleInfo size={60} color={`${colors.teal}`} />
                                                                <h4 className='m-0 no-data-table' style={{ color: `${colors.teal}` }}>Aucun données à afficher</h4>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : Array.isArray(data) && (
                                                <TableBody>
                                                    {data?.map((row: any, i: number) => (
                                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row">
                                                                {row.date_paiement ? moment(row.date_paiement).format("DD-MM-YYYY") : "Aucun"}
                                                            </TableCell>
                                                            <TableCell align="right">{row.username}</TableCell>
                                                            <TableCell align="right">{row.montant ? formatNumber(row.montant) : "Aucun"}</TableCell>
                                                            <TableCell align="right">{row.mois ? row.mois + " " + row.annee : "Aucun"}</TableCell>
                                                            <TableCell align="right">
                                                                <Stack alignItems={"end"} justifyContent={"end"} >
                                                                    <Stack py={0.3} px={1.5} bgcolor={`${getColorPaiement(row.mode_paiement ?? "Non payée")}`} borderRadius={50}>
                                                                        <small style={{ color: `white`, fontSize: 12 }}>
                                                                            {row.mode_paiement ?? "Non payée"}
                                                                        </small>
                                                                    </Stack>
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            )
                                        }
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Stack>
                    );
                }
                if (index === 1) {
                    return (
                        <Stack mt={1.5}>
                            <Stack bgcolor={"#1976d204"}>
                                <TableContainer sx={{ maxHeight: 500 }} >
                                    <Table sx={{ minWidth: 550 }} aria-label="simple table" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    cols.map((col: string, ic: number) => (<TableCell key={col} align={ic === 0 ? "left" : "right"}>
                                                        {col}
                                                    </TableCell>))
                                                }
                                            </TableRow>
                                        </TableHead>
                                        {
                                            isLoading ? (
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell colSpan={4}>
                                                            <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} py={5}>
                                                                <CircularProgress size={60} sx={{ color: `${colors.teal}` }} value={70} variant="indeterminate" />
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : !isLoading && data?.length === 0 ? (
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell colSpan={4}>
                                                            <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} py={5} gap={0.6}>
                                                                <CiCircleInfo size={60} color={`${colors.teal}`} />
                                                                <h4 className='m-0 no-data-table' style={{ color: `${colors.teal}` }}>Aucun données à afficher</h4>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : Array.isArray(data) && (
                                                <TableBody>
                                                    {data?.map((row: any, i: number) => (
                                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row">
                                                                {moment(row.date_creation).format("DD-MM-YYYY")}
                                                            </TableCell>
                                                            <TableCell align="right">{row.provenance ?? "Aucun"}</TableCell>
                                                            <TableCell align="right">{formatNumber(row.montant)}</TableCell>
                                                            <TableCell align="right">{row.raison ?? "Aucun"}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            )
                                        }
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Stack>
                    );
                }
                if (index === 2) {
                    return (
                        <Stack mt={1.5}>
                            <Stack width={"100%"} alignItems={"end"}>
                                <FormControlLabel control={<CustomSwitch size="small" checked={valueSwitch} onChange={changeSwitch as any} />} label={"Paiement dette"} />
                            </Stack>
                            <Stack bgcolor={"#1976d204"}>
                                <TableContainer sx={{ maxHeight: 500 }} >
                                    <Table sx={{ minWidth: 550 }} aria-label="simple table" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    cols.map((col: string, ic: number) => (<TableCell key={col} align={ic === 0 ? "left" : "right"}>
                                                        {col}
                                                    </TableCell>))
                                                }
                                            </TableRow>
                                        </TableHead>
                                        {
                                            isLoading ? (
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell colSpan={3}>
                                                            <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} py={5}>
                                                                <CircularProgress size={60} sx={{ color: `${colors.teal}` }} value={70} variant="indeterminate" />
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : !isLoading && data?.length === 0 ? (
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell colSpan={3}>
                                                            <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} py={5} gap={0.6}>
                                                                <CiCircleInfo size={60} color={`${colors.teal}`} />
                                                                <h4 className='m-0 no-data-table' style={{ color: `${colors.teal}` }}>Aucun données à afficher</h4>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : Array.isArray(data) && (
                                                <TableBody>
                                                    {data?.map((row: any, i: number) => (
                                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row">
                                                                {moment(row.date_creation).format("DD-MM-YYYY")}
                                                            </TableCell>
                                                            <TableCell align="right">{formatNumber(row.montant)}</TableCell>
                                                            <TableCell align="right">{row.raison}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            )
                                        }
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Stack>
                    );
                }
                if (index === 3) {
                    return (
                        <Stack mt={1.5}>
                            <Stack width={"100%"} alignItems={"center"} direction={"row"} gap={0.7}>
                                <MdOutlineFilterAltOff color={colors.teal} size={20} />
                                <small className="lexend-light" style={{ fontSize: 13.5, color: colors.teal, fontStyle: "italic" }}>
                                    La liste des dettes n'est pas filtrée et ne peut pas être filtrée
                                </small>
                            </Stack>
                            <Stack bgcolor={"#1976d204"} mt={1}>
                                <TableContainer sx={{ maxHeight: 500 }} >
                                    <Table sx={{ minWidth: 550 }} aria-label="simple table" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    cols.map((col: string, ic: number) => (<TableCell key={col} align={ic === 0 ? "left" : "right"}>
                                                        {col}
                                                    </TableCell>))
                                                }
                                            </TableRow>
                                        </TableHead>
                                        {
                                            data?.length === 0 ? (
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell colSpan={5}>
                                                            <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} py={5} gap={0.6}>
                                                                <CiCircleInfo size={60} color={`${colors.teal}`} />
                                                                <h4 className='m-0 no-data-table' style={{ color: `${colors.teal}` }}>Aucun données à afficher</h4>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : Array.isArray(data) && (
                                                <TableBody>
                                                    {data?.map((row: any, i: number) => (
                                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row">
                                                                {moment(row.date_creation).format("DD-MM-YYYY")}
                                                            </TableCell>
                                                            <TableCell align="right">{formatNumber(row.montant)}</TableCell>
                                                            <TableCell align="right">{formatNumber(row.montant_reste)}</TableCell>
                                                            <TableCell align="right">{row.debiteur}</TableCell>
                                                            <TableCell align="right">{row.raison ?? "Aucune"}</TableCell>
                                                            <TableCell align="right">
                                                                <Stack alignItems={"end"} justifyContent={"end"} >
                                                                    <Stack py={0.3} px={1.5} bgcolor={`${getColorStatus(row.is_paye)}`} borderRadius={50}>
                                                                        <small style={{ color: `white`, fontSize: 12 }}>
                                                                            {row.is_paye > 0 ? "Remboursée" : "Non remboursée"}
                                                                        </small>
                                                                    </Stack>
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            )
                                        }
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Stack>
                    );
                }
            })()}
            <CommonDialog open={openDialogCommon} options={dialogCommonOptions} />
        </div>
    );
};


const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function TabMenu(props: any) {
    const { cotisations, revenus, depenses, dettes } = props;
    const { dataCotisations, valueSwitchCotisations, changeOnlyPaid, isLoadingCotisations } = cotisations;
    const { dataRevenus, isLoadingRevenus } = revenus;
    const { dataDepenses, valueSwitchDepenses, changeForDette, isLoadingDepenses } = depenses;
    const { dataDettes } = dettes;

    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box sx={{ width: '100%' }}>
            <Stack alignItems={"center"} width={"100%"}>
                <Tabs
                    value={value}
                    variant="scrollable" scrollButtons allowScrollButtonsMobile
                    onChange={handleChange}
                    TabIndicatorProps={{ style: { backgroundColor: colors.yellow } }}
                >
                    <StyledTab label="Cotisations" {...a11yProps(0)} className="tab-label" />
                    <StyledTab label="Revenus" {...a11yProps(1)} className="tab-label" />
                    <StyledTab label="Dépenses" {...a11yProps(2)} className="tab-label" />
                    <StyledTab label="Dettes" {...a11yProps(3)} className="tab-label" />
                </Tabs>
            </Stack>
            <TabPanel value={value} index={0} data={dataCotisations} valueSwitch={valueSwitchCotisations} changeSwitch={changeOnlyPaid} isLoading={isLoadingCotisations} />
            <TabPanel value={value} index={1} data={dataRevenus} isLoading={isLoadingRevenus} />
            <TabPanel value={value} index={2} data={dataDepenses} valueSwitch={valueSwitchDepenses} changeSwitch={changeForDette} isLoading={isLoadingDepenses} />
            <TabPanel value={value} index={3} data={dataDettes} />
        </Box>
    );
}