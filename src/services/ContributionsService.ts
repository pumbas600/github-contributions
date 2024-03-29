import Config from '@/config';
import InternalServerError from '@/errors/InternalServerError';
import NotFoundError from '@/errors/NotFoundError';
import Contribution from '@/types/interfaces/Contribution';
import { ContributionResponse, ContributionResponseError } from '@/types/interfaces/ContributionResponses';
import DateRange from '@/types/interfaces/DateRange';

export namespace ContributionsService {
    const WARN_RATE_LIMIT_BOUNDARY = 100;

    const HEADERS = new Headers({ Authorization: `bearer ${Config.github.token}` });

    type GetContributionsReponse = {
        contributions: Contribution[];
        fetchingMs: number;
    };

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

    export async function getContributions(
        username: string,
        { from, to }: DateRange,
    ): Promise<GetContributionsReponse> {
        const body = generateGraphQLBody(username, from, to);

        let start = Date.now();
        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: HEADERS,
        });

        const fetchingMs = Date.now() - start;

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

        json.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week) => {
            week.contributionDays.forEach((contributionDay) => {
                const contributionDate = new Date(contributionDay.date).getDate();
                contributions.push({
                    count: contributionDay.contributionCount,
                    date: contributionDate,
                });
            });
        });

        return { contributions, fetchingMs };
    }
}
