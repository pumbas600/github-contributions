import { OptionsWithDimensions } from '@/models/Options';
import Contribution from '@/types/interfaces/Contribution';
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from 'recharts';
import LineChart from './LineChart';

interface ContributionProps {
    username: string;
    options: OptionsWithDimensions;
    contributions: Contribution[];
}

export default function ContributionsChart({ username, options, contributions }: ContributionProps) {
    const labelStyles = {
        fill: options.colour,
        fontSize: 20,
        fontWeight: 600,
    };

    const axisStyles = {
        tick: { fill: options.colour },
        allowDecimals: false,
    };

    return (
        <ComposedChart
            width={options.width}
            height={options.height}
            data={contributions}
            margin={{
                top: 90,
                right: 30,
                bottom: 40,
                left: 40,
            }}
            style={{
                backgroundColor: options.bgColour,
            }}
        >
            <text
                x={options.width / 2 + 30}
                y={40}
                fill={options.colour}
                textAnchor="middle"
                dominantBaseline="central"
            >
                <tspan fontSize={32} fontWeight={600}>
                    {`${username}'s Contributions`}
                </tspan>
            </text>
            <CartesianGrid strokeDasharray="3 3" stroke={options.colour} strokeOpacity={0.3} />
            <XAxis dataKey="date" label={{ value: 'Day', dy: 30, ...labelStyles }} {...axisStyles} />
            <YAxis
                tickCount={6}
                label={{
                    value: 'Contributions',
                    angle: -90,
                    dx: -30,
                    ...labelStyles,
                }}
                {...axisStyles}
            />
            {options.chart === 'line' && <LineChart options={options} />}
            {options.chart === 'bar' && <Bar dataKey="count" fill={options.colour} />}
        </ComposedChart>
    );
}
