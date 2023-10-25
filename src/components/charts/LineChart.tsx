import { OptionsWithDimensions } from '@/models/Options';
import { Area, Line } from 'recharts';

interface LineChartProps {
    options: OptionsWithDimensions;
}

export default function LineChart({ options }: LineChartProps) {
    return (
        <>
            <Line
                type="monotone"
                dataKey="count"
                stroke={options.colour}
                strokeWidth={4}
                fill={options.colour}
                dot={{ fill: options.dotColour, stroke: options.dotColour }}
            />
            <Area type="monotone" dataKey="count" fill={options.colour} opacity={0.3} strokeWidth={0} />
        </>
    );
}
