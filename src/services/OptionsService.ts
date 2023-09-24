import { Options } from '@/models/Options';

export namespace OptionsService {
    export type ContributionOptions = Omit<Options, 'from' | 'to'>;

    export const CACHE_TIME_SECONDS = 60 * 10; // 10 Minutes

    export const DefaultOptions: ContributionOptions = {
        colour: '#4BB5FC',
        bgColour: 'transparent',
        dotColour: '#E5E5E5',
        width: 1200,
        height: 450,
        days: 30,
    };

    const ONE_DAY = 1000 * 60 * 60 * 24;

    export function getOptions(options: Partial<Options> = {}): Options {
        const mergedOptions = { ...DefaultOptions, ...options };
        mergedOptions.to ??= new Date();
        mergedOptions.from ??= new Date(mergedOptions.to.getTime() - mergedOptions.days * ONE_DAY);

        if (mergedOptions.from.getTime() > mergedOptions.to.getTime()) {
            throw new Error(
                `The "from" date ${mergedOptions.from.toDateString()} must be before the "to" date ${mergedOptions.to.toDateString()}`,
            );
        }

        // For some reason it thinks that 'to' and 'from' are possibly undefined.
        return mergedOptions as Options;
    }
}
