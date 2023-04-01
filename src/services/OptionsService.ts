import { Options } from '@/models/Options';

export namespace OptionsService {
    export const DefaultOptions: Omit<Options, 'from' | 'to'> = {
        color: '5bcdec',
        width: 1200,
        height: 450,
        days: 30,
    };

    const ONE_DAY = 1000 * 60 * 60 * 24;

    export function getOptions(options: Partial<Options> = {}): Options {
        const mergedOptions = { ...DefaultOptions, ...options };
        mergedOptions.color = `#${mergedOptions.color}`; // Add the # back to the hexadecimal colour
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
