import { Options, OptionsWithDimensions } from '@/models/Options';
import { ChartType } from '@/types/enums/ChartType';
import DateRange from '@/types/interfaces/DateRange';

export namespace OptionsService {
    export const CACHE_TIME_SECONDS = 60 * 10; // 10 Minutes

    export const DefaultOptions: Options = {
        colour: '#4BB5FC',
        bgColour: 'transparent',
        dotColour: '#E5E5E5',
        days: 30,
        chart: ChartType.Line,
    };

    export function getOptions(options: Partial<Options> = {}): OptionsWithDimensions {
        const mergedOptions = { ...DefaultOptions, ...options };

        const width = mergedOptions.days * 35 + 100;
        return { ...mergedOptions, width, height: 450 };
    }

    export function getDateRange(options: Options): DateRange {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - options.days);
        return { from, to: today };
    }
}
