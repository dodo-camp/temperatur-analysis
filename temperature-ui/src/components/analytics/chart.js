import React from 'react';
import {ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar} from 'recharts';

function Chart(props) {
    let {data, name} = props;
    return (
        <ResponsiveContainer width="100%">
            <BarChart
                width={730}
                height={250}
                data={data}
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                    overflowX: 'scroll'
                }}
            >
                <defs>
                    <linearGradient id="colorDate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="ts" label={{offset: 0, position: "insideBottom"}}/>
                <YAxis label={{value: name, angle: -90, position: 'insideLeft'}}/>
                <Tooltip/>
                <Bar dataKey={name} fill="#8884d8"/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default Chart;