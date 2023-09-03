import { db } from '@/firebase';
import { ContributionRequestMetric, ContributionResponseMetric } from '@/types/interfaces/ContributionMetric';
import { addDoc, collection } from 'firebase/firestore';

export namespace MetricsService {
    const contributionRequestMetrics = collection(db, 'contribution_request_metrics');
    const contributionResponseMetrics = collection(db, 'contribution_response_metrics');

    export async function logContributionResponse(
        partialMetric: Omit<ContributionResponseMetric, 'date' | 'environment'>,
    ): Promise<void> {
        const metric: ContributionResponseMetric = {
            ...partialMetric,
            date: new Date(),
            environment: process.env.NODE_ENV,
        };

        const docRef = await addDoc(contributionResponseMetrics, metric);
        console.log(`Logged contribution response for user '${metric.username}' with id: '${docRef.id}'.`);
    }

    export async function logContributionRequest(username: string): Promise<void> {
        const metric: ContributionRequestMetric = {
            username,
            date: new Date(),
            environment: process.env.NODE_ENV,
        };

        const docRef = await addDoc(contributionRequestMetrics, metric);
        console.log(`Logged contribution request for user '${metric.username}' with id: '${docRef.id}'.`);
    }
}
