import InternalServerError from '@/errors/InternalServerError';
import NotFoundError from '@/errors/NotFoundError';
import Contribution from '@/types/interfaces/Contribution';

export namespace ContributionsService {
    const WARN_RATE_LIMIT_BOUNDARY = 100;

    interface ContributionDay {
        contributionCount: number;
        date: string;
    }

    interface ContributionResponseData {
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

    interface ContributionResponseError {
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

    type ContributionResponse = ContributionResponseData | ContributionResponseError;

    const HEADERS = new Headers({ Authorization: `bearer ${process.env.GITHUB_TOKEN}` });

    function isUserNotFound(res: ContributionResponseError): boolean {
        return res.errors.some(
            (error) => error.type === 'NOT_FOUND' && error.path.length === 1 && error.path[0] === 'user',
        );
    }

    function generateGraphQLBody(username: string, from: Date, to: Date): Record<string, string> {
        return {
            query: `query { 
                user(login: "${username}") {
                    contributionsCollection(from: "${from.toISOString()}" to: "${to.toISOString()}") {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                }
                            }
                        }
                    }
                }
                rateLimit {
                    limit
                    cost
                    remaining
                    resetAt
                }
            }`,
        };
    }

    export async function getContributions(username: string, from: Date, to: Date): Promise<Contribution[]> {
        const body = generateGraphQLBody(username, from, to);

        let start = Date.now();
        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: HEADERS,
        });
        console.log(`Fetching contributions took ${Date.now() - start}ms`);

        const json = (await res.json()) as ContributionResponse;
        if ('errors' in json) {
            if (isUserNotFound(json)) {
                throw new NotFoundError(`User '${username}' does not exist`);
            }

            console.error(json.errors);
            throw new InternalServerError(`There was an unhandled error while fetching contributions for ${username}`);
        }

        if (json.data.rateLimit.remaining < WARN_RATE_LIMIT_BOUNDARY) {
            console.warn(`Rate limit is low: ${json.data.rateLimit.remaining}/${json.data.rateLimit.limit}`);
        }

        const contributions: Contribution[] = [];

        start = Date.now();
        json.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week) => {
            week.contributionDays.forEach((contributionDay) => {
                const contributionDate = new Date(contributionDay.date).getDate();
                contributions.push({
                    count: contributionDay.contributionCount,
                    date: contributionDate,
                });
            });
        });
        console.log(`Parsing contributions took ${Date.now() - start}ms`);

        return contributions;
    }
}
