import { Options } from '@/models/Options';
import { ChartType } from '@/types/enums/ChartType';
import { Area, Bar, Line } from 'recharts';

export default function getChartElements(options: Options): JSX.Element[] {
    switch (options.chart) {
        case ChartType.Line:
            return [
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke={options.colour}
                    strokeWidth={4}
                    fill={options.colour}
                    dot={{ fill: options.dotColour, stroke: options.dotColour }}
                />,
                <Area type="monotone" dataKey="count" fill={options.colour} opacity={0.3} strokeWidth={0} />,
            ];
        case ChartType.Bar:
            return [<Bar dataKey="count" fill={options.colour} />];
    }
}
