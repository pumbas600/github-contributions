import Contribution from '@/types/interfaces/Contribution';

export namespace ContributionsService {
    interface ContributionDay {
        contributionCount: number;
        date: string;
    }

    interface ContributionResponse {
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

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: HEADERS,
        });

        if (!response.ok) {
            console.error(await response.json());
            throw new Error(`Failed to fetch contributions for ${username}: ${response.statusText}`);
        }

        const { data } = (await response.json()) as ContributionResponse;
        const contributions: Contribution[] = [];

        data.user.contributionsCollection.contributionCalendar.weeks.forEach((week) => {
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
