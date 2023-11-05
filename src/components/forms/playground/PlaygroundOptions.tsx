import GitHubCard, { GitHubCardHeader, GitHubContent } from '@/components/cards/GitHubCard';
import { Button, Divider, StandardTextFieldProps, TextField, useTheme } from '@mui/material';
import ColourField, { ColourFieldProps, ColourValidator } from '../ColourField';
import NumberField, { PositiveNumberValidator } from '../NumberField';
import { Options } from '@/models/Options';
import { fromEntries, toEntries } from '@/utilities';
import { OptionsService } from '@/services/OptionsService';
import { useEffect, useState } from 'react';
import LabelledCheckbox from '../LabelledCheckbox';
import Validator from '@/types/interfaces/Validator';

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

    const getFieldProps = (key: keyof StringifiedOptions): StandardTextFieldProps & ColourFieldProps => {
        return {
            id: key,
            fullWidth: true,
            error: errors[key] !== undefined,
            helperText: errors[key],
            value: options[key] ?? DefaultOptions[key],
            onChange(value) {
                const stringValue = typeof value === 'string' ? value : value.target.value;
                handleOptionChange(key, stringValue);
            },
        };
    };

    return (
        <GitHubCard>
            <GitHubContent>
                <GitHubCardHeader header="Get started with your username" />
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
            </GitHubContent>
            <Divider />
            <GitHubContent>
                <LabelledCheckbox
                    containerSx={{ mb: -1 }}
                    label="Use coloured background"
                    checked={!isBackgroundTransparent}
                    onChange={handleChangeTransparentBackground}
                />
                <ColourField label="Primary Colour" {...getFieldProps('colour')} />
                {!isBackgroundTransparent && <ColourField label="Background Colour" {...getFieldProps('bgColour')} />}
                <ColourField label="Dot Colour" value="#000000" {...getFieldProps('dotColour')} />
                <NumberField label="Duration (days)" {...getFieldProps('days')} />
                <NumberField label="Border Radius" {...getFieldProps('borderRadius')} />
                {isResetButtonVisible && (
                    <Button sx={{ mt: -1 }} onClick={handleResetToDefaults}>
                        Reset to defaults
                    </Button>
                )}
            </GitHubContent>
        </GitHubCard>
    );
}
