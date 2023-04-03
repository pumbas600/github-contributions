import BadRequestError from '@/errors/BadRequestError';
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
        };
    }

    interface ContributionResponseError {
        errors: {
            path: string[];
            extensions: {
                code: string;
                typeName: string;
                argymentName: string;
            };
            locations: {
                line: number;
                column: number;
            }[];
            message: string;
        }[];
    }

    type ContributionResponse = ContributionResponseData | ContributionResponseError;

    const HEADERS = new Headers({ Authorization: `bearer ${process.env.GITHUB_TOKEN}` });

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
            }`,
        };

        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: HEADERS,
        });

        const json = (await res.json()) as ContributionResponse;
        if (!res.ok) {
            console.error(json);
            throw new BadRequestError(`Failed to fetch contributions for ${username}: ${res.statusText}`);
        } else if ('errors' in json) {
            if (json.errors.some((error) => error.extensions.argymentName === 'login')) {
                throw new NotFoundError(`User ${username} not found`);
            }

            console.error(json.errors);
            throw new Error(
                `There was an unhandled error while fetching contributions for ${username}. Please report it at https://github.com/pumbas600/github-contributions/issues.`,
            );
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
