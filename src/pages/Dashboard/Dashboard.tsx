import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Avatar, Divider, IconButton, Stack, Menu, Button } from '@mui/material';
import communityLogoDark from "/community-dark.svg"
import { LuBarChart2 } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi2";
import colors from '../../colors/colors';
import { useContext, useState } from 'react';
import UserContext from '../../contexts/user/UserContext';
import { BsChevronDoubleDown } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { TbMoneybag } from "react-icons/tb";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import CustomTooltip from '../../components/CustomTooltip/CustomTooltip';
import './Dashboard.scss'


const drawerWidth = 100;
const drawerWidthRight = 450;

Chart.register(ArcElement, Tooltip, Legend);
Chart.defaults.font.family = "lexend";
Chart.defaults.plugins.legend.position = "bottom";


export default function PermanentDrawerLeft() {
    const { user } = useContext(UserContext);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const chartData = {
        labels: ['Solde', 'Dette'],
        datasets: [
            {
                data: [120000, 960000],
                backgroundColor: [`${colors.blue}`, `${colors.yellow}`],
                hoverBackgroundColor: [`${colors.blue}`, `${colors.yellow}`],
                hoverBorderColor: "white"
            },
        ]
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

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }} variant="permanent" anchor="left">
                <Stack width={"100%"} alignItems={"center"} gap={15} mt={4}>
                    <Stack bgcolor={colors.dark} p={0.5} borderRadius={50}>
                        <Box component={"img"} src={communityLogoDark} width={28} />
                    </Stack>
                    <Stack alignItems={"center"} gap={5}>
                        <CustomTooltip title={"Dashboard"}>
                            <IconButton>
                                <LuBarChart2 onClick={() => setActiveMenu("dashboard")} className='cursor-pointer' size={25} color={activeMenu === "dashboard" ? colors.dark : `${colors.dark}60`} />
                            </IconButton>
                        </CustomTooltip>
                        <CustomTooltip title={"Membres"}>
                            <IconButton>
                                <HiOutlineUsers onClick={() => setActiveMenu("info")} className='cursor-pointer' size={25} color={activeMenu !== "dashboard" ? colors.dark : `${colors.dark}60`} />
                            </IconButton>
                        </CustomTooltip>
                    </Stack>
                </Stack>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fbfbfb', px: 10, pt: 4 }} height={"100vh"}>
                <Stack width={"100%"}>
                    <h1 className='m-0 lexend-bold'>Dashboard</h1>
                    <small>Vous pouvez voir ici l'état actuel du compte de la communauté</small>
                    <Divider sx={{ mt: 2 }} />
                </Stack>
            </Box>
            <Drawer sx={{ width: drawerWidthRight, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidthRight, boxSizing: 'border-box' } }} variant="permanent" anchor="right">
                <Stack width={"100%"} height={"100%"} justifyContent={"space-between"} mt={4} pb={3}>
                    <Stack px={8}>
                        <Stack width={"100%"} direction={"row"} justifyContent={"end"} alignItems={"center"} gap={0.7}>
                            {
                                isFullscreen ? (
                                    <MdFullscreenExit onClick={() => toggleFullscreen()} size={30} className='cursor-pointer' />

                                ) : (
                                    <MdFullscreen onClick={() => toggleFullscreen()} size={30} className='cursor-pointer' />
                                )
                            }
                            <CustomTooltip title={user.username}>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar src={user.avatar} sizes='sm' alt='avatar' />
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
                                    <p className='m-0 lexend-bold'>{user.username}</p>
                                    <small className='m-0' style={{ color: `${colors.dark}95` }}>
                                        {user.is_admin === 1 ? "Admin" : "Utilisateur"}
                                    </small>
                                    <Divider />
                                    <Button variant="contained" className='logout-button' sx={{ mt: 2 }}
                                        startIcon={<RiLogoutCircleRLine size={15} style={{ color: "white" }} />}>
                                        Se déconnecter
                                    </Button>
                                </Stack>
                            </Menu>
                        </Stack>
                        <Stack width={"100%"} mt={5} gap={3.5}>
                            <Stack gap={1} alignItems={"start"}>
                                <h4 className='m-0'>Situation</h4>
                                <Stack direction={"row"} alignItems={"center"} gap={0.5}>
                                    <Stack bgcolor={`${colors.red}`} borderRadius={50} p={1.2} />
                                    <small style={{ color: `${colors.dark}99`, letterSpacing: 0.5 }}>Très critique</small>
                                </Stack>
                            </Stack>
                            <Stack gap={1.5}>
                                <h4 className='m-0'>Budget</h4>
                                <Stack bgcolor={colors.blue} borderRadius={3} p={2}>
                                    <Stack direction={"row"} alignItems={"center"} gap={2.5}>
                                        <TbMoneybag size={30} color='white' />
                                        <Stack>
                                            <small className='text-white'>Solde</small>
                                            <h3 className='m-0 text-white lexend-bold'>120 000 Ar</h3>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack bgcolor={colors.yellow} borderRadius={3} p={2}>
                                    <Stack direction={"row"} alignItems={"center"} gap={2.5}>
                                        <BsChevronDoubleDown size={30} color='white' />
                                        <Stack>
                                            <small className='text-white'>Dette</small>
                                            <h3 className='m-0 text-white lexend-bold'>960 000 Ar</h3>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack gap={1.5}>
                                <h4 className='m-0'>Répartition</h4>
                                <Doughnut data={chartData} options={{
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    let label = context.dataset.label || '';
                                                    if (label) {
                                                        label += ': ';
                                                    }
                                                    if (context.parsed !== null) {
                                                        label += `${context.parsed} Ar`;
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
                    <Stack px={8}>
                        <small className='text-center' style={{ color: `${colors.dark}95` }}>
                            Community 0.0.0-beta <br /> By Landry Manankoraisina
                        </small>
                    </Stack>
                </Stack>
            </Drawer>
        </Box>
    );
}