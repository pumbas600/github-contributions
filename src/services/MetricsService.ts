import { db } from '@/firebase';
import ContributionMetric from '@/types/interfaces/ContributionMetric';
import { addDoc, collection } from 'firebase/firestore';

export namespace MetricsService {
    const githubContributionMetrics = collection(db, 'github_contribution_metrics');

    export async function logContributionsRequest(
        partialMetric: Omit<ContributionMetric, 'date' | 'environment'>,
    ): Promise<void> {
        const metric: ContributionMetric = {
            ...partialMetric,
            date: new Date(),
            environment: process.env.NODE_ENV,
        };

        const docRef = await addDoc(githubContributionMetrics, metric);
        console.log(`Logged contributions request for user '${metric.username}' with id: ${docRef.id}`);
    }
}
