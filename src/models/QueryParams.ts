import { z } from 'zod';
import { OptionsModel } from './Options';

export const QueryParamsModel = OptionsModel.extend({
    username: z.string().min(1),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    days: z.coerce.number().positive().optional(),
});

export type QueryParams = z.infer<typeof QueryParamsModel>;
