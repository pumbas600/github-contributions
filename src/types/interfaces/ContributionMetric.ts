export interface ContributionRequestMetric {
    username: string;
    date: Date;
    environment: string;
}

export interface ContributionResponseMetric extends ContributionRequestMetric {
    fetchingMs: number;
    chartRenderingMs: number;
}
