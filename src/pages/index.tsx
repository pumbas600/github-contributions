import CodeBlock from '@/components/CodeBlock';
import Collapsible from '@/components/Collapsible';
import ColourField, { ColourFieldProps } from '@/components/forms/ColourField';
import LabelledCheckbox from '@/components/forms/LabelledCheckbox';
import NumberField from '@/components/forms/NumberField';
import useDebounce from '@/hooks/useDebounce';
import { Options } from '@/models/Options';
import { OptionsService } from '@/services/OptionsService';
import { fromEntries, toEntries } from '@/utilities';
import { Button, Container, Paper, Stack, TextField, TextFieldProps, styled } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Head from 'next/head';
import React, { useState } from 'react';

const ResponsiveContainer = styled(Container)(({ theme }) => ({
    padding: 0,
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),

    [theme.breakpoints.down('md')]: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(5, 12),

    [theme.breakpoints.down('md')]: {
        borderRadius: 0,
        padding: theme.spacing(3, 3),
    },
}));

type OptionErrors = Partial<Record<keyof Options, string>>;

export default function Home() {
    const [username, setUsername] = useState('');
    const [options, setOptions] = useState(OptionsService.DefaultOptions);
    const [errors, setErrors] = useState<OptionErrors>({});
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const debouncedGeneratedUrl = useDebounce(generatedUrl, 1200);

    const transparentBackground = options.bgColour === 'transparent';
    const resetButtonIsVisible = Object.keys(getOptionsWithoutDefaults(options)).length != 0;
    const contributionImageAltText = `${username}'s GitHub Contributions`;

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const username = e.target.value;
        setUsername(username);

        if (username.length == 0) {
            setGeneratedUrl(null);
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
            error: !!errors[key],
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
        handleOptionChange('bgColour', e.target.checked ? 'transparent' : OptionsService.DefaultOptions.bgColour);
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
                    <ContentPaper elevation={1}>
                        <TextField
                            required
                            fullWidth
                            label="GitHub Username"
                            placeholder="E.g. pumbas600"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <Collapsible title="Theme Options">
                            <Grid container columnSpacing={2} rowSpacing={3} columns={{ xs: 1, md: 3 }}>
                                <Grid xs={1.5}>
                                    <LabelledCheckbox
                                        label="Use transparent background"
                                        checked={transparentBackground}
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
                                <Grid xs={transparentBackground ? 1.5 : 1}>
                                    <ColourField label="Primary Colour" {...getColourFieldProps('colour')} />
                                </Grid>
                                {!transparentBackground && (
                                    <Grid xs={1}>
                                        <ColourField label="Background Colour" {...getColourFieldProps('bgColour')} />{' '}
                                    </Grid>
                                )}
                                <Grid xs={transparentBackground ? 1.5 : 1}>
                                    <ColourField label="Dot Colour" {...getColourFieldProps('dotColour')} />
                                </Grid>
                                <Grid xs={1}>
                                    <NumberField label="Duration (Days)" {...getTextFieldProps('days')} />
                                </Grid>
                                <Grid xs={1}>
                                    <NumberField label="Width (px)" {...getTextFieldProps('width')} />
                                </Grid>
                                <Grid xs={1}>
                                    <NumberField label="Height (px)" {...getTextFieldProps('height')} />
                                </Grid>
                                {resetButtonIsVisible && (
                                    <Grid xs={1} md={3}>
                                        <Stack direction="row-reverse">
                                            <Button variant="text" onClick={handleResetToDefaults}>
                                                Reset to defaults
                                            </Button>
                                        </Stack>
                                    </Grid>
                                )}
                            </Grid>
                        </Collapsible>

                        {generatedUrl && (
                            <>
                                {debouncedGeneratedUrl && (
                                    <img src={debouncedGeneratedUrl} alt={contributionImageAltText} />
                                )}
                                <CodeBlock code={`![${contributionImageAltText}](${generatedUrl})`} />
                                <CodeBlock code={`<img src="${generatedUrl}" alt="${contributionImageAltText}" />`} />
                            </>
                        )}
                    </ContentPaper>
                </ResponsiveContainer>
            </main>
        </>
    );
}
