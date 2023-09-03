import { db } from '@/firebase';
import ContributionMetric, {
    CachedContributionMetric,
    UncachedContributionMetric,
} from '@/types/interfaces/ContributionMetric';
import { addDoc, collection } from 'firebase/firestore';

export namespace MetricsService {
    const githubContributionMetrics = collection(db, 'github_contribution_metrics');

    export async function logContributionsRequest(
        partialMetric: Omit<UncachedContributionMetric, 'date' | 'environment' | 'cacheHit'>,
    ): Promise<void> {
        const metric: UncachedContributionMetric = {
            ...partialMetric,
            cacheHit: false,
            date: new Date(),
            environment: process.env.NODE_ENV,
        };

        logMetric(metric);
    }

    export async function logCachedContributionsRequest(username: string): Promise<void> {
        const metric: CachedContributionMetric = {
            username,
            cacheHit: true,
            date: new Date(),
            environment: process.env.NODE_ENV,
        };

        logMetric(metric);
    }

    async function logMetric(metric: ContributionMetric) {
        const docRef = await addDoc(githubContributionMetrics, metric);
        console.log(`Logged contributions request for user '${metric.username}' with id: '${docRef.id}'.`);
    }
}
