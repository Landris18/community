import 'chart.js/auto';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
    Avatar, Divider, IconButton, Stack, Menu, Toolbar, Grid,
    FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import communityLogoDark from "../../assets/images/community-dark.svg";
import { LuBarChart2 } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi2";
import colors from '../../colors/colors';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/user/UserContext';
import { GiReceiveMoney } from "react-icons/gi";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { TbLogout } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";
import CustomTooltip from '../../components/CustomTooltip/CustomTooltip';
import ConfirmationDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { MONTHS, MONTHS_LIST, formatNumber, getYearsBetween, removeToken } from '../../utility/utility';
import { useNavigate } from 'react-router-dom';
import { useQueries } from 'react-query';
import Service from '../../services/services';
import Toastr from '../../components/Toastr/Toastr';
import { toast } from 'react-toastify';
import LoadingGlobal from '../../components/LoadingGlobal/LoadingGlobal';
import TabMenu from '../../components/TabMenu/TabMenu';
import CommonDialog from '../../components/CommonDialog/CommonDialog';
import MembresContext from '../../contexts/membres/MembresContext';
import './Dashboard.scss';


const drawerWidth = 100;
const drawerWidthRight = 400;

Chart.register(ArcElement, Tooltip, Legend);
Chart.defaults.font.family = "lexend";
Chart.defaults.plugins.legend.position = "bottom";

const DIALOG_DECONNEXION = "DIALOG_DECONNEXION";
const DIALOG_PASSWORD = "DIALOG_PASSWORD";
const TRANSACTIONS = "TRANSACTIONS";


