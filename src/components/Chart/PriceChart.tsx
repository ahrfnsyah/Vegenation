/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartProps {
  data: { name: string; harga: number }[];
}

const PriceChart: React.FC<ChartProps> = ({ data }) => {
  const formatHarga = (value: number) =>
    value.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  return (
    <ResponsiveContainer width="100%" height={225}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={formatHarga}
          domain={['dataMin - 10', 'dataMax + 10']}
        />
        <Tooltip formatter={(value: any) => formatHarga(value)} />
        <Line
          type="monotone"
          dataKey="harga"
          stroke="#3D8D7A"
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
