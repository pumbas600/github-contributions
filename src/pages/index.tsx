import CodeBlock from '@/components/CodeBlock';
import ColourField, { ColourFieldProps } from '@/components/forms/ColourField';
import NumberField from '@/components/forms/NumberField';
import PillButton from '@/components/forms/PillButton';
import Row from '@/components/forms/Row';
import { Options } from '@/models/Options';
import { OptionsService } from '@/services/OptionsService';
import { fromEntries, toEntries } from '@/utilities';
import { ArrowForward } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
    TextFieldProps,
    styled,
} from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react';

const ContentPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(5, 12),
}));

type OptionErrors = Partial<Record<keyof Options, string>>;

export default function Home() {
    const [username, setUsername] = useState('');
    const [options, setOptions] = useState(OptionsService.DefaultOptions);
    const [errors, setErrors] = useState<OptionErrors>({});
    const [transparentBackground, setTransparentBackground] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const generateButtonIsDisabled = username.length == 0;
    const resetButtonIsVisible = Object.keys(getOptionsWithoutDefaults(options)).length != 0 || transparentBackground;

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const username = e.target.value;
        setUsername(username);

        if (username.length == 0) {
            setGeneratedUrl(null);
        }
    }

    function handleOptionChange<Key extends keyof OptionsService.ContributionOptions>(
        key: Key,
        value: OptionsService.ContributionOptions[Key],
    ): void {
        setErrors((errors) => ({ ...errors, [key]: undefined }));
        setOptions((prev) => ({ ...prev, [key]: value }));
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

    function generateApiUrl(username: string, options: Partial<Options>): void {
        const baseUrl = `/api/contributions/${username}`;
        const url = new URL(baseUrl, window.location.origin);

        for (const [key, value] of toEntries(options)) {
            if (value === undefined) continue;

            // Remove the hash from the colours
            url.searchParams.set(key, value.toString().replace('#', ''));
        }

        if (transparentBackground) {
            url.searchParams.set('bgColour', 'none');
        }

        const generatedUrl = url.toString();
        setGeneratedUrl(generatedUrl);
    }

    function handleChangeTransparentBackground(e: React.ChangeEvent<HTMLInputElement>): void {
        setTransparentBackground(e.target.checked);
    }

    function handleGenerate(): void {
        const optionsWithoutDefaults = getOptionsWithoutDefaults(options);

        if (optionsAreValid(optionsWithoutDefaults)) {
            generateApiUrl(username, optionsWithoutDefaults);
        }
    }

    function handleResetToDefaults(): void {
        setErrors({});
        setOptions(OptionsService.DefaultOptions);
        setTransparentBackground(false);
        generateApiUrl(username, {});
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
                <Container maxWidth="md" sx={{ marginTop: 5 }}>
                    <ContentPaper elevation={1}>
                        <Stack gap={3}>
                            <TextField
                                required
                                fullWidth
                                label="GitHub Username"
                                placeholder="E.g. pumbas600"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            <Row>
                                <FormControlLabel
                                    sx={{ width: '100%' }}
                                    label="Use transparent background"
                                    control={
                                        <Checkbox
                                            checked={transparentBackground}
                                            onChange={handleChangeTransparentBackground}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    sx={{ width: '100%' }}
                                    label="Shade area below the line"
                                    control={
                                        <Checkbox
                                            checked={options.area}
                                            onChange={(e) => handleOptionChange('area', e.target.checked)}
                                        />
                                    }
                                />
                            </Row>
                            {!transparentBackground && (
                                <ColourField label="Background Colour" {...getColourFieldProps('bgColour')} />
                            )}
                            <NumberField label="Number of days included in the graph" {...getTextFieldProps('days')} />
                            <Row>
                                <ColourField label="Primary Colour" {...getColourFieldProps('colour')} />
                                <ColourField label="Dot Colour" {...getColourFieldProps('dotColour')} />
                            </Row>
                            <Row>
                                <NumberField label="Width (px)" {...getTextFieldProps('width')} />
                                <NumberField label="Height (px)" {...getTextFieldProps('height')} />
                            </Row>
                            <Stack gap={2} direction="row-reverse">
                                <PillButton
                                    endIcon={<ArrowForward />}
                                    onClick={handleGenerate}
                                    disabled={generateButtonIsDisabled}
                                >
                                    Generate
                                </PillButton>
                                {resetButtonIsVisible && (
                                    <Button variant="text" onClick={handleResetToDefaults}>
                                        Reset to defaults
                                    </Button>
                                )}
                            </Stack>
                            {generatedUrl && (
                                <CodeBlock code={`![${username}'s GitHub Contributions](${generatedUrl})`} />
                            )}
                        </Stack>
                    </ContentPaper>
                </Container>
            </main>
        </>
    );
}
