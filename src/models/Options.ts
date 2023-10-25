import { z } from 'zod';
import { ColourModel } from './UtilModels';
import { ChartType } from '@/types/enums/ChartType';

export const OptionsModel = z.object({
    colour: ColourModel.optional(),
    bgColour: ColourModel.or(z.literal('transparent')).optional(),
    dotColour: ColourModel.optional(),
    // GitHub doesn't allow queries for contributions over a period of more than a year
    days: z.coerce.number().positive().max(365).optional(),
    chart: z.nativeEnum(ChartType).optional(),
});

export type Options = Required<z.infer<typeof OptionsModel>>;
export type OptionsWithDimensions = Options & { width: number; height: number };
