import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import Title from '../components/Title';

export default function Chart(props) {
  const theme = useTheme();

  return (
    <>
      <Title>レップ数</Title>
      <ResponsiveContainer>
        <LineChart
          data={props.data}
          margin={{
            top: 16,
            right: 10,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis
            dataKey="XAXIS_DATA"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            type="number"
            domain={[0, Math.max(...props.data.map((d) => d.LINE_DATA))]}
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            {/* <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              レップ数
            </Label> */}
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="LINE_DATA"
            stroke={theme.palette.primary.main}
            dot={true}
          />
          <Tooltip formatter={(value, name) => [value, 'レップ数']} />
          {/* <Legend /> */}
          {/* <Line type="monotone" dataKey="repQty" stroke="#8884d8" /> */}
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
