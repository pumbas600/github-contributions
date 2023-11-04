import GitHubCard from '@/components/cards/GitHubCard';
import StyledLink from '@/components/typography/StyledLink';
import Subtitle from '@/components/typography/Subtitle';
import { GitHubRepoUrl } from '@/data/Links';
import { Alert, Box, Grid, Stack, TextField, Typography } from '@mui/material';
import OldPlaygroundOptions, {
    DefaultOptions,
    OptionErrors,
    StringifiedOptions,
    getOptionsWithoutDefaults,
} from './OldPlaygroundOptions';
import { ChangeEvent, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import ChartImage from '../ChartImage';
import GeneratedValues from '@/components/cards/GeneratedValues';
import PlaygroundOptions from './PlaygroundOptions';

export default function Playground() {
    const [username, setUsername] = useState<string>('');
    const [options, setOptions] = useState(DefaultOptions);
    const [errors, setErrors] = useState<OptionErrors>({});
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const debouncedGeneratedUrl = useDebounce(generatedUrl);

    const showRenderedChart =
        debouncedGeneratedUrl !== null && username.length !== 0 && Object.keys(errors).length === 0;
    const contributionImageAltText = `${username}’s GitHub Contributions`;

    const generateApiUrl = (username: string, options: Partial<StringifiedOptions>): string => {
        const baseUrl = `/api/contributions/${username}`;
        const url = new URL(baseUrl, window.location.origin);

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
    };

    const handleGenerateApiUrl = (options: StringifiedOptions, username: string): void => {
        if (username.length === 0) return;
        const optionsWithoutDefaults = getOptionsWithoutDefaults(options);

        const hasError = Object.keys(errors).length != 0;
        if (!hasError) {
            const generatedUrl = generateApiUrl(username, optionsWithoutDefaults);
            setGeneratedUrl(generatedUrl);
        }
    };

    const handleUsernameChange = (username: string): void => {
        setUsername(username);

        if (username.length == 0) {
            setGeneratedUrl(null);
        } else {
            handleGenerateApiUrl(options, username);
        }
    };

    const handleOptionsChange = (options: StringifiedOptions): void => {
        setOptions(options);
        handleGenerateApiUrl(options, username);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
                <PlaygroundOptions username={username} onUsernameChange={handleUsernameChange} />
            </Grid>
            <Grid item xs={12} lg={8}>
                <GitHubCard>
                    <Stack gap={3}>
                        <Box>
                            <Subtitle>Enter your username to get started</Subtitle>
                            <Typography variant="body2">
                                This playground is styled after the GitHub default light and dark themes in order to
                                accurately recreate how the charts will look in GitHub READMEs.
                            </Typography>
                        </Box>
                        <TextField
                            spellCheck={false}
                            required
                            fullWidth
                            label="GitHub username"
                            placeholder="E.g. pumbas600"
                            value={username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                        />
                        {showRenderedChart && <ChartImage src={debouncedGeneratedUrl} alt={contributionImageAltText} />}
                        {generatedUrl && <GeneratedValues url={generatedUrl} alt={contributionImageAltText} />}
                        <OldPlaygroundOptions
                            errors={errors}
                            setErrors={setErrors}
                            options={options}
                            onChange={handleOptionsChange}
                        />
                    </Stack>
                    <Alert severity="info">
                        For more information, refer to <StyledLink href={GitHubRepoUrl}>the documentation</StyledLink>{' '}
                        on GitHub.
                    </Alert>
                </GitHubCard>
            </Grid>
        </Grid>
    );
}
