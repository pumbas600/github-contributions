import { z } from 'zod';

export const MetricsModel = z.object({
    since: z.coerce.date().optional(),
});

export const MetricsWithUsernameModel = MetricsModel.extend({
    username: z.string().min(1),
});
