import { Button, Stack, TextFieldProps, useTheme } from '@mui/material';
import FormRow from '../FormRow';
import LabelledCheckbox from '../LabelledCheckbox';
import { useEffect, useState } from 'react';
import { OptionsService } from '@/services/OptionsService';
import { fromEntries, toEntries } from '@/utilities';
import ColourField, { ColourFieldProps } from '../ColourField';
import NumberField from '../NumberField';
import { Options } from '@/models/Options';

export type StringifiedOptions = Record<keyof Options, string>;
export type OptionErrors = Partial<StringifiedOptions>;

export interface PlaygroundOptionsProps {
    errors: OptionErrors;
    setErrors: (errors: OptionErrors) => void;
    options: StringifiedOptions;
    onChange: (options: StringifiedOptions) => void;
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

export default function PlaygroundOptions({ errors, setErrors, options, onChange }: PlaygroundOptionsProps) {
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
        <Stack gap={3}>
            <FormRow rowGap={0.5}>
                <LabelledCheckbox
                    label="Use coloured background"
                    checked={!isBackgroundTransparent}
                    onChange={handleChangeTransparentBackground}
                />
            </FormRow>
            <FormRow rowGap={3}>
                <ColourField label="Primary colour" {...getColourFieldProps('colour')} />
                {!isBackgroundTransparent && (
                    <ColourField label="Background Colour" {...getColourFieldProps('bgColour')} />
                )}
                <ColourField label="Dot colour" {...getColourFieldProps('dotColour')} />
            </FormRow>
            <FormRow rowGap={3}>
                <NumberField label="Duration (days)" {...getTextFieldProps('days')} />
                <NumberField label="Border Radius" {...getTextFieldProps('borderRadius')} />
            </FormRow>
            {isResetButtonVisible && (
                <FormRow direction="row-reverse">
                    <Button onClick={handleResetToDefaults}>Reset to defaults</Button>
                </FormRow>
            )}
        </Stack>
    );
}
