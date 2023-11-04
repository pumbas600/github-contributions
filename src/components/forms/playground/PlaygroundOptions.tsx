import GitHubCard, { GitHubCardHeader, GitHubContent } from '@/components/cards/GitHubCard';
import Subtitle from '@/components/typography/Subtitle';
import { Button, TextField, TextFieldProps, useTheme } from '@mui/material';
import ColourField, { ColourFieldProps } from '../ColourField';
import NumberField from '../NumberField';
import { Options } from '@/models/Options';
import { fromEntries, toEntries } from '@/utilities';
import { OptionsService } from '@/services/OptionsService';
import { useEffect, useState } from 'react';
import LabelledCheckbox from '../LabelledCheckbox';

export type StringifiedOptions = Record<keyof Options, string>;
export type OptionErrors = Partial<StringifiedOptions>;

interface PlaygroundOptionsProps {
    errors: OptionErrors;
    options: StringifiedOptions;
    username: string;
    setErrors: (errors: OptionErrors) => void;
    onChange: (options: StringifiedOptions) => void;
    onChangeUsername: (username: string) => void;
}

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

        return /^#[A-Fa-f\d]{6}$/i.test(value);
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

export const DefaultOptions = fromEntries<StringifiedOptions>(
    toEntries(OptionsService.DefaultOptions).map(([key, value]) => [key, value?.toString()]),
);

export function getOptionsWithoutDefaults(options: StringifiedOptions): Partial<StringifiedOptions> {
    return fromEntries<Partial<StringifiedOptions>>(
        toEntries(options).filter(([key, value]) => value !== DefaultOptions[key]),
    );
}

export default function PlaygroundOptions({
    errors,
    options,
    username,
    setErrors,
    onChange,
    onChangeUsername,
}: PlaygroundOptionsProps) {
    const theme = useTheme();

    const [previousBgColour, setPreviousBgColour] = useState<string | null>(null);

    useEffect(() => {
        if (options.bgColour !== 'transparent') {
            setPreviousBgColour(options.bgColour);
        }
    }, [options.bgColour]);

    const isBackgroundTransparent = options.bgColour === 'transparent';
    const isResetButtonVisible = Object.keys(getOptionsWithoutDefaults(options)).length != 0;

    const handleOptionChange = <Key extends keyof StringifiedOptions>(
        key: Key,
        value: StringifiedOptions[Key],
    ): void => {
        const newOptions = { ...options, [key]: value };

        const validator = Validators[key];
        const newErrors = { ...errors };
        if (!validator.isValid(value)) {
            newErrors[key] = validator.error;
        } else {
            delete newErrors[key];
        }

        onChange(newOptions);
        setErrors(newErrors);
    };

    const handleChangeTransparentBackground = (e: React.ChangeEvent<HTMLInputElement>): void => {
        handleOptionChange(
            'bgColour',
            e.target.checked ? previousBgColour ?? theme.palette.background.paper : 'transparent',
        );
    };

    const handleResetToDefaults = (): void => {
        onChange(DefaultOptions);
    };

    const getTextFieldProps = (key: keyof StringifiedOptions): TextFieldProps => {
        return {
            fullWidth: true,
            error: !!errors[key],
            helperText: errors[key],
            value: options[key] ?? DefaultOptions[key],
            onChange: (e) => handleOptionChange(key, e.target.value),
        };
    };

    const getColourFieldProps = (key: 'colour' | 'bgColour' | 'dotColour'): ColourFieldProps => {
        return {
            id: key,
            error: errors[key] !== undefined,
            helperText: errors[key],
            value: options[key] ?? DefaultOptions[key],
            onChange: (value) => handleOptionChange(key, value),
        };
    };

    return (
        <GitHubCard>
            <GitHubCardHeader header="Options" />
            <GitHubContent>
                <TextField
                    size="medium"
                    spellCheck={false}
                    required
                    fullWidth
                    label="GitHub username"
                    placeholder="E.g. pumbas600"
                    value={username}
                    onChange={(e) => onChangeUsername(e.target.value)}
                />
                <LabelledCheckbox
                    sx={{ mb: -1 }}
                    label="Use coloured background"
                    checked={!isBackgroundTransparent}
                    onChange={handleChangeTransparentBackground}
                />
                <ColourField label="Primary Colour" {...getColourFieldProps('colour')} />
                {!isBackgroundTransparent && (
                    <ColourField label="Background Colour" {...getColourFieldProps('bgColour')} />
                )}
                <ColourField label="Dot Colour" value="#000000" {...getColourFieldProps('dotColour')} />
                <NumberField label="Duration (days)" {...getTextFieldProps('days')} />
                <NumberField label="Border Radius" {...getTextFieldProps('borderRadius')} />
                {isResetButtonVisible && (
                    <Button sx={{ mt: -1 }} onClick={handleResetToDefaults}>
                        Reset to defaults
                    </Button>
                )}
            </GitHubContent>
        </GitHubCard>
    );
}
