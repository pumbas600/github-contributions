import { z } from 'zod';
import { BooleanModel, ColourModel } from './UtilModels';

export const OptionsModel = z.object({
    colour: ColourModel.optional(),
    bgColour: ColourModel.optional(),
    dotColour: ColourModel.optional(),
    width: z.coerce.number().positive().optional(),
    height: z.coerce.number().positive().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    days: z.coerce.number().positive().optional(),
    area: BooleanModel.optional(),
});

export type Options = Required<z.infer<typeof OptionsModel>>;
