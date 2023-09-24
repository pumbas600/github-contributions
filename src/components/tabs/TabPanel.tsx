import { Box } from '@mui/material';
import { ReactNode } from 'react';

export interface TabPanelProps {
    children?: ReactNode;
    selectedTab: any;
    thisTab: any;
    idPrefix: string;
}

export default function TabPanel({ selectedTab, thisTab, idPrefix, children }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={selectedTab !== thisTab}
            id={`${idPrefix}-tabpanel-${thisTab}`}
            aria-labelledby={`${idPrefix}-tab-${thisTab}`}
        >
            {selectedTab === thisTab && children}
        </Box>
    );
}
