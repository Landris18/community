import { Box, Container, Stack } from '@mui/material'
import communityLogoDark from "/community-dark.svg"
import { BarLoader } from 'react-spinners'
import colors from '../../colors/colors'

export default function LoadingGlobal() {
    return (
        <Container maxWidth={false} className={"login-container"}>
            <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>
                <Stack p={4} borderRadius={5} my={3} alignItems={"center"}>
                    <Box component={"img"} src={communityLogoDark} width={100} />
                    <Stack direction={"row"}>
                        <p className='m-0'>Community est cours de chargement</p>
                    </Stack>
                    <Stack mt={2}>
                        <BarLoader color={colors.yellow} />
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    )
}