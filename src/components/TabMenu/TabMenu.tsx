import * as React from 'react';
import { Stack, styled, Box, Tab, Tabs } from '@mui/material';
import colors from '../../colors/colors';
import "./TabMenu.scss";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const StyledTab = styled(Tab)({
    "&.Mui-selected": {
        color: colors.dark
    }
});

const TabPanel = (props: TabPanelProps) => {
    const { value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
                <Stack direction="row">
                    <h4>Tab {index + 1}</h4>
                </Stack>
            )}
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function TabMenu() {
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
                    <StyledTab label="Révenus" {...a11yProps(1)} className="tab-label" />
                    <StyledTab label="Dépenses" {...a11yProps(2)} className="tab-label" />
                    <StyledTab label="Dettes" {...a11yProps(3)} className="tab-label" />
                </Tabs>
            </Stack>
            <TabPanel value={value} index={0} />
            <TabPanel value={value} index={1} />
            <TabPanel value={value} index={2} />
            <TabPanel value={value} index={3} />
        </Box>
    );
}