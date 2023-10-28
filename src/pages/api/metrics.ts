import { MetricsModel } from '@/models/MetricsModel';
import { ErrorService } from '@/services/ErrorService';
import { MetricsService } from '@/services/MetricsService';
import { daysBeforeToday } from '@/utilities/date';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { days } = await MetricsModel.parseAsync(req.query);

        const count =
            days === undefined
                ? await MetricsService.getGeneratedGraphCount()
                : await MetricsService.getGeneratedGraphCountSince(daysBeforeToday(days));

        res.status(200).json({ count });
    } catch (error) {
        ErrorService.handleError(res, error);
    }
}
