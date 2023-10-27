import { MetricsModel } from '@/models/MetricsModel';
import { ErrorService } from '@/services/ErrorService';
import { MetricsService } from '@/services/MetricsService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { since } = await MetricsModel.parseAsync(req.query);

        const count =
            since === undefined
                ? await MetricsService.getGeneratedGraphCount()
                : await MetricsService.getGeneratedGraphCountSince(since);

        res.status(200).json({ count });
    } catch (error) {
        ErrorService.handleError(res, error);
    }
}
