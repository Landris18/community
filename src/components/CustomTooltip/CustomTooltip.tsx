import { ThemeProvider, Tooltip, createTheme } from '@mui/material'
import { ReactElement } from 'react'

const theme = createTheme({
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontFamily: 'lexend'
                }
            }
        }
    }
});


export default function CustomTooltip({ children, title }: { children: ReactElement, title: string }) {
    return (
        <ThemeProvider theme={theme}>
            <Tooltip title={title} style={{ fontFamily: "lexend" }} arrow>
                {children}
            </Tooltip>
        </ThemeProvider>
    )
}