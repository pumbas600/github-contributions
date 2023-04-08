import { Options } from '@/models/Options';
import Contribution from '@/types/interfaces/Contribution';
import { Area, CartesianGrid, ComposedChart, Line, LineChart, XAxis, YAxis } from 'recharts';

interface ContributionProps {
    username: string;
    options: Options;
    contributions: Contribution[];
}

export default function ContributionsChart({ username, options, contributions }: ContributionProps) {
    const labelStyles = {
        fill: options.colour,
        fontSize: 20,
        fontWeight: 700,
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
                top: 80,
                right: 20,
                bottom: 30,
                left: 30,
            }}
            style={{
                backgroundColor: options.bgColour,
            }}
        >
            <text
                x={options.width / 2 + 30}
                y={32}
                fill={options.colour}
                textAnchor="middle"
                dominantBaseline="central"
            >
                <tspan fontSize={32} fontWeight={800}>
                    {`${username}'s Contributions`}
                </tspan>
            </text>
            <CartesianGrid strokeDasharray="3 3" stroke={options.colour} strokeOpacity={0.3} />
            <XAxis dataKey="date" label={{ value: 'Day', dy: 15, ...labelStyles }} {...axisStyles} />
            <YAxis
                tickCount={6}
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
                stroke={options.colour}
                strokeWidth={4}
                fill={options.colour}
                dot={{ fill: options.dotColour, stroke: options.dotColour }}
            />
            {options.area && (
                <Area type="monotone" dataKey="count" fill={options.colour} opacity={0.3} strokeWidth={0} />
            )}
        </ComposedChart>
    );
}
