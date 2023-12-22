import GitHubCard, { GitHubCardHeader, GitHubContent } from '@/components/cards/GitHubCard';
import StyledLink from '@/components/typography/StyledLink';
import { GitHubRepoUrl } from '@/data/Links';
import { Alert, AlertTitle, Grid } from '@mui/material';
import PlaygroundOptions, {
    DefaultOptions,
    OptionErrors,
    StringifiedOptions,
    getOptionsWithoutDefaults,
} from './PlaygroundOptions';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import ChartImage from '../ChartImage';
import GeneratedValues from '@/components/cards/GeneratedValues';

const PlaceholderUsername = 'YOUR_USERNAME';

function generateApiUrl(username: string, options: Partial<StringifiedOptions>): string {
    const apiUrl = `/api/contributions/${username}`;
    const url = new URL(apiUrl, window.location.origin);

    for (const [key, value] of Object.entries(options)) {
        if (value === undefined) continue;

        let stringValue = value.toString();
        if (stringValue.startsWith('#')) {
            // Remove the hash from the colours
            stringValue = stringValue.replace('#', '');
        }
        url.searchParams.set(key, stringValue);
    }

    return url.toString();
}

export default function Playground() {
    const [username, setUsername] = useState<string>('');
    const [options, setOptions] = useState(DefaultOptions);
    const [errors, setErrors] = useState<OptionErrors>({});
    const [chartUrl, setChartUrl] = useState<string | null>(null);
    const [displayedUrl, setDisplayedUrl] = useState<string | null>(null);

    const debouncedGeneratedUrl = useDebounce(chartUrl);

    const showRenderedChart =
        debouncedGeneratedUrl !== null && username.length !== 0 && Object.keys(errors).length === 0;

    const displayedUsername = username.length === 0 ? PlaceholderUsername : username;
    const contributionImageAltText = `${displayedUsername}'s GitHub contributions`;

    useEffect(() => {
        setDisplayedUrl(generateApiUrl(PlaceholderUsername, {}));
    }, []);

    const handleGenerateApiUrl = (options: StringifiedOptions, username: string): void => {
        const optionsWithoutDefaults = getOptionsWithoutDefaults(options);
        const hasError = Object.keys(errors).length != 0;
        if (hasError) return;

        if (username.length !== 0) {
            const generatedUrl = generateApiUrl(username, optionsWithoutDefaults);
            setDisplayedUrl(generatedUrl);
            setChartUrl(generatedUrl);
        } else {
            setDisplayedUrl(generateApiUrl(PlaceholderUsername, optionsWithoutDefaults));
        }
    };

    const handleUsernameChange = (username: string): void => {
        setUsername(username);
        handleGenerateApiUrl(options, username);
    };

    const handleOptionsChange = (options: StringifiedOptions): void => {
        setOptions(options);
        handleGenerateApiUrl(options, username);
    };

    return (
        <Grid
            container
            columnSpacing={2}
            rowSpacing={{ md: 2, xs: 0 }}
            sx={{ flexDirection: { md: 'row', xs: 'column-reverse' } }}
        >
            <Grid item xs={12} lg={4}>
                <PlaygroundOptions
                    errors={errors}
                    options={options}
                    username={username}
                    setErrors={setErrors}
                    onChange={handleOptionsChange}
                    onChangeUsername={handleUsernameChange}
                />
            </Grid>
            <Grid item xs={12} lg={8}>
                <GitHubCard>
                    <GitHubContent>
                        <GitHubCardHeader
                            header="Preview your contributions"
                            secondary="This playground is styled after the GitHub default light and dark themes in order to
                            accurately recreate how the charts will look in GitHub READMEs."
                        />
                        {showRenderedChart && <ChartImage src={debouncedGeneratedUrl} alt={contributionImageAltText} />}
                        {displayedUrl !== null && <GeneratedValues url={displayedUrl} alt={contributionImageAltText} />}
                        <Alert severity="info">
                            <AlertTitle>Note</AlertTitle>
                            For more information, refer to{' '}
                            <StyledLink href={GitHubRepoUrl}>the documentation</StyledLink> on GitHub.
                        </Alert>
                    </GitHubContent>
                </GitHubCard>
            </Grid>
        </Grid>
    );
}
