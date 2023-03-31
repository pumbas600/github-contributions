import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface Contribution {
    day: number;
    count: number;
}

const LabelStyles = {
    fill: '#5bcdec',
    fontSize: 20,
    fontWeight: 700,
};

const AxisStyles = {
    tick: { fill: '#5bcdec' },
};

// You don't seem to be able to directly assign this to a react component
const htmlXmlNs = { xmlns: 'http://www.w3.org/1999/xhtml' };

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
        <LineChart
            width={1200}
            height={450}
            data={contributions}
            margin={{
                top: 80,
                right: 20,
                bottom: 30,
                left: 30,
            }}
            style={{
                backgroundColor: '#0d1117',
            }}
        >
            <text x={1200 / 2 + 30} y={32} fill="#5bcdec" textAnchor="middle" dominantBaseline="central">
                <tspan fontSize={32} fontWeight={800}>
                    {`pumbas600's Contributions`}
                </tspan>
            </text>
            <CartesianGrid strokeDasharray="3 3" stroke="#5bcdec" strokeOpacity={0.3} />
            <XAxis dataKey="day" label={{ value: 'Day', dy: 15, ...LabelStyles }} {...AxisStyles} />
            <YAxis
                label={{
                    value: 'Contributions',
                    angle: -90,
                    dx: -15,
                    ...LabelStyles,
                }}
                {...AxisStyles}
            />
            <Line
                type="monotone"
                dataKey="count"
                stroke="#5bcdec"
                strokeWidth={4}
                fill="#5bcdec"
                dot={{ fill: 'white', stroke: 'white' }}
            />
        </LineChart>
    );
}
