import { OptionsWithDimensions } from '@/models/Options';
import Contribution from '@/types/interfaces/Contribution';
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';

interface ContributionProps {
    username: string;
    options: OptionsWithDimensions;
    contributions: Contribution[];
}

export default function ContributionsChart({ username, options, contributions }: ContributionProps) {
    const labelStyles = {
        fill: options.colour,
        fontSize: 16,
        fontWeight: 600,
    };

    const axisStyles = {
        tick: { fill: options.colour },
        allowDecimals: false,
        fontSize: 12,
    };

    return (
        <ComposedChart
            width={options.width}
            height={options.height}
            data={contributions}
            margin={{
                top: 70,
                right: 30,
                bottom: 40,
                left: 30,
            }}
        >
            <text
                x={options.width / 2 + 30}
                y={30}
                fill={options.colour}
                textAnchor="middle"
                dominantBaseline="central"
            >
                <tspan fontSize={24} fontWeight={600}>
                    {`${username}'s Contributions`}
                </tspan>
            </text>
            <CartesianGrid strokeDasharray="3 3" stroke={options.colour} strokeOpacity={0.3} />
            <XAxis dataKey="date" label={{ value: 'Day', dy: 25, ...labelStyles }} {...axisStyles} />
            <YAxis
                tickCount={6}
                label={{
                    value: 'Contributions',
                    angle: -90,
                    dx: -25,
                    ...labelStyles,
                }}
                {...axisStyles}
            />
            <Line
                type="monotone"
                dataKey="count"
                stroke={options.colour}
                strokeWidth={4}
                fill={options.colour}
                dot={{ fill: options.dotColour, stroke: options.dotColour }}
            />
            {<Area type="monotone" dataKey="count" fill={options.colour} opacity={0.3} strokeWidth={0} />}
        </ComposedChart>
    );
}
