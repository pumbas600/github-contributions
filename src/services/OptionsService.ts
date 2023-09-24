import { Options } from '@/models/Options';
import DateRange from '@/types/interfaces/DateRange';

export namespace OptionsService {
    export const CACHE_TIME_SECONDS = 60 * 10; // 10 Minutes

    export const DefaultOptions: Options = {
        colour: '#4BB5FC',
        bgColour: 'transparent',
        dotColour: '#E5E5E5',
        width: 1200,
        height: 450,
        days: 30,
    };

    const ONE_DAY = 1000 * 60 * 60 * 24;

    export function getOptions(options: Partial<Options> = {}): Options {
        return { ...DefaultOptions, ...options };
    }

    export function getDateRange(options: Options): DateRange {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - options.days);
        return { from, to: today };
    }
}
