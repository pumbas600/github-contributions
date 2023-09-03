export interface CommonContributionMetric {
    username: string;
    date: Date;
    environment: string;
}

export interface CachedContributionMetric extends CommonContributionMetric {
    cacheHit: true;
}

export interface UncachedContributionMetric extends CommonContributionMetric {
    cacheHit: false;
    fetchingMs: number;
    chartRenderingMs: number;
}

type ContributionMetric = CachedContributionMetric | UncachedContributionMetric;
export default ContributionMetric;
