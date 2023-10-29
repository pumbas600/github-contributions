import CodeBlock from '@/components/cards/CodeBlock';
import PlaygroundCard from '@/components/cards/PlaygroundCard';
import StyledLink from '@/components/typography/StyledLink';
import Subtitle from '@/components/typography/Subtitle';
import { GitHubRepoUrl } from '@/data/Links';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import PlaygroundOptions, {
    DefaultOptions,
    OptionErrors,
    StringifiedOptions,
    getOptionsWithoutDefaults,
} from './PlaygroundOptions';
import { ChangeEvent, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import ChartImage from '../ChartImage';
import GeneratedValues from '@/components/cards/GeneratedValues';
import { Options } from '@/models/Options';
import { toEntries } from '@/utilities';

type Validator = {
    isValid: (value: string) => boolean;
    error: string;
};

const PositiveNumberValidator: Validator = {
    isValid(value: string): boolean {
        if (value === '') return false;

        const number = Number(value);
        return !isNaN(number) && number > 0;
    },
    error: 'The value must be greater than 0',
};

const ColourValidator: Validator = {
    isValid(value: string): boolean {
        if (value === '') return false;

        return /^#[A-Fa-f\d]{3}|[A-Fa-f\d]{6}$/.test(value);
    },
    error: 'The value must be a valid hex colour',
};

const Validators: Record<keyof Options, Validator> = {
    colour: ColourValidator,
    bgColour: {
        isValid: (value) => value === 'transparent' || ColourValidator.isValid(value),
        error: 'The value must be a valid hex colour',
    },
    dotColour: ColourValidator,
    borderRadius: PositiveNumberValidator,
    days: PositiveNumberValidator,
};

export default function Playground() {
    const [username, setUsername] = useState<string>('');
    const [options, setOptions] = useState(DefaultOptions);
    const [errors, setErrors] = useState<OptionErrors>({});
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const debouncedGeneratedUrl = useDebounce(generatedUrl);

    const showRenderedChart =
        debouncedGeneratedUrl !== null && username.length !== 0 && Object.keys(errors).length === 0;
    const contributionImageAltText = `${username}’s GitHub Contributions`;

    const validateOptions = (optionsWithoutDefaults: Partial<StringifiedOptions>): boolean => {
        const errors: OptionErrors = {};

        toEntries(optionsWithoutDefaults).forEach(([key, value]) => {
            if (value === undefined) return;

            const validator = Validators[key];
            if (!validator.isValid(value)) {
                errors[key] = validator.error;
            }
        });

        const hasErrors = Object.keys(errors).length != 0;

        setErrors(errors);
        return !hasErrors;
    };

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

        if (validateOptions(optionsWithoutDefaults)) {
            const generatedUrl = generateApiUrl(username, optionsWithoutDefaults);
            setGeneratedUrl(generatedUrl);
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const username = e.target.value;
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
        <PlaygroundCard>
            <Stack gap={3}>
                <Box>
                    <Subtitle>Enter your username to get started</Subtitle>
                    <Typography variant="body2">
                        This playground is styled after the GitHub default light and dark themes in order to accurately
                        recreate how the charts will look in GitHub READMEs.
                    </Typography>
                </Box>
                <TextField
                    spellCheck={false}
                    required
                    fullWidth
                    label="GitHub username"
                    placeholder="E.g. pumbas600"
                    value={username}
                    onChange={handleUsernameChange}
                />
                {showRenderedChart && <ChartImage src={debouncedGeneratedUrl} alt={contributionImageAltText} />}
                {generatedUrl && <GeneratedValues url={generatedUrl} alt={contributionImageAltText} />}
                <PlaygroundOptions errors={errors} options={options} onChange={handleOptionsChange} />
            </Stack>
            <Alert severity="info">
                For more information, refer to <StyledLink href={GitHubRepoUrl}>the documentation</StyledLink> on
                GitHub.
            </Alert>
        </PlaygroundCard>
    );
}
