import 'chart.js/auto';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
    Avatar, Divider, IconButton, Stack, Menu, Toolbar, Grid,
    Button, FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import communityLogoDark from "../../assets/images/community-dark.svg";
import { LuBarChart2 } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi2";
import colors from '../../colors/colors';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import { GiReceiveMoney } from "react-icons/gi";
import { BiLogOut } from "react-icons/bi";
import { TbMoneybag } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";
import CustomTooltip from '../../components/CustomTooltip/CustomTooltip';
import ConfirmationDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { MONTHS, removeToken } from '../../utility/utility';
import { useNavigate } from 'react-router-dom';
import { useQueries } from 'react-query';
import Service from '../../services/services';
import Toastr from '../../components/Toastr/Toastr';
import { toast } from 'react-toastify';
import LoadingGlobal from '../../components/LoadingGlobal/LoadingGlobal';
import TabMenu from '../../components/TabMenu/TabMenu';
import './Dashboard.scss';


const drawerWidth = 100;
const drawerWidthRight = 450;

Chart.register(ArcElement, Tooltip, Legend);
Chart.defaults.font.family = "lexend";
Chart.defaults.plugins.legend.position = "bottom";

const DIALOG_DECONNEXION = "DIALOG_DECONNEXION";
const TRANSACTIONS = "TRANSACTIONS";


const getYearsBetween = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const years = [];

    for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
    }

    return years;
};


