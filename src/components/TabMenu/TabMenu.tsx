import moment from "moment";
import * as React from 'react';
import {
    Stack, styled, Box, Tab, Tabs, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody,
    InputLabel, Select, FormControl, MenuItem, FormControlLabel, Switch, alpha
} from '@mui/material';
import colors from '../../colors/colors';
import { MONTHS } from '../../utility/utility';
import "./TabMenu.scss";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    data?: any;
    valueInput?: string;
    valueSwitch?: boolean;
    changeMois?: Function;
    changeOnlyPaid?: Function;
    isLoading?: boolean
}

const StyledTab = styled(Tab)({
    "&.Mui-selected": {
        color: colors.dark
    }
});

const PinkSwitch = styled(Switch)(({ theme }) => ({
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
    ["Date de paiement", "Membre", "Montant en MGA", "Mois concerné", "Mode de paiement"]
];

const TabPanel = (props: TabPanelProps) => {
    const { value, index, data, valueInput, valueSwitch, changeMois, changeOnlyPaid } = props;
    const cols = columns[index];

    const getColorPaiement = (mode: string) => {
        if (mode === "Non payé") {
            return colors.red;
        }
        if (mode === "Autres") {
            return colors.teal;
        }
        if (mode === "Mvola") {
            return colors.yellow;
        }
        if (mode === "Orange Money") {
            return colors.orange;
        }
        if (mode === "En liquide") {
            return colors.green;
        }
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            <Stack mt={1.5}>
                <Stack direction={"row"} width={"100%"} justifyContent={"start"} alignItems={"center"} gap={2}>
                    <FormControl size="small">
                        <InputLabel>Mois</InputLabel>
                        <Select
                            value={valueInput ?? ""}
                            label="Mois"
                            onChange={changeMois as any}
                        >
                            {
                                MONTHS.map((mo: string) => (
                                    <MenuItem key={mo} value={mo}>{mo}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControlLabel control={<PinkSwitch checked={valueSwitch} onChange={changeOnlyPaid as any} />} label="Payée seulement" />
                </Stack>
                <Stack bgcolor={"#e1e6ec20"}>
                    <TableContainer sx={{ maxHeight: 450 }} >
                        {(() => {
                            if (index === 0) {
                                return (
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    cols.map((col: string, ic: number) => (<TableCell key={col} align={ic === 0 ? "left" : "right"}>
                                                        {col}
                                                    </TableCell>))
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data?.map((row: any, i: number) => (
                                                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        {row.date_paiement ? moment(row.date_paiement).format("DD-MM-YYYY") : "Aucun"}
                                                    </TableCell>
                                                    <TableCell align="right">{row.username}</TableCell>
                                                    <TableCell align="right">{row.montant ?? "Aucun"}</TableCell>
                                                    <TableCell align="right">{row.mois ? row.mois + " " + row.annee : "Aucun"}</TableCell>
                                                    <TableCell align="right">
                                                        <Stack alignItems={"end"} justifyContent={"end"} >
                                                            <Stack py={0.5} px={1.5} bgcolor={`${getColorPaiement(row.mode_paiement ?? "Non payé")}20`} borderRadius={50}>
                                                                <small style={{ color: `${getColorPaiement(row.mode_paiement ?? "Non payé")}`, letterSpacing: 0.5, fontSize: 12.5 }}>
                                                                    {row.mode_paiement ?? "Non payé"}
                                                                </small>
                                                            </Stack>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                );
                            }
                        })()}
                    </TableContainer>
                </Stack>
            </Stack>
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
    const { cotisations } = props;
    const { data, valueInput, valueSwitch, changeMois, changeOnlyPaid, isLoading } = cotisations;

    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stack alignItems={"end"} width={"100%"}>
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
            <TabPanel value={value} index={0} data={data} valueInput={valueInput} valueSwitch={valueSwitch} changeOnlyPaid={changeOnlyPaid} changeMois={changeMois} isLoading={isLoading} />
            <TabPanel value={value} index={1} />
            <TabPanel value={value} index={2} />
            <TabPanel value={value} index={3} />
        </Box>
    );
}