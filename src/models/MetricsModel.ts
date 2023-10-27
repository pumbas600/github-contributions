import { z } from 'zod';

export const MetricsModel = z.object({
    since: z.coerce.date().optional(),
});
