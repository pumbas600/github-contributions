import { ValuesOf } from '@/types/utility';
import { Paper, Tab, TabProps, Tabs } from '@mui/material';
import { SyntheticEvent, useMemo, useState } from 'react';
import TabPanel from '../tabs/TabPanel';
import CodeBlock from './CodeBlock';

export interface GeneratedValuesProps {
    url: string;
    alt: string;
}

const GeneratedTabs = {
    Markdown: 'markdown',
    Html: 'html',
    Url: 'url',
} as const;

type GeneratedTabs = ValuesOf<typeof GeneratedTabs>;

function ariaProps(tab: GeneratedTabs): TabProps {
    return {
        id: `generated-tab-${tab}`,
        'aria-controls': `generated-tabpanel-${tab}`,
    };
}

interface GeneratedValue {
    tab: GeneratedTabs;
    label: string;
    value: string;
}

export default function GeneratedValues({ url, alt }: GeneratedValuesProps) {
    const [selectedTab, setSelectedTab] = useState<GeneratedTabs>(GeneratedTabs.Markdown);

    const generatedValues = useMemo<GeneratedValue[]>(() => {
        return [
            {
                tab: GeneratedTabs.Markdown,
                label: 'Markdown',
                value: `![${alt}](${url})`,
            },
            {
                tab: GeneratedTabs.Html,
                label: 'HTML',
                value: `<img src="${url}" alt="${alt}" />`,
            },
            {
                tab: GeneratedTabs.Url,
                label: 'URL',
                value: url,
            },
        ];
    }, [url, alt]);

    const handleChange = (event: SyntheticEvent, newValue: GeneratedTabs): void => {
        setSelectedTab(newValue);
    };

    return (
        <Paper elevation={0}>
            <Tabs
                value={selectedTab}
                onChange={handleChange}
                aria-label="Switch between different generated values for your contributions graph"
            >
                {generatedValues.map(({ tab, label }) => (
                    <Tab key={tab} label={label} {...ariaProps(tab)} />
                ))}
            </Tabs>
            {generatedValues.map(({ tab, value }) => (
                <TabPanel key={tab} thisTab={tab} selectedTab={selectedTab} idPrefix="generated">
                    <CodeBlock code={value} />
                </TabPanel>
            ))}
        </Paper>
    );
}
