import { z } from 'zod';
import { ColourModel } from './UtilModels';

export const OptionsModel = z.object({
    colour: ColourModel.optional(),
    bgColour: ColourModel.or(z.literal('transparent')).optional(),
    dotColour: ColourModel.optional(),
    days: z.coerce.number().positive().optional(),
});

export type Options = Required<z.infer<typeof OptionsModel>>;
export type OptionsWithDimensions = Options & { width: number; height: number };
