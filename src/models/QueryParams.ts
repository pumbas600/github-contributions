import { z } from 'zod';
import { OptionsModel } from './Options';

export const QueryParamsModel = OptionsModel.extend({
    username: z.string().min(1),
});

export type QueryParams = z.infer<typeof QueryParamsModel>;
