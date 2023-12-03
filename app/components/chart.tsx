import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface ChartProps {
  name: String;
  count: number | null;
}
const Chart = ({ data }: { data: ChartProps[] }) => {
  return (
    <ResponsiveContainer width="80%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
