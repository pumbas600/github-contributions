import { MetricsWithUsernameModel } from '@/models/MetricsModel';
import { ErrorService } from '@/services/ErrorService';
import { MetricsService } from '@/services/MetricsService';
import { daysBeforeToday } from '@/utilities/date';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { username, days } = await MetricsWithUsernameModel.parseAsync(req.query);

        const count =
            days === undefined
                ? await MetricsService.getGeneratedGraphCountForUser(username)
                : await MetricsService.getGeneratedGraphCountForUserSince(username, daysBeforeToday(days));

        res.status(200).json({ count });
    } catch (error) {
        ErrorService.handleError(res, error);
    }
}
