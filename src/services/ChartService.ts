import { Size } from '@/types/interfaces/Vectors';

export namespace ChartService {
    export interface YAxisScale {
        lineCount: number;
        axisMaxValue: number;
        axisStepValue: number;
    }

    type NumericValues<T> = {
        [K in keyof T]: T[K] extends number ? T[K] : never;
    };

    export function calculateYAxisScale<T>(
        lineCount: number,
        data: NumericValues<T>[],
        key: keyof NumericValues<T>,
    ): YAxisScale {
        const maxValue = Math.max(...data.map((item) => item[key]));
        const axisStepValue = Math.ceil(maxValue / lineCount);
        const axisMaxValue = axisStepValue * lineCount;

        return {
            lineCount,
            axisMaxValue,
            axisStepValue,
        };
    }
}
