import { Options, OptionsWithDimensions } from '@/models/Options';
import DateRange from '@/types/interfaces/DateRange';
import { daysBeforeToday, endOfToday } from '@/utilities/date';

export namespace OptionsService {
    export const CACHE_TIME_SECONDS = 60 * 10; // 10 Minutes

    export const DefaultOptions: Options = {
        colour: '#4BB5FC',
        bgColour: 'transparent',
        dotColour: '#E5E5E5',
        days: 30,
    };

    export function getOptions(options: Partial<Options> = {}): OptionsWithDimensions {
        const mergedOptions = { ...DefaultOptions, ...options };

        const width = mergedOptions.days * 35 + 100;
        return { ...mergedOptions, width, height: 450 };
    }

    export function getDateRange(options: Options): DateRange {
        const from = daysBeforeToday(options.days);
        const to = endOfToday();
        return { from, to };
    }
}
