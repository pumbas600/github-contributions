import CodeBlock from '@/components/CodeBlock';
import ChartImg from '@/components/forms/ChartImage';
import ColourField, { ColourFieldProps } from '@/components/forms/ColourField';
import LabelledCheckbox from '@/components/forms/LabelledCheckbox';
import NumberField from '@/components/forms/NumberField';
import Header from '@/components/header';
import StyledLink from '@/components/typography/StyledLink';
import { GitHubRepoUrl } from '@/data/Links';
import useDebounce from '@/hooks/useDebounce';
import { Options } from '@/models/Options';
import { OptionsService } from '@/services/OptionsService';
import { fromEntries, toEntries } from '@/utilities';
import { Alert, Button, Card, Container, Stack, TextField, TextFieldProps, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Head from 'next/head';
import React, { ChangeEvent, useState } from 'react';

const ResponsiveContainer = styled(Container)(({ theme }) => ({
    padding: 0,
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),

    [theme.breakpoints.down('md')]: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));

const ContentCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(4, 8),

    [theme.breakpoints.down('md')]: {
        borderRadius: 0,
        gap: theme.spacing(2),
        padding: theme.spacing(3, 3),
    },
}));

type OptionErrors = Partial<Record<keyof Options | 'username', string>>;

export default function Home() {
    const [username, setUsername] = useState<string>('');
    const [options, setOptions] = useState(OptionsService.DefaultOptions);
    const [errors, setErrors] = useState<OptionErrors>({});
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const debouncedGeneratedUrl = useDebounce(generatedUrl);
    const showRenderedChart = debouncedGeneratedUrl !== null && errors.username === undefined;

    const isBackgroundTransparent = options.bgColour === 'transparent';
    const isResetButtonVisible = Object.keys(getOptionsWithoutDefaults(options)).length != 0;
    const contributionImageAltText = `${username}'s GitHub Contributions`;

    function handleUsernameChange(e: ChangeEvent<HTMLInputElement>): void {
        const username = e.target.value;
        setUsername(username);

        if (username.length == 0) {
            setGeneratedUrl(null);
            setErrors((errors) => ({ ...errors, username: 'Username is required' }));
        } else {
            handleGenerate(options, username);
        }
    }

    function handleOptionChange<Key extends keyof OptionsService.ContributionOptions>(
        key: Key,
        value: OptionsService.ContributionOptions[Key],
    ): void {
        const newOptions = { ...options, [key]: value };

        setErrors((errors) => ({ ...errors, [key]: undefined }));
        setOptions(newOptions);
        handleGenerate(newOptions, username);
    }

    function getTextFieldProps(key: keyof OptionsService.ContributionOptions): TextFieldProps {
        return {
            fullWidth: true,
            error: !!errors[key],
            helperText: errors[key],
            value: options[key] ?? OptionsService.DefaultOptions[key],
            onChange: (e) => handleOptionChange(key, e.target.value),
        };
    }

    function getColourFieldProps(
        key: keyof Pick<OptionsService.ContributionOptions, 'colour' | 'bgColour' | 'dotColour'>,
    ): ColourFieldProps {
        return {
            fullWidth: true,
            error: errors[key] !== undefined,
            helperText: errors[key],
            value: options[key] ?? OptionsService.DefaultOptions[key],
            onChange: (value) => handleOptionChange(key, value),
        };
    }

    function getOptionsWithoutDefaults(options: OptionsService.ContributionOptions): Partial<Options> {
        return fromEntries<Partial<Options>>(
            toEntries(options).filter(([key, value]) => value !== OptionsService.DefaultOptions[key]),
        );
    }

    function optionsAreValid(optionsWithoutDefaults: Partial<Options>): boolean {
        const errors: OptionErrors = {};
        if (optionsWithoutDefaults.width && optionsWithoutDefaults.width <= 0) {
            errors.width = 'Width must be greater than 0';
        }
        if (optionsWithoutDefaults.height && optionsWithoutDefaults.height <= 0) {
            errors.height = 'Height must be greater than 0';
        }

        const hasErrors = Object.keys(errors).length != 0;

        setErrors(errors);
        return !hasErrors;
    }

    function generateApiUrl(username: string, options: Partial<Options>): string {
        const baseUrl = `/api/contributions/${username}`;
        const url = new URL(baseUrl, window.location.origin);

        for (const [key, value] of toEntries(options)) {
            if (value === undefined) continue;

            // Remove the hash from the colours
            url.searchParams.set(key, value.toString().replace('#', ''));
        }

        return url.toString();
    }

    function handleChangeTransparentBackground(e: React.ChangeEvent<HTMLInputElement>): void {
        handleOptionChange('bgColour', e.target.checked ? OptionsService.DefaultNonTransparentBgColour : 'transparent');
    }

    function handleGenerate(options: OptionsService.ContributionOptions, username: string): void {
        if (username.length == 0) return;
        const optionsWithoutDefaults = getOptionsWithoutDefaults(options);

        if (optionsAreValid(optionsWithoutDefaults)) {
            const generatedUrl = generateApiUrl(username, optionsWithoutDefaults);
            setGeneratedUrl(generatedUrl);
        }
    }

    function handleResetToDefaults(): void {
        setErrors({});
        setOptions(OptionsService.DefaultOptions);
        handleGenerate(OptionsService.DefaultOptions, username);
    }

    function handleApiError(): void {
        setErrors((errors) => ({ ...errors, username: 'Username not found' }));
    }

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <ResponsiveContainer maxWidth="md">
                    <Header />
                    <ContentCard elevation={0}>
                        <Stack gap={3}>
                            <Typography variant="h6">Enter your username to get started</Typography>
                            <TextField
                                spellCheck={false}
                                required
                                fullWidth
                                label="GitHub Username"
                                placeholder="E.g. pumbas600"
                                value={username}
                                onChange={handleUsernameChange}
                                error={errors.username !== undefined}
                                helperText={errors.username}
                            />
                            {showRenderedChart && (
                                <ChartImg
                                    src={debouncedGeneratedUrl}
                                    alt={contributionImageAltText}
                                    onError={handleApiError}
                                />
                            )}
                            <Grid container columnSpacing={3} rowSpacing={{ xs: 3, md: 4 }} columns={{ xs: 1, md: 3 }}>
                                <Grid xs={1.5}>
                                    <LabelledCheckbox
                                        label="Use coloured background"
                                        checked={!isBackgroundTransparent}
                                        onChange={handleChangeTransparentBackground}
                                    />
                                </Grid>
                                <Grid xs={1.5}>
                                    <LabelledCheckbox
                                        label="Shade area below the line"
                                        checked={options.area}
                                        onChange={(e) => handleOptionChange('area', e.target.checked)}
                                    />
                                </Grid>
                                <Grid xs={isBackgroundTransparent ? 1.5 : 1}>
                                    <ColourField label="Primary colour" {...getColourFieldProps('colour')} />
                                </Grid>
                                {!isBackgroundTransparent && (
                                    <Grid xs={1}>
                                        <ColourField label="Background Colour" {...getColourFieldProps('bgColour')} />
                                    </Grid>
                                )}
                                <Grid xs={isBackgroundTransparent ? 1.5 : 1}>
                                    <ColourField label="Dot colour" {...getColourFieldProps('dotColour')} />
                                </Grid>
                                <Grid xs={1}>
                                    <NumberField label="Duration (days)" {...getTextFieldProps('days')} />
                                </Grid>
                                <Grid xs={1}>
                                    <NumberField label="Width (px)" {...getTextFieldProps('width')} />
                                </Grid>
                                <Grid xs={1}>
                                    <NumberField label="Height (px)" {...getTextFieldProps('height')} />
                                </Grid>
                                {isResetButtonVisible && (
                                    <Grid xs={1} md={3}>
                                        <Stack direction="row-reverse">
                                            <Button onClick={handleResetToDefaults}>Reset to defaults</Button>
                                        </Stack>
                                    </Grid>
                                )}
                            </Grid>
                        </Stack>

                        {generatedUrl && (
                            <>
                                <CodeBlock code={`![${contributionImageAltText}](${generatedUrl})`} />
                                <CodeBlock code={`<img src="${generatedUrl}" alt="${contributionImageAltText}" />`} />
                            </>
                        )}
                        <Alert severity="info">
                            For more information, refer to the documentation on{' '}
                            <StyledLink href={GitHubRepoUrl}>GitHub</StyledLink>.
                        </Alert>
                    </ContentCard>
                </ResponsiveContainer>
            </main>
        </>
    );
}
