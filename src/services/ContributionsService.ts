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

    interface ContributionOptions {
        from?: Date;
        to?: Date;
        numberOfDays?: number;
    }

    const ONE_DAY = 1000 * 60 * 60 * 24;
    const HEADERS = new Headers({ Authorization: `bearer ${process.env.GITHUB_TOKEN}` });

    export async function getContributions(
        username: string,
        options: ContributionOptions = {},
    ): Promise<Contribution[]> {
        const today = new Date();

        const numberOfDays = options.numberOfDays ?? 30;
        const to = options.to ?? today;
        const from = options.from ?? new Date(to.getTime() - numberOfDays * ONE_DAY);

        if (from.getTime() > to.getTime()) {
            throw new Error(`The "from" date ${from.toDateString()} must be before the "to" date ${to.toDateString()}`);
        }

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
