import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { Box, Button, CircularProgress, Container, FormControl, Stack, TextField } from '@mui/material'
import communityLogoDark from "/community-dark.svg"
import LoginIcon from "@mui/icons-material/Login"
import colors from "../../colors/colors"
import Service from '../../services/services'
import { toast } from 'react-toastify'
import Toastr from '../../components/Toastr/Toastr'
import UserContext from '../../contexts/UserContext'
import { storeToken } from '../../utility/utility'
import './Login.scss'


export default function Login() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { setUserData } = useContext(UserContext);

    const { isLoading } = useQuery("login", () => Service.login(credentials), {
        enabled: false,
        retry: false,
        onSuccess: (data: any) => {
            setUserData(data.success.user);
            storeToken(data.success.token, data.success.user.id);
            navigate('/dashboard', { replace: true });
        },
        onError: (_error: any) => {
            toast.error(_error.response.data.error);
        }
    });

    const login = async () => {
        await queryClient.prefetchQuery("login");
    };

    const handleCredentials = (credential: { key: string, value: string }) => {
        setCredentials({ ...credentials, [credential.key]: credential.value });
    };

    return (
        <Container maxWidth={false} className={"login-container"}>
            <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>
                <Stack bgcolor={"white"} p={4} borderRadius={5} my={3}>
                    <Stack alignItems={"center"} justifyContent={"center"}>
                        <Box component={"img"} src={communityLogoDark} width={50} />
                        <h2 className='lexend-bold m-0' >Community</h2>
                    </Stack>
                    <Stack gap={1.5} mt={2}>
                        <FormControl fullWidth>
                            <TextField label={"Nom d'utilisateur"} variant="outlined" name="username"
                                value={credentials.username} onChange={(event) => handleCredentials({ key: "username", value: event?.target.value })}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField label={"Mot de passe"} type="password" variant="outlined" name="password"
                                value={credentials.password} onChange={(event) => handleCredentials({ key: "password", value: event?.target.value })}
                            />
                        </FormControl>
                        <Button variant="contained" className='primary-button' sx={{ mt: 0.8 }}
                            disabled={isLoading} onClick={() => login()}
                            startIcon={
                                isLoading ? <CircularProgress size={20} sx={{ color: `${colors.dark}60` }} value={70} variant="indeterminate" /> : <LoginIcon sx={{ color: "white" }} />
                            }>
                            S'authentifier
                        </Button>
                    </Stack>
                </Stack>
                <small className='m-0 text-center' style={{ lineHeight: 2 }}>
                    Pour toutes questions ou problème d'authentification, veuillez contacter <br />
                    <span className='lexend-bold cursor-pointer' style={{ textDecoration: "underline" }} onClick={() => window.open("https://facebook.com/Landris18", '_blank')}>
                        Landry Manankoraisina
                    </span>
                </small>
            </Stack>
            <Toastr />
        </Container>
    )
}