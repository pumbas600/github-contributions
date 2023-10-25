import { ValuesOf } from '../utility';

export const ChartType = {
    Line: 'line',
    Bar: 'bar',
} as const;

export type ChartType = ValuesOf<typeof ChartType>;