export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { setMembresData } = useContext(MembresContext);

    const [activeMenu, setActiveMenu] = useState(TRANSACTIONS);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
    const [dialogConfirmOptions, setDialogConfirmOptions] = useState<any>({});
    const [openDialogCommon, setOpenDialogCommon] = useState(false);
    const [dialogCommonOptions, setDialogCommonOptions] = useState<any>({});
    const [allQueriesLoaded, setAllQueriesLoaded] = useState(false);
    const [totals, setTotals] = useState<any>({});
    const [stats, setStats] = useState<any>({});
    const [membres, setMembres] = useState<any>();
    const [cotisations, setCotisations] = useState<any>({});
    const [revenus, setRevenus] = useState<any>({});
    const [depenses, setDepenses] = useState<any>({});
    const [dettes, setDettes] = useState<any>({});
    const [lstYears] = useState(getYearsBetween());
    const [loadingRefetch, setLoadingRefetch] = useState<boolean>(false);
    const [loadingRefetchTab, setLoadingRefetchTab] = useState<boolean>(false);
    const [loadingRefetchCotisations, setLoadingRefetchCotisations] = useState<boolean>(false);
    const [loadingRefetchDepenses, setLoadingRefetchDepenses] = useState<boolean>(false);
    const [hasPaidCurrentMonth, setHasPaidCurrentMonth] = useState<boolean>(false);
    const [membreId, setMembreId] = useState<null | number>(null);
    const [membre, setMembre] = useState<any>(null);
    const [cotisationsMembres, setCotisationsMembres] = useState<any[]>([]);

    // Global filters
    const [anneeGlobal, setAnneeGlobal] = useState(new Date().getFullYear());
    let anneeFilterGlobal = anneeGlobal;
    const [moisGlobal, setMoisGlobal] = useState(MONTHS[new Date().getMonth()]);
    let moisFilterGlobal = moisGlobal;

    // Cotisations filter
    const [onlyPaid, setOnlyPaid] = useState(false);
    let onlyPaidFilter = onlyPaid;

    // Dépenses filter
    const [forDette, setForDette] = useState(false);
    let forDetteFilter = onlyPaid;

    // Menu anchors
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElUserCotisation, setAnchorElUserCotisation] = useState<null | HTMLElement>(null);


    /**
     * Initial queries
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
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des totaux");
                }
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
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des statistiques");
                }
            }
        },
        {
            queryKey: 'cotisations',
            retry: false,
            refetch: false,
            queryFn: () => Service.getCotisations(anneeFilterGlobal, moisFilterGlobal, onlyPaidFilter, undefined),
            onSuccess: (data: any) => {
                setCotisations(data.success.cotisations);
            },
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des cotisations");
                }
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
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des revenus");
                }
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
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des dépenses");
                }
            }
        },
        {
            queryKey: 'dettes',
            retry: false,
            refetch: false,
            queryFn: () => Service.getDettes(),
            onSuccess: (data: any) => {
                setDettes(data.success.dettes);
            },
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des dettes");
                }
            }
        },
        {
            queryKey: 'membres',
            retry: false,
            refetch: false,
            queryFn: () => Service.getMembres(),
            onSuccess: (data: any) => {
                setMembresData(data.success);
                setMembres(data.success);
            },
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des membres");
                }
            }
        },
        {
            queryKey: 'cotisations_membres',
            retry: false,
            refetch: false,
            queryFn: () => Service.getCotisations(undefined, undefined, undefined, true),
            onSuccess: (data: any) => {
                setCotisationsMembres(data.success.cotisations);
            },
            onError: (_error: any) => {
                if (_error?.response?.data?.error) {
                    toast.error("Problème de récupération des cotisations des membres");
                }
            }
        }
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
    }, [queryResults, user?.username]);

    useEffect(() => {
        const getStatusCotisationUser = (username: string) => {
            if (cotisations && cotisations?.length > 0 && moisFilterGlobal === MONTHS[new Date().getMonth()] && anneeFilterGlobal === new Date().getFullYear()) {
                const cotisation = cotisations.find((c: any) => c.username === username);
                if (cotisation && cotisation?.montant) {
                    setHasPaidCurrentMonth(true);
                }
            }
        }
        getStatusCotisationUser(user?.username);
    }, [anneeFilterGlobal, cotisations, moisFilterGlobal, user?.username]);


    /**
     * Some functions
    */
    const handleOpenDialogConfirm = (dialog: string) => {
        setOpenDialogConfirm(true);
        if (dialog === DIALOG_DECONNEXION) {
            const options = {
                title: 'Déconnexion',
                message: 'Voulez-vous vraiment vous déconnecter de community ?',
                confirmText: "Me déconnecter",
                btnClass: "danger-button",
                handleCloseDialog: handleCloseDialogConfirm,
                handleConfirmDialog: logout
            };
            setDialogConfirmOptions(options);
        }
    };

    const handleCloseDialogConfirm = () => {
        setOpenDialogConfirm(false);
    };

    const handleOpenDialogCommon = (dialog: string) => {
        setOpenDialogCommon(true);
        if (dialog === DIALOG_PASSWORD) {
            const options = {
                dialog: dialog,
                handleCloseDialog: handleCloseDialogCommon,
                handleConfirmDialog: changePassword
            };
            setDialogCommonOptions(options);
        }
    };

    const handleCloseDialogCommon = () => { setOpenDialogCommon(false) };
    const handleOpenProfileMenu = (event: any) => { setAnchorElUser(event.currentTarget) };
    const handleCloseProfileMenu = () => { setAnchorElUser(null) };

    const handleOpenUserCotisationMenu = (event: any) => {
        setAnchorElUserCotisation(event.currentTarget);
    };

    const handleCloseUserCotisationMenu = () => {
        setMembre(null);
        setAnchorElUserCotisation(null);
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

    const logout = async () => {
        setOpenDialogConfirm(false);
        await Service.logout().then((res: any) => {
            toast.success(res["success"]);
            setTimeout(() => {
                removeToken();
                navigate("/", { replace: true });
            }, 1500);
        }).catch((_error: any) => {
            console.log(_error);
            toast.error(_error?.response?.data?.error ?? "Impossible de vous déconnecter");
        });
    };

    const changePassword = async (passwordData: { new_password: string, old_password: string, confirm_password?: string }) => {
        setOpenDialogCommon(false);
        delete passwordData.confirm_password;
        await Service.updatePassword({ ...passwordData, id: user.id }).then((res: any) => {
            toast.success(res["success"]);
            setTimeout(() => {
                removeToken();
                navigate("/", { replace: true });
            }, 1500);
        }).catch((_error: any) => {
            console.log(_error);
            toast.error(_error?.response?.data?.error ?? "Impossible de mettre à jour votre mot de passe");
        });
    };

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
    };

    const getStatusCotisationUser = (mois: string, annee: number) => {
        if (membre?.id) {
            const filterByMembre: any = cotisationsMembres?.filter((ct: any) => ct.membre_id === membre?.id)[0];
            if ((mois === "Janvier" && annee === 2024) || (membre?.id === 17 && mois === "Février")) return colors.blue;
            if (filterByMembre["annees"][annee.toString()].includes(mois)) {
                return colors.green;
            } else {
                return colors.red;
            }
        }
    };

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
                label: 'Dépense',
                data: extractTotalMontant(stats.depenses),
                backgroundColor: colors.red,
            },
            {
                label: 'Dette cumulée',
                data: extractTotalMontant(stats.dettes),
                backgroundColor: colors.yellow,
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
                                    <Box id='main' component="main" sx={{ flexGrow: 1, bgcolor: '#fbfbfb', px: 6, pt: 2.5, overflowY: "scroll" }} height={"100vh"}>
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
                                                        <Bar options={options} data={statsChartData} />
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
                                                    dettes={
                                                        { dataDettes: dettes }
                                                    }
                                                />
                                            </Stack>
                                        </Stack>
                                        <Toolbar />
                                    </Box>
                                )
                            } else {
                                return (
                                    <Box id='main' component="main" sx={{ flexGrow: 1, bgcolor: '#fbfbfb', px: 6, pt: 4, overflowY: "scroll" }} height={"100vh"}>
                                        <Stack width={"100%"}>
                                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"end"}>
                                                <Stack>
                                                    <h1 className='m-0 lexend-bold'>Membres</h1>
                                                    <small style={{ color: `${colors.dark}99` }}>La liste des {membres?.length} membres de la communauté</small>
                                                </Stack>
                                            </Stack>
                                            <Grid container spacing={3} alignItems={"center"} mt={1}>
                                                {
                                                    membres?.map((mb: any) => (
                                                        <Grid container item xs={12} sm={12} md={6} lg={3} key={mb.id}>
                                                            <Stack onMouseEnter={() => setMembreId(mb?.id)} onMouseLeave={() => setMembreId(null)} bgcolor={"white"} width={"100%"} p={2.2} borderRadius={5} justifyContent={"center"} alignItems={"center"} gap={0.6} className='card-membre'>
                                                                <Stack width={"100%"} justifyContent={"end"} alignItems={"end"}>
                                                                    <IconButton onClick={(event) => { handleOpenUserCotisationMenu(event); setMembre(mb) }}>
                                                                        <CiCircleInfo size={20} color={(membreId === mb?.id || membre?.id === mb?.id) ? colors.teal : "white"} />
                                                                    </IconButton>
                                                                </Stack>
                                                                <Avatar src={mb?.avatar} sx={{ height: 100, width: 100, mt: -4.2 }} alt='avatar' />
                                                                <h5 className='m-0'>{mb?.username}</h5>
                                                                <small style={{ color: `${colors.dark}99` }}>{mb?.is_admin === 1 ? "Administrateur" : "Membre"}</small>
                                                            </Stack>
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                            <Menu
                                                anchorEl={anchorElUserCotisation}
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                                open={Boolean(anchorElUserCotisation)}
                                                onClose={handleCloseUserCotisationMenu}
                                            >
                                                <Stack px={2} py={1}>
                                                    <h4 className='lexend-bold m-0' style={{ color: colors.teal }}>
                                                        Cotisations de {membre?.username}
                                                    </h4>
                                                    <Divider sx={{ my: 1 }} />
                                                    <Stack width={350}>
                                                        <small style={{ color: `${colors.dark}99` }}>Cotisation de l'année {new Date().getFullYear()}</small>
                                                        <Stack direction={"row"} flexWrap={"wrap"} mt={1.4} alignItems={"center"} gap={0.8} justifyContent={"start"}>
                                                            {
                                                                MONTHS_LIST?.map((mo: any, index: number) => (
                                                                    <Stack key={index} py={0.4} px={1} bgcolor={`${getStatusCotisationUser(mo?.long, new Date().getFullYear())}`} borderRadius={50}>
                                                                        <small style={{ color: `white`, letterSpacing: 0.5, fontSize: 12.5 }}>
                                                                            {mo?.short}
                                                                        </small>
                                                                    </Stack>
                                                                ))
                                                            }
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Menu>
                                        </Stack>
                                        <Toolbar />
                                    </Box>
                                )
                            }
                        })()}
                        <Drawer id='right-sidebar' sx={{ width: drawerWidthRight, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidthRight, boxSizing: 'border-box' } }} variant="permanent" anchor="right">
                            <Stack width={"100%"} height={"100%"} justifyContent={"space-between"} mt={3.5} pb={3}>
                                <Stack px={6}>
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
                                            <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0 }}>
                                                <Avatar src={user?.avatar} sizes='md' alt={user?.username} sx={{ border: `4px solid ${hasPaidCurrentMonth ? "white" : colors.red}` }} />
                                            </IconButton>
                                        </CustomTooltip>
                                        <Menu
                                            keepMounted
                                            sx={{ mt: '45px' }}
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            open={Boolean(anchorElUser)}
                                            onClose={() => handleCloseProfileMenu()}
                                        >
                                            <Stack px={2} py={1}>
                                                <p className='m-0 lexend-bold'>{user?.username}</p>
                                                <small className='m-0' style={{ color: `${colors.dark}95`, fontSize: 13.5 }}>
                                                    {user?.is_admin === 1 ? "Administrateur" : "Membre"}
                                                </small>
                                                <Divider sx={{ my: 0.8 }} />
                                                <Stack className='cursor-pointer menu-item' direction={"row"} color={`${colors.dark}99`} py={1} alignItems={"start"} fontSize={14} gap={0.5}
                                                    onClick={() => { handleCloseProfileMenu(); handleOpenDialogCommon(DIALOG_PASSWORD) }}>
                                                    <HiOutlineLockClosed size={20} />
                                                    Mot de passe
                                                </Stack>
                                                <Divider sx={{ my: 0.8 }} />
                                                <Stack className='cursor-pointer menu-item' direction={"row"} color={`${colors.red}`} py={1} alignItems={"start"} fontSize={14} gap={0.5}
                                                    onClick={() => { handleCloseProfileMenu(); handleOpenDialogConfirm(DIALOG_DECONNEXION) }}>
                                                    <TbLogout size={20} />
                                                    Se déconnecter
                                                </Stack>
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
                                            <Doughnut data={totalsChartData} options={{
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
                                        Community 0.1.2-beta <br /> By Landry Manankoraisina
                                    </small>
                                </Stack>
                            </Stack>
                        </Drawer>
                        <ConfirmationDialog open={openDialogConfirm} options={dialogConfirmOptions} />
                        <CommonDialog open={openDialogCommon} options={dialogCommonOptions} />
                    </Box>
                )
            }
            <Toastr />
        </>
    );
}