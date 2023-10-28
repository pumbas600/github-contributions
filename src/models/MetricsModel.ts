import { z } from 'zod';

export const MetricsModel = z.object({
    days: z.coerce.number().optional(),
});

export const MetricsWithUsernameModel = MetricsModel.extend({
    username: z.string().min(1),
});