export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [activeMenu, setActiveMenu] = useState(TRANSACTIONS);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogOptions, setDialogOptions] = useState<any>({});
    const [allQueriesLoaded, setAllQueriesLoaded] = useState(false);
    const [totals, setTotals] = useState<any>({});
    const [stats, setStats] = useState<any>({});
    const [membres, setMembres] = useState<any>();
    const [cotisations, setCotisations] = useState<any>({});
    const [revenus, setRevenus] = useState<any>({});
    const [depenses, setDepenses] = useState<any>({});
    const [lstYears] = useState(getYearsBetween());
    const [loadingRefetch, setLoadingRefetch] = useState<boolean>(false);
    const [loadingRefetchTab, setLoadingRefetchTab] = useState<boolean>(false);
    const [loadingRefetchCotisations, setLoadingRefetchCotisations] = useState<boolean>(false);
    const [loadingRefetchDepenses, setLoadingRefetchDepenses] = useState<boolean>(false);


    // Global filters
    const [anneeGlobal, setAnneeGlobal] = useState(new Date().getFullYear());
    let anneeFilterGlobal = anneeGlobal;
    const [moisGlobal, setMoisGlobal] = useState(MONTHS[new Date().getMonth()]);
    let moisFilterGlobal = moisGlobal;

    // Cotisations filter
    const [onlyPaid, setOnlyPaid] = useState(false);
    let onlyPaidFilter = onlyPaid;

    const [forDette, setForDette] = useState(false);
    let forDetteFilter = onlyPaid;


    /**
     * Stuffs for queries
    */
    const queries = [
        {
            queryKey: 'totals',
            retry: false,
            refetch: false,
            queryFn: () => Service.getTotals(),
            onSuccess: (data: any) => {
                setTotals(data.success);
            },
            onError: () => {
                toast.error("Problème de récupération des totals");
            }
        },
        {
            queryKey: 'stats',
            retry: false,
            refetch: false,
            queryFn: () => Service.getStats(anneeFilterGlobal),
            onSuccess: (data: any) => {
                setStats(data.success);
            },
            onError: () => {
                toast.error("Problème de récupération des stats");
            }
        },
        {
            queryKey: 'cotisations',
            retry: false,
            refetch: false,
            queryFn: () => Service.getCotisations(anneeFilterGlobal, moisFilterGlobal, onlyPaidFilter),
            onSuccess: (data: any) => {
                setCotisations(data.success.cotisations);
            },
            onError: () => {
                toast.error("Problème de récupération des cotisations");
            }
        },
        {
            queryKey: 'revenus',
            retry: false,
            refetch: false,
            queryFn: () => Service.getRevenus(anneeFilterGlobal, moisFilterGlobal),
            onSuccess: (data: any) => {
                setRevenus(data.success.revenus);
            },
            onError: () => {
                toast.error("Problème de récupération des revenus");
            }
        },
        {
            queryKey: 'depenses',
            retry: false,
            refetch: false,
            queryFn: () => Service.getDepenses(anneeFilterGlobal, moisFilterGlobal, forDetteFilter),
            onSuccess: (data: any) => {
                setDepenses(data.success.depenses);
            },
            onError: () => {
                toast.error("Problème de récupération des dépenses");
            }
        },
        {
            queryKey: 'membres',
            retry: false,
            refetch: false,
            queryFn: () => Service.getMembres(),
            onSuccess: (data: any) => {
                setMembres(data.success);
            },
            onError: () => {
                toast.error("Problème de récupération des membres");
            }
        },
    ];
    const queryResults = useQueries(queries);

    /**
     * useEffects
    */
    useEffect(() => {
        const allLoaded = queryResults.every(result => !result.isLoading);
        if (allLoaded) {
            setAllQueriesLoaded(true);
        }
    }, [queryResults]);

    /**
     * Some functions
    */
    const handleOpenDialog = (dialog: string) => {
        setOpenDialog(true);
        if (dialog === DIALOG_DECONNEXION) {
            const options = {
                title: 'Déconnexion',
                message: 'Voulez-vous vraiment vous déconnecter de community ?',
                confirmText: "Me déconnecter",
                btnClass: "danger-button",
                handleCloseDialog: handleCloseDialog,
                handleConfirmDialog: logout
            };
            setDialogOptions(options);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    const logout = () => {
        removeToken();
        navigate("/", { replace: true });
    }

    const formatNumber = (number: number) => {
        return number?.toLocaleString().replace(/,/g, ' ');
    }

    const getStatus = () => {
        if (totals.total_dettes > totals.total_soldes_reel) {
            return { status: "Endetté", colors: colors.red }
        }
        if (totals.total_dettes === totals.total_soldes_reel) {
            return { status: "Stable", colors: colors.blue }
        }
        if (totals.total_dettes < totals.total_soldes_reel) {
            return { status: "En croissance", colors: colors.green }
        }
    }

    const getMonth = (obj: any) => {
        return obj?.map((ob: any) => MONTHS[ob.mois - 1] || '');
    };

    const extractTotalMontant = (obj: any) => {
        return obj?.map((ob: any) => ob.totalMontant || 0);
    };

    const handleChangeAnneeGlobal = async (event: any) => {
        if (anneeGlobal !== event.target.value) {
            anneeFilterGlobal = event.target.value;
            setAnneeGlobal(event.target.value);
            setLoadingRefetch(true);
            await queryResults[1].refetch();
            await queryResults[2].refetch();
            setLoadingRefetch(false);
        }
    };

    const handleMoisChange = async (event: any) => {
        if (moisGlobal !== event.target.value) {
            moisFilterGlobal = event.target.value;
            setMoisGlobal(event.target.value);
            setLoadingRefetchTab(true);
            await queryResults[2].refetch();
            await queryResults[3].refetch();
            await queryResults[4].refetch();
            setLoadingRefetchTab(false);
        }
    };

    const handleOnlyPaidChange = async (event: any) => {
        if (onlyPaid !== event.target.checked) {
            onlyPaidFilter = event.target.checked;
            setOnlyPaid(event.target.checked);
            setLoadingRefetchCotisations(true);
            await queryResults[2].refetch();
            setLoadingRefetchCotisations(false);
        }
    };

    const handleForDetteChange = async (event: any) => {
        if (forDette !== event.target.checked) {
            forDetteFilter = event.target.checked;
            setForDette(event.target.checked);
            setLoadingRefetchDepenses(true);
            await queryResults[4].refetch();
            setLoadingRefetchDepenses(false);
        }
    };

    /**
     * Charts
    */
    const totalsChartData = {
        labels: ['Solde comptable', 'Dette', totals.total_soldes_reel >= 0 ? 'Solde réel' : null].filter(item => item !== null),
        datasets: [
            {
                data: [totals.total_soldes, totals.total_dettes, totals.total_soldes_reel >= 0 ? totals.total_soldes_reel : null].filter(item => item !== null),
                backgroundColor: [`${colors.blue}`, `${colors.yellow}`, `${colors.teal}`],
                hoverBorderColor: "white"
            },
        ]
    };

    const statsChartData = {
        labels: getMonth(stats.cotisations),
        datasets: [
            {
                label: 'Revenu total',
                data: extractTotalMontant(stats.revenus_total),
                backgroundColor: colors.blue,
            },
            {
                label: 'Dette',
                data: extractTotalMontant(stats.dettes),
                backgroundColor: colors.yellow,
            },
            {
                label: 'Dépense',
                data: extractTotalMontant(stats.depenses),
                backgroundColor: colors.red,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += `${formatNumber(context.parsed.y)} Ar`;
                        }
                        return label;
                    }
                }
            }
        },
    };

    return (
        <>
            {
                !allQueriesLoaded ? (
                    <LoadingGlobal />
                ) : (
                    <Box sx={{ display: 'flex' }}>
                        <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }} variant="permanent" anchor="left">
                            <Stack width={"100%"} alignItems={"center"} gap={15} mt={4}>
                                <Stack bgcolor={colors.dark} p={0.5} borderRadius={50}>
                                    <Box component={"img"} src={communityLogoDark} width={28} />
                                </Stack>
                                <Stack alignItems={"center"} gap={5}>
                                    <CustomTooltip title={"Transactions"}>
                                        <IconButton onClick={() => setActiveMenu(TRANSACTIONS)}>
                                            <LuBarChart2 className='cursor-pointer' size={25} color={activeMenu === TRANSACTIONS ? colors.dark : `${colors.dark}60`} />
                                        </IconButton>
                                    </CustomTooltip>
                                    <CustomTooltip title={"Membres"}>
                                        <IconButton onClick={() => setActiveMenu("info")}>
                                            <HiOutlineUsers className='cursor-pointer' size={25} color={activeMenu !== TRANSACTIONS ? colors.dark : `${colors.dark}60`} />
                                        </IconButton>
                                    </CustomTooltip>
                                </Stack>
                            </Stack>
                        </Drawer>
                        {(() => {
                            if (activeMenu === TRANSACTIONS) {
                                return (
                                    <Box id='main' component="main" sx={{ flexGrow: 1, bgcolor: '#fbfbfb', px: 10, pt: 4, overflowY: "scroll" }} height={"100vh"}>
                                        <Stack width={"100%"}>
                                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"end"}>
                                                <Stack>
                                                    <h1 className='m-0 lexend-bold'>Transactions</h1>
                                                    <small style={{ color: `${colors.dark}99` }}>Vous pouvez voir ici nos transactions</small>
                                                </Stack>
                                                <FormControl size="small">
                                                    <InputLabel>Année</InputLabel>
                                                    <Select
                                                        value={anneeGlobal}
                                                        label="Année"
                                                        onChange={handleChangeAnneeGlobal}
                                                    >
                                                        {
                                                            lstYears.map((year: number) => (
                                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Stack>
                                            <Stack p={3} borderRadius={4} bgcolor={"white"} mt={3} gap={4.5}>
                                                <h4 className='m-0'>Statistique des transactions </h4>
                                                {
                                                    loadingRefetch ? (
                                                        <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} pb={5}>
                                                            <CircularProgress size={60} sx={{ color: `${colors.teal}` }} value={70} variant="indeterminate" />
                                                        </Stack>
                                                    ) : !loadingRefetch && stats?.revenus_total?.length > 0 ? (
                                                        <Bar id='stats-chart' options={options} data={statsChartData} />
                                                    ) : (
                                                        <Stack width={"100%"} justifyContent={"center"} alignItems={"center"} pb={5} gap={0.6}>
                                                            <CiCircleInfo size={60} color={`${colors.teal}`} />
                                                            <h4 className='m-0' style={{ color: `${colors.teal}` }}>Aucun données pour l'année {anneeGlobal}</h4>
                                                        </Stack>
                                                    )
                                                }
                                            </Stack>
                                            <Stack p={3} borderRadius={4} bgcolor={"white"} mt={3} mb={4} gap={1}>
                                                <Stack direction={"row"} alignItems={"start"} justifyContent={"space-between"}>
                                                    <h4 className='m-0'>Suivi financier </h4>
                                                    <FormControl size="small">
                                                        <InputLabel>Mois</InputLabel>
                                                        <Select
                                                            value={moisGlobal}
                                                            label="Mois"
                                                            onChange={handleMoisChange}
                                                        >
                                                            {
                                                                MONTHS.map((mo: string) => (
                                                                    <MenuItem key={mo} value={mo}>{mo}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Stack>
                                                <TabMenu
                                                    cotisations={
                                                        { dataCotisations: cotisations, valueSwitchCotisations: onlyPaid, changeOnlyPaid: handleOnlyPaidChange, isLoadingCotisations: loadingRefetch || loadingRefetchTab || loadingRefetchCotisations }
                                                    }
                                                    revenus={
                                                        { dataRevenus: revenus, isLoadingRevenus: loadingRefetch || loadingRefetchTab }
                                                    }
                                                    depenses={
                                                        { dataDepenses: depenses, valueSwitchDepenses: forDette, changeForDette: handleForDetteChange, isLoadingDepenses: loadingRefetch || loadingRefetchTab || loadingRefetchDepenses }
                                                    }
                                                />
                                            </Stack>
                                        </Stack>
                                        <Toolbar />
                                    </Box>
                                )
                            } else {
                                return (
                                    <Box id='main' component="main" sx={{ flexGrow: 1, bgcolor: '#fbfbfb', px: 10, pt: 4, overflowY: "scroll" }} height={"100vh"}>
                                        <Stack width={"100%"}>
                                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"end"}>
                                                <Stack>
                                                    <h1 className='m-0 lexend-bold'>Membres</h1>
                                                    <small style={{ color: `${colors.dark}99` }}>La liste des {membres?.length} membres de la communauté</small>
                                                </Stack>
                                            </Stack>
                                            <Grid container spacing={3} alignItems={"center"} mt={3}>
                                                {
                                                    membres?.map((mb: any) => (
                                                        <Grid container item xs={12} sm={6} md={3} key={mb.id}>
                                                            <Stack bgcolor={"white"} width={"100%"} p={2} borderRadius={5} justifyContent={"center"} alignItems={"center"} gap={0.6} className='card-membre'>
                                                                <Avatar src={mb?.avatar} sx={{ height: 100, width: 100 }} alt='avatar' />
                                                                <h5 className='m-0'>{mb?.username}</h5>
                                                                <small style={{ color: `${colors.dark}99` }}>{mb?.is_admin === 1 ? "Administrateur" : "Membre"}</small>
                                                            </Stack>
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </Stack>
                                        <Toolbar />
                                    </Box>
                                )
                            }
                        })()}
                        <Drawer id='right-sidebar' sx={{ width: drawerWidthRight, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidthRight, boxSizing: 'border-box' } }} variant="permanent" anchor="right">
                            <Stack width={"100%"} height={"100%"} justifyContent={"space-between"} mt={4} pb={3}>
                                <Stack px={7}>
                                    <Stack width={"100%"} direction={"row"} justifyContent={"end"} alignItems={"center"} gap={0.7}>
                                        {
                                            isFullscreen ? (
                                                <CustomTooltip title={"Mode normale"}>
                                                    <IconButton onClick={() => toggleFullscreen()}>
                                                        <MdFullscreenExit size={30} className='cursor-pointer' />
                                                    </IconButton>
                                                </CustomTooltip>
                                            ) : (
                                                <CustomTooltip title={"Mode plein écran"}>
                                                    <IconButton onClick={() => toggleFullscreen()}>
                                                        <MdFullscreen size={30} className='cursor-pointer' />
                                                    </IconButton>
                                                </CustomTooltip>
                                            )
                                        }
                                        <CustomTooltip title={user?.username}>
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar src={user?.avatar} sizes='sm' alt='avatar' />
                                            </IconButton>
                                        </CustomTooltip>
                                        <Menu
                                            sx={{ mt: '45px' }}
                                            className='user-menu'
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={() => handleCloseUserMenu()}
                                        >
                                            <Stack px={2} py={1}>
                                                <p className='m-0 lexend-bold'>{user?.username}</p>
                                                <small className='m-0' style={{ color: `${colors.dark}95`, fontSize: 13.5 }}>
                                                    {user?.is_admin === 1 ? "Administrateur" : "Membre"}
                                                </small>
                                                <Divider />
                                                <Button variant="contained" className='logout-button' sx={{ mt: 2 }} onClick={() => { handleCloseUserMenu(); handleOpenDialog(DIALOG_DECONNEXION) }}
                                                    startIcon={<BiLogOut size={15} style={{ color: "white" }} />}>
                                                    Se déconnecter
                                                </Button>
                                            </Stack>
                                        </Menu>
                                    </Stack>
                                    <Stack width={"100%"} mt={1} gap={3.5}>
                                        <Stack gap={1} alignItems={"start"}>
                                            <h4 className='m-0'>Situation</h4>
                                            <Stack py={0.8} px={1.5} bgcolor={`${getStatus()?.colors}20`} borderRadius={50}>
                                                <small style={{ color: `${getStatus()?.colors}`, letterSpacing: 0.5, fontSize: 12.5 }}>{getStatus()?.status}</small>
                                            </Stack>
                                        </Stack>
                                        <Stack gap={1.8}>
                                            <h4 className='m-0'>Budget</h4>
                                            <Stack direction={"row"} bgcolor={colors.teal} borderRadius={3} p={2} justifyContent={"space-between"} alignItems={"center"}>
                                                <Stack direction={"row"} alignItems={"center"} gap={1.5}>
                                                    <TbMoneybag size={30} color='white' />
                                                    <Stack>
                                                        <small className='text-white'>Solde réel</small>
                                                        <h4 className='m-0 text-white lexend-bold'>{formatNumber(totals.total_soldes_reel)} Ar</h4>
                                                    </Stack>
                                                </Stack>
                                                <CustomTooltip title={"Revenus + cotisations - dépenses - dettes"}>
                                                    <IconButton>
                                                        <CiCircleInfo size={20} color={"white"} />
                                                    </IconButton>
                                                </CustomTooltip>
                                            </Stack>
                                            <Stack direction={"row"} bgcolor={colors.blue} borderRadius={3} p={2} justifyContent={"space-between"} alignItems={"center"}>
                                                <Stack direction={"row"} alignItems={"center"} gap={1.5}>
                                                    <GrMoney size={30} color='white' />
                                                    <Stack>
                                                        <small className='text-white'>Solde comptable</small>
                                                        <h4 className='m-0 text-white lexend-bold'>{formatNumber(totals.total_soldes)} Ar</h4>
                                                    </Stack>
                                                </Stack>
                                                <CustomTooltip title={"Revenus + cotisations - depenses"}>
                                                    <IconButton>
                                                        <CiCircleInfo size={20} color={"white"} />
                                                    </IconButton>
                                                </CustomTooltip>
                                            </Stack>
                                            <Stack direction={"row"} bgcolor={colors.yellow} borderRadius={3} p={2} justifyContent={"space-between"} alignItems={"center"}>
                                                <Stack direction={"row"} alignItems={"center"} gap={1.5}>
                                                    <GiReceiveMoney size={30} color='white' />
                                                    <Stack>
                                                        <small className='text-white'>Dette</small>
                                                        <h4 className='m-0 text-white lexend-bold'>{formatNumber(totals.total_dettes)}  Ar</h4>
                                                    </Stack>
                                                </Stack>
                                                <CustomTooltip title={"Dettes"}>
                                                    <IconButton>
                                                        <CiCircleInfo size={20} color={"white"} />
                                                    </IconButton>
                                                </CustomTooltip>
                                            </Stack>
                                        </Stack>
                                        <Stack gap={1.5}>
                                            <h4 className='m-0'>Répartition</h4>
                                            <Doughnut id='totals-chart' data={totalsChartData} options={{
                                                plugins: {
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function (context) {
                                                                let label = context.dataset.label || '';
                                                                if (label) {
                                                                    label += ': ';
                                                                }
                                                                if (context.parsed !== null) {
                                                                    label += `${formatNumber(context.parsed)} Ar`;
                                                                }
                                                                return label;
                                                            }
                                                        }
                                                    },
                                                }
                                            }} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack px={8} pt={5}>
                                    <small className='text-center' style={{ color: `${colors.dark}95`, fontSize: 12.5 }}>
                                        Community 0.0.0-beta <br /> By Landry Manankoraisina
                                    </small>
                                </Stack>
                            </Stack>
                        </Drawer>
                        <ConfirmationDialog open={openDialog} options={dialogOptions} />
                    </Box>
                )
            }
            <Toastr />
        </>
    );
}