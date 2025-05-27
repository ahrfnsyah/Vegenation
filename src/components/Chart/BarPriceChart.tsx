/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  data: { name: string; harga: number }[];
}

const BarPriceChart: React.FC<ChartProps> = ({ data }) => {
  // Fungsi Format Angka
  const formatHarga = (value: number) =>
    value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ResponsiveContainer width="100%" height={225}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={formatHarga}
          domain={['dataMin - 10', 'dataMax + 10']}
        />
        <Tooltip formatter={(value: any) => formatHarga(value)} />
        <Bar dataKey="harga" fill="#3D8D7A" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarPriceChart;
