import { Options } from '@/models/Options';
import Contribution from '@/types/interfaces/Contribution';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface ContributionProps {
    options: Options;
    contributions: Contribution[];
}

export default function ContributionsChart({ options, contributions }: ContributionProps) {
    const labelStyles = {
        fill: options.color,
        fontSize: 20,
        fontWeight: 700,
    };

    const axisStyles = {
        tick: { fill: options.color },
    };

    return (
        <LineChart
            width={options.width}
            height={options.height}
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
            <text x={1200 / 2 + 30} y={32} fill={options.color} textAnchor="middle" dominantBaseline="central">
                <tspan fontSize={32} fontWeight={800}>
                    {`pumbas600's Contributions`}
                </tspan>
            </text>
            <CartesianGrid strokeDasharray="3 3" stroke={options.color} strokeOpacity={0.3} />
            <XAxis dataKey="date" label={{ value: 'Day', dy: 15, ...labelStyles }} {...axisStyles} />
            <YAxis
                label={{
                    value: 'Contributions',
                    angle: -90,
                    dx: -15,
                    ...labelStyles,
                }}
                {...axisStyles}
            />
            <Line
                type="monotone"
                dataKey="count"
                stroke={options.color}
                strokeWidth={4}
                fill={options.color}
                dot={{ fill: 'white', stroke: 'white' }}
            />
        </LineChart>
    );
}
