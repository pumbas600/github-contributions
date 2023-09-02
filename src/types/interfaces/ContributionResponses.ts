export interface ContributionDay {
    contributionCount: number;
    date: string;
}

export interface ContributionResponseData {
    data: {
        user: {
            contributionsCollection: {
                contributionCalendar: {
                    totalContributions: number;
                    weeks: {
                        contributionDays: ContributionDay[];
                    }[];
                };
            };
        };
        rateLimit: {
            limit: number;
            cost: number;
            remaining: number;
            resetAt: string;
        };
    };
}

export interface ContributionResponseError {
    errors: {
        type: 'NOT_FOUND';
        path: string[];
        locations: {
            line: number;
            column: number;
        }[];
        message: string;
    }[];
}

export type ContributionResponse = ContributionResponseData | ContributionResponseError;
