import InternalServerError from '@/errors/InternalServerError';
import NotFoundError from '@/errors/NotFoundError';
import Contribution from '@/types/interfaces/Contribution';

export namespace ContributionsService {
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

    export async function getContributions(username: string, from: Date, to: Date): Promise<Contribution[]> {
        const body = {
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

        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: HEADERS,
        });

        const json = (await res.json()) as ContributionResponse;
        if ('errors' in json) {
            if (isUserNotFound(json)) {
                throw new NotFoundError(`User '${username}' does not exist`);
            }

            console.error(json.errors);
            throw new InternalServerError(`There was an unhandled error while fetching contributions for ${username}`);
        }

        const contributions: Contribution[] = [];

        json.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week) => {
            week.contributionDays.forEach((contributionDay) => {
                const contributionDate = new Date(contributionDay.date).getDate();
                contributions.push({
                    count: contributionDay.contributionCount,
                    date: contributionDate,
                });
            });
        });

        return contributions;
    }
}
