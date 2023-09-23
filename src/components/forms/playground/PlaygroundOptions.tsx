import { Button, Stack, TextFieldProps, useTheme } from '@mui/material';
import FormRow from '../FormRow';
import LabelledCheckbox from '../LabelledCheckbox';
import { useEffect, useState } from 'react';
import { OptionsService } from '@/services/OptionsService';
import { fromEntries, toEntries } from '@/utilities';
import ColourField, { ColourFieldProps } from '../ColourField';
import NumberField from '../NumberField';

export type OptionErrors = Partial<Record<keyof OptionsService.ContributionOptions, string>>;

// Stingify all options except booleans as that is what is returned from the inputs.
export type StringifiedOptions = {
    [Key in keyof OptionsService.ContributionOptions]: OptionsService.ContributionOptions[Key] extends boolean
        ? boolean
        : string;
};

export interface PlaygroundOptionsProps {
    errors: OptionErrors;
    options: StringifiedOptions;

    /**
     * Called when the playground options selected change.
     *
     * @param options The new options that have been set
     */
    onChange: (options: StringifiedOptions) => void;
}

export const DefaultOptions = fromEntries<StringifiedOptions>(
    toEntries(OptionsService.DefaultOptions).map(([key, value]) => {
        if (typeof value === 'boolean') {
            return [key, value];
        }
        return [key, value?.toString()];
    }),
);

export function getOptionsWithoutDefaults(options: StringifiedOptions): Partial<StringifiedOptions> {
    return fromEntries<Partial<StringifiedOptions>>(
        toEntries(options).filter(([key, value]) => value !== DefaultOptions[key]),
    );
}

export default function PlaygroundOptions({ errors, options, onChange }: PlaygroundOptionsProps) {
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
        onChange(newOptions);
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
            fullWidth: true,
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
                <LabelledCheckbox
                    label="Shade area below the line"
                    checked={options.area}
                    onChange={(e) => handleOptionChange('area', e.target.checked)}
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
                <NumberField label="Width (px)" {...getTextFieldProps('width')} />
                <NumberField label="Height (px)" {...getTextFieldProps('height')} />
            </FormRow>
            {isResetButtonVisible && (
                <FormRow direction="row-reverse">
                    <Button onClick={handleResetToDefaults}>Reset to defaults</Button>
                </FormRow>
            )}
        </Stack>
    );
}