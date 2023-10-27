import { db } from '@/firebase';
import ContributionMetric from '@/types/interfaces/ContributionMetric';
import { Query, addDoc, collection, getCountFromServer, query, where } from 'firebase/firestore';

export namespace MetricsService {
    const githubContributionMetrics = collection(db, 'github_contribution_metrics');

    export async function logContributionsRequest(
        partialMetric: Omit<ContributionMetric, 'date' | 'environment'>,
    ): Promise<void> {
        const metric: ContributionMetric = {
            ...partialMetric,
            // Usernames are case-insensitive in GitHub, so to be able to get the count for a user we need to
            // store it in a consistent format.
            username: partialMetric.username.toLowerCase(),
            date: new Date(),
            environment: process.env.NODE_ENV,
        };

        const docRef = await addDoc(githubContributionMetrics, metric);
        console.log(`Logged contributions request for user '${metric.username}' with id: '${docRef.id}'.`);
    }

    export async function getGeneratedGraphCount(source: Query = githubContributionMetrics): Promise<number> {
        try {
            const productionQuery = query(source, where('environment', '==', 'production'));
            const response = await getCountFromServer(productionQuery);
            return response.data().count;
        } catch (error) {
            console.error(error);
            return -1;
        }
    }

    export async function getGeneratedGraphCountSince(
        since: Date,
        source = githubContributionMetrics,
    ): Promise<number> {
        const sinceQuery = query(source, where('date', '>=', since));
        return getGeneratedGraphCount(sinceQuery);
    }

    export async function getGeneratedGraphCountForUser(
        username: string,
        source: Query = githubContributionMetrics,
    ): Promise<number> {
        const userQuery = query(source, where('username', '==', username.toLowerCase()));
        return getGeneratedGraphCount(userQuery);
    }

    export async function getGeneratedGraphCountForUserSince(
        username: string,
        since: Date,
        source = githubContributionMetrics,
    ): Promise<number> {
        const sinceQuery = query(source, where('date', '>=', since));
        return getGeneratedGraphCountForUser(username, sinceQuery);
    }
}
