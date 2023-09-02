export default interface ContributionMetric {
    username: string;
    date: Date;
    environment: string;
    fetchingMs: number;
    chartRenderingMs: number;
}
