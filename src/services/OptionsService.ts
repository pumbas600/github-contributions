import { Options } from '@/models/Options';

export const DefaultOptions: Options = {
    color: '5bcdec',
    width: 1200,
    height: 450,
};

export namespace OptionsService {
    export function getOptions(options: Partial<Options> = {}): Options {
        const mergedOptions = { ...DefaultOptions, ...options };
        mergedOptions.color = `#${mergedOptions.color}`; // Add the # back to the hexadecimal colour
        return mergedOptions;
    }
}
