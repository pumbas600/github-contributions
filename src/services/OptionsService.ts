import { Options } from '@/models/Options';
import { OptionalKeys } from '@/types/utility';

export namespace OptionsService {
    export type ContributionOptions = OptionalKeys<Options, 'from' | 'to'>;

    export const DefaultOptions: ContributionOptions = {
        color: '#5bcdec',
        bg: '#0d1117',
        width: 1200,
        height: 450,
        days: 30,
        area: true,
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
