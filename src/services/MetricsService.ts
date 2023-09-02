import { db } from '@/firebase';
import ContributionMetric from '@/types/interfaces/ContributionMetric';
import { addDoc, collection } from 'firebase/firestore';

export namespace MetricsService {
    const githubContributionMetrics = collection(db, 'github_contribution_metrics');

    export async function logContributionsRequest(username: string): Promise<void> {
        const metric: ContributionMetric = {
            username,
            date: new Date(),
            environment: process.env.NODE_ENV,
        };

        const docRef = await addDoc(githubContributionMetrics, metric);
        console.log(`Logged contributions request for user '${username}' with id: ${docRef.id}`);
    }
}
