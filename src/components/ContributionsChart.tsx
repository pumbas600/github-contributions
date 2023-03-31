import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface Contribution {
    day: number;
    count: number;
}

export default function ContributionsChart() {
    const contributions: Contribution[] = [
        {
            day: 1,
            count: 0,
        },
        {
            day: 2,
            count: 1,
        },
        {
            day: 3,
            count: 2,
        },
        {
            day: 4,
            count: 5,
        },
        {
            day: 5,
            count: 8,
        },
        {
            day: 6,
            count: 12,
        },
        {
            day: 7,
            count: 6,
        },
        {
            day: 8,
            count: 4,
        },
        {
            day: 9,
            count: 3,
        },
        {
            day: 10,
            count: 5,
        },
    ];

    return (
        <LineChart width={900} height={400} data={contributions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
    );
}
