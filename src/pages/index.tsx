import CodeBlock from '@/components/CodeBlock';
import Collapsible from '@/components/Collapsible';
import ColourField, { ColourFieldProps } from '@/components/forms/ColourField';
import LabelledCheckbox from '@/components/forms/LabelledCheckbox';
import NumberField from '@/components/forms/NumberField';
import PillButton from '@/components/forms/PillButton';
import Row from '@/components/forms/Row';
import useDebounce from '@/hooks/useDebounce';
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
                <Container maxWidth="md" sx={{ marginY: 5 }}>
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
                            <Collapsible title="Theme Configuration">
                                <Row>
                                    <LabelledCheckbox
                                        label="Use transparent background"
                                        checked={transparentBackground}
                                        onChange={handleChangeTransparentBackground}
                                    />
                                    <LabelledCheckbox
                                        label="Shade area below the line"
                                        checked={options.area}
                                        onChange={(e) => handleOptionChange('area', e.target.checked)}
                                    />
                                </Row>
                                <Row>
                                    <ColourField label="Primary Colour" {...getColourFieldProps('colour')} />
                                    {!transparentBackground && (
                                        <ColourField label="Background Colour" {...getColourFieldProps('bgColour')} />
                                    )}
                                    <ColourField label="Dot Colour" {...getColourFieldProps('dotColour')} />
                                </Row>
                                <Row>
                                    <NumberField label="Duration (Days)" {...getTextFieldProps('days')} />
                                    <NumberField label="Width (px)" {...getTextFieldProps('width')} />
                                    <NumberField label="Height (px)" {...getTextFieldProps('height')} />
                                </Row>
                                {resetButtonIsVisible && (
                                    <Stack direction="row-reverse">
                                        <Button variant="text" onClick={handleResetToDefaults}>
                                            Reset to defaults
                                        </Button>
                                    </Stack>
                                )}
                            </Collapsible>
                            {generatedUrl && (
                                <>
                                    {debouncedGeneratedUrl && (
                                        <img src={debouncedGeneratedUrl} alt={contributionImageAltText} />
                                    )}
                                    <CodeBlock code={`![${contributionImageAltText}](${generatedUrl})`} />
                                    <CodeBlock
                                        code={`<img src="${generatedUrl}" alt="${contributionImageAltText}" />`}
                                    />
                                </>
                            )}
                        </Stack>
                    </ContentPaper>
                </Container>
            </main>
        </>
    );
}
