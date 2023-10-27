import { MetricsWithUsernameModel } from '@/models/MetricsModel';
import { MetricsService } from '@/services/MetricsService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const { username, since } = await MetricsWithUsernameModel.parseAsync(req.query);

    const count =
        since === undefined
            ? await MetricsService.getGeneratedGraphCountForUser(username)
            : await MetricsService.getGeneratedGraphCountForUserSince(username, since);

    res.status(200).json({ count });
}
