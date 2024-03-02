import { Box, Button, Container, FormControl, Stack, TextField } from '@mui/material'
import communityLogoDark from "/community-dark.svg"
import LoginIcon from "@mui/icons-material/Login"
import './Login.scss'


export default function Login() {
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
                            <TextField label={"Nom d'utilisateur"} variant="outlined" />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField label={"Mot de passe"} type="password" variant="outlined" />
                        </FormControl>
                        <Button variant="contained" className='primary-button' sx={{ mt: 0.8 }} startIcon={<LoginIcon sx={{ color: "white" }} />}>
                            S'authentifier
                        </Button>
                    </Stack>
                </Stack>
                <small className='m-0 text-center' style={{lineHeight: 2}}>
                    Pour toutes questions et problème d'authentification, veuillez contacter <br />
                    <span className='lexend-bold cursor-pointer' style={{ textDecoration: "underline" }} onClick={() => window.open("https://facebook.com/Landris18", '_blank')}>
                        Landry Manankoraisina
                    </span>
                </small>
            </Stack>
        </Container>
    )
}