import { ErrorService } from '@/services/ErrorService';
import { MetricsService } from '@/services/MetricsService';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const UsernameModel = z.object({ username: z.string() });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { username } = await UsernameModel.parseAsync(req.query);

        await MetricsService.logContributionRequest(username);

        res.status(204).end();
    } catch (error) {
        ErrorService.handleError(res, error);
    }
}
